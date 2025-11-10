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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  EnvelopeSimple,
  LockKey,
  User,
  Eye,
  EyeSlash,
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  UserCircle,
} from "phosphor-react-native";

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function formatDate(input) {
    if (!input) return null;
    let cleaned = input.replace(/\D/g, "");
    if (cleaned.length !== 8) return null;
    const day = cleaned.substring(0, 2);
    const month = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);
    return `${year}-${month}-${day}`;
  }

  async function handleSignUp() {
    if (!firstName || !lastName || !username || !birthDate || !phone || !country || !city || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    const formattedDate = formatDate(birthDate);
    if (!formattedDate) {
      Alert.alert("Erro", "Data inválida! Use o formato DD/MM/AAAA ou DDMMYYYY");
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }

    const userId = data?.user?.id;
    if (!userId) {
      Alert.alert("Erro", "Não foi possível criar o usuário.");
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          phone_number: phone,
          birth_date: formattedDate,
          country,
          city,
        },
      ]);

    if (profileError) {
      Alert.alert("Erro", profileError.message);
      return;
    }

    await AsyncStorage.setItem("user_name", firstName);
    await AsyncStorage.setItem("user_email", email);

    Alert.alert("Sucesso", "Conta criada com sucesso! Verifique seu e-mail.");
    router.push("../tabs/home");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={32} color="#5E503F" />
          </TouchableOpacity>

          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Complete suas informações para começar</Text>

          <View style={styles.card}>
            <View style={styles.content}>
              {/* Primeiro Nome */}
              <View style={styles.contentInput}>
                <User size={24} color="#6B6B6B" />
                <TextInput
                  placeholder="Primeiro nome"
                  style={styles.input}
                  placeholderTextColor="#8B8B8B"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>

              {/* Sobrenome */}
              <View style={styles.contentInput}>
                <User size={24} color="#6B6B6B" />
                <TextInput
                  placeholder="Sobrenome"
                  style={styles.input}
                  placeholderTextColor="#8B8B8B"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>

              {/* Nome de usuário */}
              <View style={styles.contentInput}>
                <UserCircle size={24} color="#6B6B6B" />
                <TextInput
                  placeholder="Nome de usuário"
                  style={styles.input}
                  placeholderTextColor="#8B8B8B"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              {/* Data de nascimento */}
              <View style={styles.contentInput}>
                <Calendar size={24} color="#6B6B6B" />
                <TextInput
                  placeholder="Data de nascimento (DD/MM/AAAA)"
                  style={styles.input}
                  placeholderTextColor="#8B8B8B"
                  value={birthDate}
                  onChangeText={setBirthDate}
                  keyboardType="numeric"
                />
              </View>

              {/* Telefone */}
              <View style={styles.contentInput}>
                <Phone size={24} color="#6B6B6B" />
                <TextInput
                  placeholder="Telefone"
                  style={styles.input}
                  placeholderTextColor="#8B8B8B"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* País */}
              <View style={styles.contentInput}>
                <MapPin size={24} color="#6B6B6B" />
                <TextInput
                  placeholder="País"
                  style={styles.input}
                  placeholderTextColor="#8B8B8B"
                  value={country}
                  onChangeText={setCountry}
                />
              </View>

              {/* Cidade */}
              <View style={styles.contentInput}>
                <MapPin size={24} color="#6B6B6B" />
                <TextInput
                  placeholder="Cidade"
                  style={styles.input}
                  placeholderTextColor="#8B8B8B"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              {/* Email */}
              <View style={styles.contentInput}>
                <EnvelopeSimple size={24} color="#6B6B6B" />
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

              {/* Senha */}
              <View style={styles.contentInput}>
                <LockKey size={24} color="#6B6B6B" />
                <TextInput
                  placeholder="Sua senha"
                  style={styles.input}
                  placeholderTextColor="#8B8B8B"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Eye size={22} color="#6B6B6B" />
                  ) : (
                    <EyeSlash size={22} color="#6B6B6B" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleSignUp} style={styles.buttonSignUp}>
              <Text style={styles.buttonSignUpText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: "#F5F5F5" },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  title: {
    color: "#5E503F",
    marginTop: 120,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#8B8B8B",
    fontSize: 15,
    marginTop: 6,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#FFF8E7",
    borderRadius: 20,
    marginTop: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  content: {
    gap: 14,
  },
  contentInput: {
    width: "100%",
    height: 54,
    backgroundColor: "#F0E6D2",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0D6BA",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    color: "#4B4B4B",
    fontSize: 15,
  },
  buttonSignUp: {
    backgroundColor: "#6B8E23",
    width: "100%",
    height: 56,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonSignUpText: {
    color: "#F5F5F5",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
