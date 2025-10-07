
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../../hooks/useUser';
import { router } from 'expo-router';
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

export default function TicketScreen() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function fetchData() {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    setProfile(profileData);

    const { data: reservationData } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    setReservation(reservationData);
  }

  if (!profile || !reservation) {
    return <Text>Carregando ticket...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Ticket</Text>
      <View style={styles.ticketBox}>
        <Text style={styles.hotelName}>Royale President Hotel</Text>
        <Image source={require('./assets/qr.png')} style={styles.qrCode} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>
            {profile.first_name} {profile.last_name}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.value}>{profile.phone_number}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Check-in</Text>
          <Text style={styles.value}>
            {moment(reservation.check_in).format('DD MMM YYYY')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Check-out</Text>
          <Text style={styles.value}>
            {moment(reservation.check_out).format('DD MMM YYYY')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Hóspedes</Text>
          <Text style={styles.value}>{reservation.guests}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.downloadButton}>
        <Text style={styles.downloadText}>Baixar Ticket</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => router.push('../../tabs/home')}
      >
        <Text style={styles.downloadText}>Voltar para o menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, alignItems: 'center' },
  title: { color: '#5E503F', fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 60 },
  ticketBox: { backgroundColor: '#F0E6D2', padding: 20, borderRadius: 16, width: '100%', alignItems: 'center', marginBottom: 20 },
  hotelName: { color: '#5E503F', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  qrCode: { width: 150, height: 150, marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8 },
  label: { color: '#6B8E23', fontWeight: '500' },
  value: { color: '#5E503F', fontWeight: 'bold' },
  downloadButton: { backgroundColor: '#6B8E23', padding: 15, borderRadius: 30, width: '100%', marginTop: 10 },
  downloadText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' }
});
