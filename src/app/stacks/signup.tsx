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

    let cleaned = input.replace(/\D/g, ""); // remove tudo que não é número

    if (cleaned.length !== 8) return null;

    const day = cleaned.substring(0, 2);
    const month = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);

    return `${year}-${month}-${day}`; // formato ISO para o banco
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

    // Criar usuário no Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }

    const userId = data?.user?.id;
    if (!userId) {
      Alert.alert("Erro", "Não foi possível criar o usuário.");
      return;
    }

    // Inserir dados no perfil
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
          city
        }
      ]);

    if (profileError) {
      Alert.alert("Erro", profileError.message);
      return;
    }

    // Armazenar localmente
    await AsyncStorage.setItem("user_name", firstName);
    await AsyncStorage.setItem("user_email", email);

    Alert.alert("Sucesso", "Conta criada com sucesso! Verifique seu e-mail.");
    router.push("../tabs/home");
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        {/* Botão de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={32} color="#5E503F" />
        </TouchableOpacity>

        <Text style={styles.welcome}>Crie sua conta</Text>

        <View style={styles.content}>
          {/* Primeiro Nome */}
          <View style={styles.contentInput}>
            <User size={28} color="#8B8B8B" />
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
            <User size={28} color="#8B8B8B" />
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
            <UserCircle size={28} color="#8B8B8B" />
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
            <Calendar size={28} color="#8B8B8B" />
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
            <Phone size={28} color="#8B8B8B" />
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
            <MapPin size={28} color="#8B8B8B" />
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
            <MapPin size={28} color="#8B8B8B" />
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
            <EnvelopeSimple size={28} color="#8B8B8B" />
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
            <LockKey size={28} color="#8B8B8B" />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  welcome: {
    color: "#5E503F",
    marginTop: 150,
    fontSize: 24,
    fontWeight: "600",
  },
  content: {
    width: "100%",
    marginTop: 40,
    alignItems: "center",
    gap: 15,
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
    borderColor: "#D4D4D4",
  },
  input: {
    flex: 1,
    color: "#6B6B6B",
  },
  buttonSignUp: {
    backgroundColor: "#6B8E23",
    width: "100%",
    height: 56,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  buttonSignUpText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "800",
  },
});
