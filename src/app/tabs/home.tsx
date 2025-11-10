import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { supabase } from "../lib/supabase";
import { BellRinging, Bookmark, ChatsTeardrop } from "phosphor-react-native";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("Usuário");
  const [hasNewReservation, setHasNewReservation] = useState(false);
  const [recentReservations, setRecentReservations] = useState([]);

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
    async function loadReservations() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;

      const { data: reservations } = await supabase
        .from("reservations")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });

      if (reservations && reservations.length > 0) {
        setRecentReservations(reservations);
        setHasNewReservation(true);
      }

      const channel = supabase
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

      // Limpa a inscrição ao desmontar
      return () => {
        supabase.removeChannel(channel);
      };
    }

    loadReservations();
  }, []);

  const handleDetails = () => {
    router.push("/stacks/details/index.");
  };

  const handleNotifications = () => {
    router.push("/stacks/details/notifications");
  };

  const popularHotels = [
    {
      name: "Emeralda De Hotel",
      location: "Paris, France",
      price: 450,
      image: require("../assets/hotel.png"),
    },
    {
      name: "Hotel Paradise",
      location: "Rio de Janeiro, Brazil",
      price: 320,
      image: require("../assets/hotel.png"),
    },
    {
      name: "Sunny Resort",
      location: "Miami, USA",
      price: 500,
      image: require("../assets/hotel.png"),
    },
    {
      name: "Mountain Inn",
      location: "Zurich, Switzerland",
      price: 380,
      image: require("../assets/hotel.png"),
    },
    {
      name: "City Lights Hotel",
      location: "Tokyo, Japan",
      price: 420,
      image: require("../assets/hotel.png"),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ChatsTeardrop size={30} color="#7A8C5E" weight="duotone" />
          <Text style={styles.headerLeftText}>LocalLodge</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={handleNotifications}>
            <View style={{ position: "relative" }}>
              <BellRinging size={30} color="#6B4F3E" weight="duotone" />
              {hasNewReservation && <View style={styles.notificationDot} />}
            </View>
          </Pressable>
          <Bookmark size={30} color="#6B4F3E" weight="duotone" />
        </View>
      </View>

      {/* Saudação */}
      <Text style={styles.userName}>Hello, {userName} 👋</Text>

      {/* Hotéis Populares */}
      <Text style={styles.sectionTitle}>Popular</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {popularHotels.map((hotel, index) => (
          <Pressable
            key={index}
            onPress={handleDetails}
            style={styles.popularCard}
          >
            <Image style={styles.popularImage} source={hotel.image} />
            <View style={styles.popularInfo}>
              <Text style={styles.popularTitle}>{hotel.name}</Text>
              <Text style={styles.popularSubTitle}>{hotel.location}</Text>
              <Text style={styles.popularPrice}>
                R$ {hotel.price} / noite
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Divisor */}
      <View style={styles.sectionDivider}>
        <Text style={styles.sectionDividerText}>──────────</Text>
      </View>

      {/* Reservas Recentes */}
      <Text style={styles.sectionTitle}>Reservas recentes</Text>
      <View style={styles.content}>
        {recentReservations.length > 0 ? (
          recentReservations.map((res, index) => (
            <View key={index} style={styles.card}>
              <Pressable onPress={handleDetails} style={styles.cardButton}>
                <Image
                  style={styles.cardImage}
                  source={require("../assets/hotel.png")}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardInfoTitle}>
                    {res.hotel_name || "Hotel Nova Vista"}
                  </Text>
                  <Text style={styles.cardInfoSubTitle}>
                    {res.location || "Posse, Goiás"}
                  </Text>
                </View>
              </Pressable>
              <View style={styles.cardInfoBuy}>
                <Text style={styles.cardInfoBuyText}>
                  R$ {res.price || 450},00
                </Text>
                <Bookmark size={30} color="#f4f4f4" weight="fill" />
              </View>
            </View>
          ))
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: "#7A8C5E",
              marginTop: 20,
            }}
          >
            Nenhuma reserva recente.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerLeftText: {
    color: "#6B4F3E",
    fontSize: 24,
    fontWeight: "800",
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
  userName: {
    paddingBottom: 20,
    color: "#6B4F3E",
    fontSize: 26,
    fontWeight: "800",
  },
  sectionTitle: {
    color: "#9C6B4D",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  content: {
    width: "100%",
    gap: 20,
    paddingBottom: 20,
  },
  card: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#E8D9C5",
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4B999",
  },
  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D4B999",
  },
  cardInfo: {
    height: "100%",
    justifyContent: "center",
    gap: 5,
  },
  cardInfoTitle: {
    color: "#6B4F3E",
    fontSize: 16,
    fontWeight: "500",
  },
  cardInfoSubTitle: {
    color: "#9C6B4D",
    fontSize: 14,
    fontWeight: "300",
  },
  cardInfoBuy: {
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  cardInfoBuyText: {
    color: "#7A8C5E",
    fontSize: 18,
    fontWeight: "900",
  },
  horizontalScroll: { marginBottom: 30 },
  popularCard: {
    width: 260,
    height: 400,
    marginRight: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E8D9C5",
    position: "relative",
    borderWidth: 1,
    borderColor: "#D4B999",
  },
  popularImage: { width: "100%", height: "100%", opacity: 0.9 },
  popularInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(232, 217, 197, 0.8)",
  },
  popularTitle: { color: "#6B4F3E", fontSize: 18, fontWeight: "700" },
  popularSubTitle: { color: "#9C6B4D", fontSize: 14, marginTop: 2 },
  popularPrice: {
    color: "#7A8C5E",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
  },
  sectionDivider: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  sectionDividerText: { color: "#D4B999", fontSize: 24 },
});
