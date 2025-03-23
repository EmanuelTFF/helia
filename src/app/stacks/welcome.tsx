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
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          style={styles.overlay}
        />
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Bem-vindo ao 👋</Text>
          <Text style={styles.title}>Xstay</Text>
          <Text style={styles.subtitle}>
            Sua próxima experiência começa aqui!
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Começar</Text>
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
    bottom: 150,
    width: "100%",
  },
  welcomeText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 56,
    color: "#4CAF50",
    fontWeight: "bold",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#ddd",
    textAlign: "left",
    marginBottom: 30,
    width: "80%",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});