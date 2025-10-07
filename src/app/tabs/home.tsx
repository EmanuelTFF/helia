import { useEffect, useState, useCallback } from "react";
import { Image, Pressable, StyleSheet, Text, View, ScrollView, Animated, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { supabase } from "../lib/supabase";
import { BellRinging, Bookmark, ChatsTeardrop, MagnifyingGlass, MapPin, Star } from "phosphor-react-native";

const { width: screenWidth } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("Usuário");
  const [hasNewReservation, setHasNewReservation] = useState(false);
  const [recentReservations, setRecentReservations] = useState<any[]>([]);

  // Animações
  const pulseAnim = new Animated.Value(1);
  const bounceAnim = new Animated.Value(1);
  const fadeAnim = new Animated.Value(0);

  // Atualiza o nome quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      async function loadUser() {
        try {
          const { data: authData } = await supabase.auth.getUser();
          if (!authData?.user) return;

          const { data: profileData } = await supabase
            .from("profiles")
            .select("first_name, username")
            .eq("user_id", authData.user.id)
            .single();

          if (profileData?.username) {
            setUserName(profileData.username);
            await AsyncStorage.setItem("user_name", profileData.username);
          } else if (profileData?.first_name) {
            setUserName(profileData.first_name);
            await AsyncStorage.setItem("user_name", profileData.first_name);
          }
        } catch (error) {
          console.error("Erro ao carregar username:", error);
        }
      }

      loadUser();
    }, [])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    async function loadReservations() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;

      // Busca últimas reservas
      const { data: reservations } = await supabase
        .from("reservations")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });

      if (reservations && reservations.length > 0) {
        setRecentReservations(reservations);
        setHasNewReservation(true);
      }

      // Escuta novas reservas em tempo real
      supabase
        .channel("reservations-changes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "reservations" },
          (payload) => {
            if (payload.new.user_id === authData.user.id) {
              setRecentReservations((prev) => [payload.new, ...prev]);
              setHasNewReservation(true);
            }
          }
        )
        .subscribe();
    }

    loadReservations();
  }, []);

  // Efeito de animação quando tem nova notificação
  useEffect(() => {
    if (hasNewReservation) {
      // Animação de pulsar
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animação de pular
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.delay(2000),
        ])
      ).start();
    } else {
      // Para as animações quando não há notificação
      pulseAnim.stopAnimation();
      bounceAnim.stopAnimation();
    }
  }, [hasNewReservation]);

  function handleDetails() {
    router.push("/stacks/details/index");
  }

  function handleNotifications() {
    setHasNewReservation(false);
    router.push("/stacks/details/notifications");
  }

  function handleSearch() {
    router.push("/stacks/search");
  }

  // Lista de hotéis populares
  const popularHotels = [
    {
      name: "Emeralda De Hotel",
      location: "Paris, France",
      price: 450,
      rating: 4.8,
      image: require("../assets/hotel.png")
    },
    {
      name: "Hotel Paradise",
      location: "Rio de Janeiro, Brazil",
      price: 320,
      rating: 4.6,
      image: require("../assets/hotel.png")
    },
    {
      name: "Sunny Resort",
      location: "Miami, USA",
      price: 500,
      rating: 4.9,
      image: require("../assets/hotel.png")
    },
    {
      name: "Mountain Inn",
      location: "Zurich, Switzerland",
      price: 380,
      rating: 4.7,
      image: require("../assets/hotel.png")
    },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <StatusBar style="dark" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <ChatsTeardrop size={28} color="#7A8C5E" weight="fill" />
              <Text style={styles.headerLeftText}>LocalLodge</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable onPress={handleNotifications} style={styles.notificationButton}>
              <Animated.View style={[
                styles.bellContainer,
                { transform: [{ scale: bounceAnim }] }
              ]}>
                <BellRinging size={26} color="#6B4F3E" weight="duotone" />
              </Animated.View>

              {hasNewReservation && (
                <Animated.View
                  style={[
                    styles.notificationPulse,
                    { transform: [{ scale: pulseAnim }] }
                  ]}
                >
                  <View style={styles.notificationDot} />
                </Animated.View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Saudação */}
        <View style={styles.greetingContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{String(userName)}! 👋</Text>
        </View>



        {/* Hotéis Populares */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Hotels</Text>
          <Pressable>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {popularHotels.map((hotel, index) => (
            <Pressable key={index} onPress={handleDetails} style={styles.popularCard}>
              <Image style={styles.popularImage} source={hotel.image} />
              <View style={styles.popularOverlay} />
              <View style={styles.popularInfo}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" weight="fill" />
                  <Text style={styles.ratingText}>{hotel.rating}</Text>
                </View>
                <Text style={styles.popularTitle}>{hotel.name}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#9C6B4D" weight="light" />
                  <Text style={styles.popularSubTitle}>{hotel.location}</Text>
                </View>
                <Text style={styles.popularPrice}>R$ {hotel.price}/night</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Divisor Sutil */}
        <View style={styles.divider} />

        {/* Recentes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Booked</Text>
          <Pressable>
            <Text style={styles.seeAllText}>View all</Text>
          </Pressable>
        </View>

        <View style={styles.recentContent}>
          {recentReservations.length > 0 ? (
            recentReservations.map((res, index) => (
              <Pressable key={index} onPress={handleDetails} style={styles.recentCard}>
                <Image style={styles.recentImage} source={require("../assets/hotel.png")} />
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle}>{res.hotel_name || "Hotel Nova Vista"}</Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color="#9C6B4D" weight="light" />
                    <Text style={styles.recentSubTitle}>{res.location || "Posse, Goiás"}</Text>
                  </View>
                  <Text style={styles.recentPrice}>R$ {res.price || 450},00</Text>
                </View>
                <View style={styles.bookmarkContainer}>
                  <Bookmark size={20} color="#7A8C5E" weight="fill" />
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent bookings</Text>
              <Text style={styles.emptyStateSubText}>Your upcoming trips will appear here</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFEFE",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLeftText: {
    color: "#6B4F3E",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  bellContainer: {
    // Container para a animação do sino
  },
  notificationPulse: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 10,
  },
  notificationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF6B6B",
    borderWidth: 2,
    borderColor: "#FEFEFE",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  greetingContainer: {
    marginBottom: 24,
  },
  welcomeText: {
    color: "#9C6B4D",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 4,
  },
  userName: {
    color: "#6B4F3E",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F4F0",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#E8D9C5",
  },
  searchText: {
    color: "#9C6B4D",
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "400",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#6B4F3E",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  seeAllText: {
    color: "#7A8C5E",
    fontSize: 14,
    fontWeight: "600",
  },
  horizontalScroll: {
    marginBottom: 32,
  },
  horizontalScrollContent: {
    paddingRight: 24,
  },
  popularCard: {
    width: screenWidth * 0.75,
    height: 320,
    marginRight: 16,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#E8D9C5",
    position: "relative",
    borderWidth: 1,
    borderColor: "#D4B999",
    shadowColor: "#6B4F3E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  popularImage: {
    width: "100%",
    height: "100%",
  },
  popularOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    backgroundGradient: "linear-gradient(transparent, rgba(0,0,0,0.7))",
  },
  popularInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  ratingText: {
    color: "#6B4F3E",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  popularTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  popularSubTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 4,
  },
  popularPrice: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0E6D6",
    marginBottom: 32,
  },
  recentContent: {
    gap: 16,
    paddingBottom: 40,
  },
  recentCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0E6D6",
    shadowColor: "#6B4F3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  recentImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  recentInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  recentTitle: {
    color: "#6B4F3E",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  recentSubTitle: {
    color: "#9C6B4D",
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 4,
  },
  recentPrice: {
    color: "#7A8C5E",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },
  bookmarkContainer: {
    padding: 8,
    alignSelf: "flex-start",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: "#9C6B4D",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyStateSubText: {
    color: "#9C6B4D",
    fontSize: 14,
    fontWeight: "400",
    opacity: 0.7,
  },
});