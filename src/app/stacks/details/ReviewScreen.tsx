import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

export default function ReviewScreen() {
  const router = useRouter();

  const [reservation, setReservation] = useState(null);
  const [card, setCard] = useState(null);

  useEffect(() => {
    async function loadData() {
      // Pega usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Pega a última reserva do usuário
      const { data: reservaData, error: reservaError } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!reservaError && reservaData) {
        setReservation(reservaData);
      }

      // Pega o cartão do usuário
      const { data: cardData, error: cardError } = await supabase
        .from('cards')
        .select('last4, name_on_card, expiry')
        .eq('user_id', user.id)
        .single();

      if (!cardError && cardData) {
        setCard(cardData);
      }
    }

    loadData();
  }, []);

  if (!reservation) {
    return <Text style={{ marginTop: 100, textAlign: 'center' }}>Carregando...</Text>;
  }

  const checkIn = moment(reservation.check_in);
  const checkOut = moment(reservation.check_out);
  const totalNights = checkOut.diff(checkIn, 'days');
  const totalPrice = Number(reservation.total_price);
  const taxaServico = totalPrice * 0.10;
  const totalFinal = totalPrice + taxaServico;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento</Text>

      {/* Hotel */}
      <View style={styles.hotelCard}>
        <Image source={require('../../assets/hotel.png')} style={styles.hotelImage} />
        <View style={{ flex: 1 }}>
          <Text style={styles.hotelName}>Royale President</Text>
          <Text style={styles.hotelLocation}>Paris, França</Text>
          <Text style={styles.hotelPrice}>R$ 145 <Text style={{ color: '#5E503F' }}>/ noite</Text></Text>
        </View>
      </View>

      {/* Datas */}
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.label}>Check-in</Text>
          <Text style={styles.value}>{checkIn.format("DD [de] MMMM YYYY")}</Text>
        </View>
        <View>
          <Text style={styles.label}>Check-out</Text>
          <Text style={styles.value}>{checkOut.format("DD [de] MMMM YYYY")}</Text>
        </View>
        <View>
          <Text style={styles.label}>Hóspedes</Text>
          <Text style={styles.value}>{reservation.guests}</Text>
        </View>
      </View>

      {/* Preços */}
      <View style={styles.priceBox}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>{totalNights} Noites</Text>
          <Text style={styles.price}>R$ {totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Taxas & Serviços (10%)</Text>
          <Text style={styles.price}>R$ {taxaServico.toFixed(2)}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>R$ {totalFinal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Cartão */}
      {card && (
        <TouchableOpacity style={styles.cardRow}>
          <Image source={require('./assets/cartao.png')} style={styles.cardIcon} />
          <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
          <Text style={styles.change}>Alterar</Text>
        </TouchableOpacity>
      )}

      {/* Botão confirmar */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => router.push('./PaymentSuccessScreen')}
      >
        <Text style={styles.confirmText}>Confirmar Pagamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20},
  title: { color: '#5E503F', fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 60 },
  hotelCard: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#F0E6D2', borderRadius: 12, padding: 10 },
  hotelImage: { width: 70, height: 70, borderRadius: 8, marginRight: 10 },
  hotelName: { color: '#5E503F', fontSize: 16, fontWeight: 'bold' },
  hotelLocation: { color: '#6B8E23', fontSize: 14 },
  hotelPrice: { color: '#D4A373', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  label: { color: '#6B8E23', fontSize: 12 },
  value: { color: '#5E503F', fontSize: 14, fontWeight: 'bold' },
  priceBox: { backgroundColor: '#F0E6D2', padding: 15, borderRadius: 12, marginBottom: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  priceLabel: { color: '#5E503F', fontSize: 14 },
  price: { color: '#5E503F', fontWeight: 'bold' },
  totalLabel: { color: '#5E503F', fontSize: 16, fontWeight: 'bold' },
  total: { color: '#6B8E23', fontWeight: 'bold', fontSize: 16 },
  separator: { height: 1, backgroundColor: '#D4A373', marginVertical: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0E6D2', padding: 15, borderRadius: 12, marginBottom: 20 },
  cardIcon: { width: 40, height: 30, marginRight: 10 },
  cardNumber: { color: '#5E503F', flex: 1 },
  change: { color: '#6B8E23', fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#6B8E23', padding: 15, borderRadius: 30 },
  confirmText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
