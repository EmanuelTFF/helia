import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase'; // ajuste o caminho conforme seu projeto

export default function AdicionarCartao() {
  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');

  const [isCvvFocused, setIsCvvFocused] = useState(false);

  const flipAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  // ---------------------------
  // RECUPERAR CARTÃO SALVO
  // ---------------------------
  useEffect(() => {
    const fetchSavedCard = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return;

        // Buscar cartão salvo
        const { data: card, error } = await supabase
          .from('cards')
          .select('last4, name_on_card, expiry')
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (error || !card) return;

        // Atualiza os estados para mostrar no formulário
        setNumero('••••••••••••' + card.last4); // mostra apenas os últimos 4
        setNome(card.name_on_card);
        setValidade(card.expiry);

      } catch (err) {
        console.error('Erro ao buscar cartão salvo:', err);
      }
    };

    fetchSavedCard();
  }, []);

  // ---------------------------
  // ANIMAÇÃO FLIP
  // ---------------------------
  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isCvvFocused ? 1 : 0,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isCvvFocused, flipAnimation]);

  // ---------------------------
  // SALVAR CARTÃO
  // ---------------------------
  const salvarCartao = async () => {
    try {
      if (numero.replace(/\D/g, '').length < 16) {
        alert('Digite o número completo do cartão (16 dígitos).');
        return;
      }
      if (!nome.trim() || !validade.trim()) {
        alert('Preencha todos os campos do cartão.');
        return;
      }

      const last4 = numero.slice(-4);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError;

      // Inserir ou atualizar cartão no Supabase
      const { data: existingCard } = await supabase
        .from('cards')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (existingCard) {
        await supabase.from('cards')
          .update({ last4, name_on_card: nome, expiry: validade })
          .eq('user_id', user.id);
      } else {
        await supabase.from('cards').insert([
          { user_id: user.id, last4, name_on_card: nome, expiry: validade }
        ]);
      }

      // Salvar localmente (opcional)
      await AsyncStorage.setItem(
        'cartaoSalvo',
        JSON.stringify({ last4, nome, validade })
      );

      router.back();
    } catch (error) {
      console.error('Erro ao salvar o cartão:', error);
      alert('Erro ao salvar o cartão. Tente novamente.');
    }
  };

  // ---------------------------
  // RESTANTE DO CÓDIGO (FORM + ANIMAÇÃO)
  // ---------------------------
  const formatCardNumber = (num: string) => {
    if (!num) return '•••• •••• •••• ••••';
    const cleaned = num.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substring(i, i + 4));
    }
    return parts.join(' ').substring(0, 19) || '•••• •••• •••• ••••';
  };

  const formatExpiry = (exp: string) => {
    if (!exp) return 'MM/AA';
    const cleaned = exp.replace(/\D/g, '');
    if (cleaned.length === 1) return cleaned;
    if (cleaned.length > 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
  };

  return (
    <View style={styles.container}>
      {/* FRONT + BACK CARD ANIMATION */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[styles.card, frontAnimatedStyle, styles.cardFront, { zIndex: isCvvFocused ? 0 : 2 }]}
        >
          <View style={styles.cardTopRow}>
            <View style={styles.chip} />
            <View style={styles.brand} />
          </View>
          <Text style={styles.number}>{formatCardNumber(numero)}</Text>
          <View style={styles.row}>
            <Text style={styles.name}>{nome ? nome.toUpperCase() : 'NOME NO CARTÃO'}</Text>
            <View style={styles.expiryBox}>
              <Text style={styles.expiryLabel}>VALIDADE</Text>
              <Text style={styles.expiry}>{formatExpiry(validade)}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.card, styles.cardBack, backAnimatedStyle, { zIndex: isCvvFocused ? 3 : 1 }]}
        >
          <View style={styles.strip} />
          <View style={styles.cvvWrapper}>
            <Text style={styles.cvvLabel}>CVV</Text>
            <View style={styles.cvvField}>
              <Text style={styles.cvvText}>{cvv ? cvv : '•••'}</Text>
            </View>
          </View>
          <View style={styles.brandBack} />
        </Animated.View>
      </View>

      {/* FORM */}
      <Text style={styles.label}>Número do cartão</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="1234 5678 9012 3456"
        placeholderTextColor="#9b9188"
        value={numero}
        onChangeText={(text) => setNumero(text.replace(/\D/g, ''))}
        maxLength={16}
        onFocus={() => setIsCvvFocused(false)}
      />
      <Text style={styles.label}>Nome no cartão</Text>
      <TextInput
        style={styles.input}
        placeholder="JOÃO DA SILVA"
        placeholderTextColor="#9b9188"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="characters"
        onFocus={() => setIsCvvFocused(false)}
      />
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Vencimento</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/AA"
            placeholderTextColor="#9b9188"
            value={validade}
            onChangeText={(text) => setValidade(text.replace(/\D/g, ''))}
            maxLength={4}
            keyboardType="numeric"
            onFocus={() => setIsCvvFocused(false)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            placeholderTextColor="#9b9188"
            keyboardType="numeric"
            value={cvv}
            onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
            maxLength={3}
            onFocus={() => setIsCvvFocused(true)}
            onBlur={() => setTimeout(() => setIsCvvFocused(false), 100)}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => { Keyboard.dismiss(); salvarCartao(); }}>
        <Text style={styles.buttonText}>Salvar e continuar</Text>
      </TouchableOpacity>
    </View>
  );
}


const CARD_WIDTH = 340;
const CARD_HEIGHT = 200;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8f5', padding: 20 },
  cardContainer: {
    height: CARD_HEIGHT,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:50,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    padding: 30,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    justifyContent: 'space-between',
  },
  cardFront: {
    backgroundColor: '#2b6f5a', // verde profundo
  },
  cardBack: {
    backgroundColor: '#1f5a43',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { width: 52, height: 36, backgroundColor: '#f7e7b6', borderRadius: 6 },
  brand: { width: 60, height: 36, backgroundColor: '#f7e7b6', borderRadius: 6 },
  brandBack: { width: 60, height: 36, backgroundColor: '#f7e7b6', borderRadius: 6, alignSelf: 'flex-end' },
  number: { fontSize: 20, color: '#fff', letterSpacing: 2, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 13, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, maxWidth: '60%' },
  expiryBox: { alignItems: 'flex-end' },
  expiryLabel: { fontSize: 10, color: 'rgba(255,255,255,0.85)' },
  expiry: { fontSize: 14, color: '#fff', fontWeight: '700' },

  /* Back */
  strip: {
    width: '100%',
    height: 44,
    backgroundColor: '#000',
    position: 'absolute',
    top: 18,
    left: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  cvvWrapper: {
    width: '100%',
    paddingHorizontal: 18,
    marginTop: 80,
    alignItems: 'flex-end',
  },
  cvvLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginBottom: 6 },
  cvvField: {
    backgroundColor: '#fff',
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 14,
    width: '60%',
  },
  cvvText: { color: '#000', fontWeight: '700', letterSpacing: 2 },

  label: { fontWeight: '600', marginBottom: 6, color: '#3f3a36', fontSize: 14 },
  input: {
    backgroundColor: '#fff',
    padding: Platform.OS === 'ios' ? 14 : 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#efe6df',
  },
 button: {
     backgroundColor: '#FAFAFA', // cor que você mandou
     padding: 16,
     borderRadius: 12,
     alignItems: 'center',
     marginTop: 50,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 6 },
     shadowOpacity: 0.12,
     shadowRadius: 10,
     elevation: 4,
 },
 buttonText: {
     color: '#2b6f5a', // texto escuro para contrastar com fundo claro
     fontWeight: 'bold',
     fontSize: 16,
 },

});
