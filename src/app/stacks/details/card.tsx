import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase'; // ajuste o caminho conforme seu projeto

export default function AdicionarCartao() {
  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [flipped, setFlipped] = useState(false);

  const flipAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const flipCard = (toBack = true) => {
    Animated.timing(flipAnimation, {
      toValue: toBack ? 1 : 0,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setFlipped(toBack));
  };

  const salvarCartao = async () => {
    const last4 = numero.slice(-4);
    const cartao = {
      numero: last4,
      nome,
      validade,
    };

    try {
      // Salvar localmente
      await AsyncStorage.setItem('cartaoSalvo', JSON.stringify(cartao));

      // Obter usuário logado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Salvar no banco Supabase
      const { error } = await supabase
        .from('cards')
        .insert([
          {
            user_id: user.id,
            last4,
            name_on_card: nome,
            expiry: validade
          }
        ]);

      if (error) throw error;

      router.back();
    } catch (error) {
      console.error('Erro ao salvar o cartão:', error);
    }
  };

  const formatCardNumber = (num) => {
    if (!num) return '•••• •••• •••• ••••';
    const cleaned = num.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substring(i, i + 4));
    }
    return parts.join(' ').substring(0, 19);
  };

  const formatExpiry = (exp) => {
    if (!exp) return 'MM/AA';
    const cleaned = exp.replace(/\D/g, '');
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
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, frontAnimatedStyle, { zIndex: flipped ? 0 : 1 }]}>
          <View style={styles.chip} />
          <Text style={styles.number}>{formatCardNumber(numero)}</Text>
          <View style={styles.row}>
            <Text style={styles.name}>{nome.toUpperCase() || 'NOME NO CARTÃO'}</Text>
            <View>
              <Text style={styles.expiryLabel}>VALIDADE</Text>
              <Text style={styles.expiry}>{formatExpiry(validade) || 'MM/AA'}</Text>
            </View>
          </View>
          <View style={styles.brand} />
        </Animated.View>

        <Animated.View style={[styles.card, styles.back, backAnimatedStyle, { zIndex: flipped ? 1 : 0 }]}>
          <View style={styles.strip} />
          <View style={styles.cvvBox}>
            <Text style={styles.cvvLabel}>CVV</Text>
            <View style={styles.cvvField}>
              <Text style={styles.cvvText}>{cvv || '•••'}</Text>
            </View>
          </View>
          <View style={styles.brandBack} />
        </Animated.View>
      </View>

      <Text style={styles.label}>Número do cartão</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="1234 5678 9012 3456"
        value={numero}
        onChangeText={(text) => setNumero(text.replace(/\D/g, ''))}
        maxLength={16}
      />

      <Text style={styles.label}>Nome no cartão</Text>
      <TextInput
        style={styles.input}
        placeholder="JOÃO DA SILVA"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="characters"
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Vencimento</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/AA"
            value={validade}
            onChangeText={(text) => setValidade(text.replace(/\D/g, ''))}
            maxLength={4}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            keyboardType="numeric"
            value={cvv}
            onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
            maxLength={3}
            onFocus={() => flipCard(true)}
            onBlur={() => flipCard(false)}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={salvarCartao}>
        <Text style={styles.buttonText}>Salvar e continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  cardContainer: { height: 200, marginBottom: 32, alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '100%', height: 200, backgroundColor: '#a58f7c', borderRadius: 16, padding: 20,
    position: 'absolute', backfaceVisibility: 'hidden', justifyContent: 'space-between'
  },
  back: { backgroundColor: '#8a7866', alignItems: 'flex-end', justifyContent: 'center' },
  chip: { width: 50, height: 30, backgroundColor: '#d4af37', borderRadius: 5 },
  brand: { width: 60, height: 40, backgroundColor: '#d4af37', borderRadius: 5, alignSelf: 'flex-end' },
  brandBack: { width: 60, height: 40, backgroundColor: '#d4af37', borderRadius: 5, alignSelf: 'flex-end' },
  number: { fontSize: 22, color: '#fff', letterSpacing: 2, fontWeight: 'bold' },
  name: { fontSize: 14, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, maxWidth: '60%' },
  expiryLabel: { fontSize: 8, color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
  expiry: { fontSize: 14, color: '#fff', letterSpacing: 1 },
  strip: { width: '100%', height: 40, backgroundColor: '#000', position: 'absolute', top: 20 },
  cvvBox: { width: '80%', paddingRight: 20, alignSelf: 'flex-end' },
  cvvLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginBottom: 5, textAlign: 'right' },
  cvvField: { backgroundColor: '#fff', height: 30, borderRadius: 4, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 10 },
  cvvText: { color: '#000', fontWeight: 'bold', letterSpacing: 1 },
  label: { fontWeight: '600', marginBottom: 4, color: '#5a4c41', fontSize: 14 },
  input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  button: {
    backgroundColor: '#a58f7c', padding: 16, borderRadius: 8, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
