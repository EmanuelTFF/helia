import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import {
  BellRinging,
  Bookmark,
  ChatsTeardrop,
} from "phosphor-react-native";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    async function loadUser() {
      const storedName = await AsyncStorage.getItem("user_name");
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserName(storedName || "Usuário");
      }
    }
    loadUser();
  }, []);

  function handleDetails() {
    router.push("/stacks/details/index.");
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ChatsTeardrop size={30} color="#7A8C5E" weight="duotone" /> {/* Oliva suave */}
          <Text style={styles.headerLeftText}>LocalLodge</Text>
        </View>
        <View style={styles.headerRight}>
          <BellRinging size={30} color="#6B4F3E" weight="duotone" /> {/* Mocca mousse escuro */}
          <Bookmark size={30} color="#6B4F3E" weight="duotone" /> {/* Mocca mousse escuro */}
        </View>
      </View>

      <Text style={styles.userName}>Hello, {userName} 👋</Text>
      <Text style={styles.sectionTitle}>Popular</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {[...Array(5)].map((_, index) => (
          <Pressable key={index} onPress={handleDetails} style={styles.popularCard}>
            <Image style={styles.popularImage} source={require("../assets/hotel.png")} />
            <View style={styles.popularInfo}>
              <Text style={styles.popularTitle}>Emeralda De Hotel</Text>
              <Text style={styles.popularSubTitle}>Paris, France</Text>
              <Text style={styles.popularPrice}>R$ 450 / noite</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      {/* Divisor entre as seções */}
      <View style={styles.sectionDivider}>
        <Text style={styles.sectionDividerText}>‒‒‒‒‒‒‒‒‒‒‒</Text>
      </View>

      <Text style={styles.sectionTitle}>Recently Booked</Text>

      <View style={styles.content}>
        {[...Array(5)].map((_, index) => (
          <View key={index} style={styles.card}>
            <Pressable onPress={handleDetails} style={styles.cardButton}>
              <Image style={styles.cardImage} source={require("../assets/hotel.png")} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardInfoTitle}>Hotel Nova Vista</Text>
                <Text style={styles.cardInfoSubTitle}>Posse, Goiás</Text>
              </View>
            </Pressable>
            <View style={styles.cardInfoBuy}>
              <Text style={styles.cardInfoBuyText}>R$ 450,00</Text>
              <Bookmark size={30} color="#f4f4f4" weight="fill" />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0E8", // Fundo creme claro (mocca mousse claro)
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLeftText: {
    color: "#6B4F3E", // Mocca mousse escuro
    fontSize: 24,
    fontWeight: "800",
  },
  userName: {
    paddingBottom: 20,
    color: "#6B4F3E", // Mocca mousse escuro
    fontSize: 26,
    fontWeight: "800",
  },
  sectionTitle: {
    color: "#9C6B4D", // Terracota médio
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
    backgroundColor: "#E8D9C5", // Mocca mousse claro
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4B999", // Borda mocca mousse
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
    borderColor: "#D4B999", // Borda mocca mousse
  },
  cardInfo: {
    height: "100%",
    justifyContent: "center",
    gap: 5,
  },
  cardInfoTitle: {
    color: "#6B4F3E", // Mocca mousse escuro
    fontSize: 16,
    fontWeight: "500",
  },
  cardInfoSubTitle: {
    color: "#9C6B4D", // Terracota médio
    fontSize: 14,
    fontWeight: "300",
  },
  cardInfoBuy: {
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  cardInfoBuyText: {
    color: "#7A8C5E", // Oliva suave
    fontSize: 18,
    fontWeight: "900",
  },
  horizontalScroll: {
    marginBottom: 30,
  },
  popularCard: {
    width: 260,
    height: 400,
    marginRight: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E8D9C5", // Mocca mousse claro
    position: "relative",
    borderWidth: 1,
    borderColor: "#D4B999", // Borda mocca mousse
  },
  popularImage: {
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  popularInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(232, 217, 197, 0.8)", // Mocca mousse claro com transparência
  },
  popularTitle: {
    color: "#6B4F3E", // Mocca mousse escuro
    fontSize: 18,
    fontWeight: "700",
  },
  popularSubTitle: {
    color: "#9C6B4D", // Terracota médio
    fontSize: 14,
    marginTop: 2,
  },
  popularPrice: {
    color: "#7A8C5E", // Oliva suave
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
  },
  sectionDivider: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  sectionDividerText: {
    color: "#D4B999", // Mocca mousse médio
    fontSize: 24,
  },
});