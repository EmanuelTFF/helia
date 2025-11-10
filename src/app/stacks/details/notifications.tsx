import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { ArrowLeft, Bell, Calendar, Users, Coin, Clock } from "phosphor-react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Notifications() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReservations() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;

      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setReservations(data || []);

      setLoading(false);
    }

    loadReservations();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#6B4F3E" weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>Reservas</Text>
        <View style={styles.underline} />
      </View>

      {/* Conteúdo */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="hourglass-top" size={48} color="#D4B999" />
            <Text style={styles.emptyStateTitle}>Carregando...</Text>
            <Text style={styles.emptyStateText}>Buscando suas reservas</Text>
          </View>
        ) : reservations.length > 0 ? (
          <>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Bell size={24} color="#7A8C5E" weight="fill" />
                <Text style={styles.statNumber}>{reservations.length}</Text>
                <Text style={styles.statLabel}>Reservas</Text>
              </View>
              <View style={styles.statItem}>
                <Coin size={24} color="#7A8C5E" weight="fill" />
                <Text style={styles.statNumber}>
                  {formatPrice(reservations.reduce((total, item) => total + (item.total_price || 0), 0))}
                </Text>
                <Text style={styles.statLabel}>Total Gasto</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Suas Reservas</Text>

            {reservations.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, { backgroundColor: '#7A8C5E' }]} />
                    <Text style={styles.statusText}>Confirmada</Text>
                  </View>
                  <Text style={styles.cardDate}>
                    {formatDateTime(item.created_at)}
                  </Text>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Calendar size={18} color="#6B4F3E" weight="bold" />
                    <Text style={styles.infoText}>
                      Check-in: {formatDate(item.check_in)}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Calendar size={18} color="#6B4F3E" weight="bold" />
                    <Text style={styles.infoText}>
                      Check-out: {formatDate(item.check_out)}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Users size={18} color="#6B4F3E" weight="bold" />
                    <Text style={styles.infoText}>
                      {item.guests} hóspede{item.guests > 1 ? 's' : ''}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Coin size={18} color="#6B4F3E" weight="bold" />
                    <Text style={styles.priceText}>
                      {formatPrice(item.total_price)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Clock size={14} color="#7A8C5E" />
                  <Text style={styles.footerText}>
                    Reserva criada em {formatDateTime(item.created_at)}
                  </Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-off" size={48} color="#D4B999" />
            <Text style={styles.emptyStateTitle}>Nenhuma notificação</Text>
            <Text style={styles.emptyStateText}>
              Você ainda não fez nenhuma reserva. Que tal explorar alguns destinos?
            </Text>
            <Pressable
              style={styles.exploreButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.exploreButtonText}>Explorar Destinos</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#E8D9C5",
    paddingHorizontal: 25,
    paddingTop: 70,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#6B4F3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 25,
    top: 70,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  headerTitle: {
    color: "#6B4F3E",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  underline: {
    width: 60,
    height: 4,
    backgroundColor: "#7A8C5E",
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "#6B4F3E",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    color: "#7A8C5E",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#6B4F3E",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    marginLeft: 5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: "#7A8C5E",
    fontSize: 12,
    fontWeight: "600",
  },
  cardDate: {
    color: "#9C6B4D",
    fontSize: 11,
    fontWeight: "500",
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    color: "#6B4F3E",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
  },
  priceText: {
    color: "#7A8C5E",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  footerText: {
    color: "#7A8C5E",
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    color: "#6B4F3E",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    color: "#6B6B6B",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 25,
  },
  exploreButton: {
    backgroundColor: "#7A8C5E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});