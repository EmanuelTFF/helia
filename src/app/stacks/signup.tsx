import { supabase } from "../lib/supabase";  
import { useRouter } from "expo-router";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { EnvelopeSimple, LockKey, User, Eye, EyeSlash, ArrowLeft } from "phosphor-react-native";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignUp() {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }

    await AsyncStorage.setItem("user_name", name);
    await AsyncStorage.setItem("user_email", email);

    Alert.alert("Sucesso", "Verifique seu e-mail para confirmar sua conta!");
    router.push("../tabs/home");
  }

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={32} color="#5E503F" />
      </TouchableOpacity>

      <Text style={styles.welcome}>Crie sua conta</Text>

      <View style={styles.content}>
        <View style={styles.contentInput}>
          <User size={32} color="#8B8B8B" />
          <TextInput
            placeholder="Seu primeiro nome"
            style={styles.input}
            placeholderTextColor="#8B8B8B"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.contentInput}>
          <EnvelopeSimple size={32} color="#8B8B8B" />
          <TextInput
            placeholder="Seu e-mail"
            style={styles.input}
            placeholderTextColor="#8B8B8B"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.contentInput}>
          <LockKey size={32} color="#8B8B8B" />
          <TextInput
            placeholder="Sua senha"
            style={styles.input}
            placeholderTextColor="#8B8B8B"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye size={24} color="#8B8B8B" /> : <EyeSlash size={24} color="#8B8B8B" />}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleSignUp} style={styles.buttonSignUp}>
        <Text style={styles.buttonSignUpText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Branco puro como fundo principal
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  welcome: {
    color: "#5E503F", // Terracota para o texto de boas-vindas
    marginTop: 150,
    fontSize: 24,
    fontWeight: "600",
  },
  content: {
    width: "100%",
    marginTop: 50,
    alignItems: "center",
    gap: 20,
  },
  contentInput: {
    width: "100%",
    height: 56,
    backgroundColor: "#F0E6D2", 
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: "#D4D4D4", // Borda suave
  },
  input: { 
    flex: 1, 
    color: "#6B6B6B", // Cor do texto mais escura
  },
  buttonSignUp: {
    backgroundColor: "#6B8E23", // Oliva suave para o botão
    width: "100%",
    height: 56,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  buttonSignUpText: { 
    color: "#F5F5F5", // Branco puro para o texto do botão
    fontSize: 16, 
    fontWeight: "800" 
  },
});