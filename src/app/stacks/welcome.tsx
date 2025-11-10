import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/stacks/login");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/welcome-image.png")}
        style={styles.background}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "transparent"]}
          locations={[0.4, 0.8]}
          style={styles.overlay}
        />
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Bem-vindo ao </Text>
          <Text style={styles.title}>LocalLodge</Text>
          <Text style={styles.subtitle}>
            Sua próxima experiência começa aqui!
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <LinearGradient
              colors={["#6B8E23", "#6B8E23"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Começar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    alignItems: "flex-start",
    paddingHorizontal: 40,
    position: "absolute",
    bottom: 120,
    width: "100%",
  },
  welcomeText: {
    fontSize: 28,
    color: "#F5F5F5", // Branco puro
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  title: {
    fontSize: 56,
    color: "#F5F5F5", // Branco puro
    fontWeight: "800",
    marginVertical: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: "#E0E0E0", // Cinza claro
    textAlign: "left",
    marginBottom: 40,
    width: "80%",
    lineHeight: 26,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#F5F5F5", // Branco puro
    fontWeight: "600",
  },
});