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
        <ArrowLeft size={32} color="#f4f4f4" />
      </TouchableOpacity>

      <Text style={styles.welcome}>Crie sua conta</Text>

      <View style={styles.content}>
        <View style={styles.contentInput}>
          <User size={32} color="#757575" />
          <TextInput
            placeholder="Seu primeiro nome"
            style={styles.input}
            placeholderTextColor="#757575"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.contentInput}>
          <EnvelopeSimple size={32} color="#757575" />
          <TextInput
            placeholder="Seu e-mail"
            style={styles.input}
            placeholderTextColor="#757575"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.contentInput}>
          <LockKey size={32} color="#757575" />
          <TextInput
            placeholder="Sua senha"
            style={styles.input}
            placeholderTextColor="#757575"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye size={24} color="#757575" /> : <EyeSlash size={24} color="#757575" />}
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
    backgroundColor: "#181a20",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  welcome: {
    color: "#f4f4f4",
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
    backgroundColor: "#1f222a",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  input: { flex: 1, color: "#f4f4f4" },
  buttonSignUp: {
    backgroundColor: "#1ab55c",
    width: "100%",
    height: 56,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  buttonSignUpText: { color: "#f4f4f4", fontSize: 16, fontWeight: "800" },
});
