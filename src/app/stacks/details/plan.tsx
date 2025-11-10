import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PremiumPlansScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const plans = [
    {
      name: "Premium",
      price: "R$14,90 / mês",
      description: "Para quem busca desempenho máximo.",
      features: [
        "Acesso ilimitado a todos os recursos",
        "Suporte prioritário 24h",
        "Interface livre de anúncios",
      ],
      gradient: ["#EBDAC3", "#FFFFFF"],
      icon: "award",
    },
   {
     name: "Empresarial",
     price: "Sob consulta",
     description: "Solução completa e personalizada para hotéis e redes.",
     features: [
       "Painel administrativo avançado",
       "Gerenciamento de múltiplos usuários",
       "Relatórios detalhados de desempenho",
       "Suporte técnico dedicado 24h",
       "Destaque e recomendações prioritárias dentro do app",
     ],
     gradient: ["#D9D2C3", "#F6F3EE"],
     icon: "briefcase",
   },

  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Cabeçalho */}
      <LinearGradient
        colors={["#EBDAC3", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#7A8B5A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planos Premium</Text>
        <View style={{ width: 26 }} />
      </LinearGradient>

      {/* Subtítulo */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.subtitle}>
          Escolha o plano ideal para você e eleve sua experiência.
        </Text>
      </Animated.View>

      {/* Planos */}
      <View style={styles.plansContainer}>
        {plans.map((plan, index) => (
          <Animated.View
            key={index}
            style={[
              styles.planCard,
              { opacity: fadeAnim, transform: [{ translateY: 15 * (index + 1) }] },
            ]}
          >
            <LinearGradient
              colors={plan.gradient}
              style={styles.gradientBox}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.iconCircle}>
                <Feather name={plan.icon as any} size={24} color="#7A8B5A" />
              </View>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planDescription}>{plan.description}</Text>

              <View style={styles.divider} />

              {plan.features.map((feature, i) => (
                <View key={i} style={styles.featureItem}>
                  <MaterialIcons
                    name="check-circle-outline"
                    size={18}
                    color="#7A8B5A"
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  plan.name === "Premium" && styles.selectButtonPrimary,
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.selectText}>Assinar agora</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  header: {
    paddingTop: 55,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  backButton: {
    backgroundColor: "#F0E6D8",
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#7A8B5A",
  },
  subtitle: {
    fontSize: 14,
    color: "#6C6C6C",
    textAlign: "center",
    marginHorizontal: 25,
    marginTop: 25,
    marginBottom: 15,
  },
  plansContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  planCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  gradientBox: {
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0E6D8",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  planName: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#3A3A3A",
  },
  planPrice: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#7A8B5A",
    marginTop: 6,
  },
  planDescription: {
    textAlign: "center",
    color: "#555",
    fontSize: 13,
    marginTop: 6,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0DCD2",
    marginVertical: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 8,
  },
  selectButton: {
    backgroundColor: "#7A8B5A",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 18,
    alignItems: "center",
  },
  selectButtonPrimary: {
    backgroundColor: "#5E7445",
  },
  selectText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});
