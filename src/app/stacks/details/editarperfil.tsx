import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

export default function EditarPerfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      Alert.alert("Erro", "Usuário não está logado.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "first_name, last_name, username, email, phone_number, birth_date, country, city, gender"
      )
      .eq("user_id", authData.user.id)
      .single();

    if (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    } else {
      setFirstName(data?.first_name || "");
      setLastName(data?.last_name || "");
      setUsername(data?.username || "");
      setEmail(data?.email || "");
      setPhoneNumber(data?.phone_number || "");
      setBirthDate(data?.birth_date || "");
      setCountry(data?.country || "");
      setCity(data?.city || "");
      setGender(data?.gender || "");
    }

    setLoading(false);
  }

  async function salvarPerfil() {
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      Alert.alert("Erro", "Usuário não está logado.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        phone_number: phoneNumber,
        birth_date: birthDate,
        country: country,
        city: city,
        gender: gender,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } else {
      Alert.alert("Sucesso", "Perfil atualizado!");
      router.back();
    }

    setLoading(false);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#6B4F3E" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
       <View style={{ width: 24 }}></View>

      </View>

      <View style={styles.underline} />

      {/* Formulário */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Primeiro Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu primeiro nome"
            placeholderTextColor="#A68A6D"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sobrenome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu sobrenome"
            placeholderTextColor="#A68A6D"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome de Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Escolha um nome de usuário"
            placeholderTextColor="#A68A6D"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor="#A68A6D"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#A68A6D"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            placeholderTextColor="#A68A6D"
            value={birthDate}
            onChangeText={setBirthDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>País</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu país"
            placeholderTextColor="#A68A6D"
            value={country}
            onChangeText={setCountry}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Sua cidade"
            placeholderTextColor="#A68A6D"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gênero</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu gênero"
            placeholderTextColor="#A68A6D"
            value={gender}
            onChangeText={setGender}
          />
        </View>

        <TouchableOpacity
          style={[styles.botao, loading && styles.botaoDisabled]}
          onPress={salvarPerfil}
          disabled={loading}
        >
          <Text style={styles.botaoTexto}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelar}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.cancelarTexto}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: "#E8D9C5",
    paddingHorizontal: 25,
    paddingTop: 70,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#6B4F3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: "#F0E6D8",
    padding: 8,
    borderRadius: 10,
  },
  title: {
    color: "#6B4F3E",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  underline: {
    alignSelf: "center",
    width: 60,
    height: 4,
    backgroundColor: "#7A8C5E",
    borderRadius: 2,
    marginTop: 10,
  },

  formContainer: { paddingHorizontal: 25, paddingTop: 30, paddingBottom: 40 },

  inputGroup: { marginBottom: 20 },
  label: {
    color: "#6B4F3E",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: "#D4B999",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 15,
    color: "#6B4F3E",
    fontWeight: "500",
    fontSize: 15,
    shadowColor: "#D4B999",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  botao: {
    backgroundColor: "#7A8C5E",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#7A8C5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  botaoDisabled: { opacity: 0.6 },
  botaoTexto: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  cancelar: {
    marginTop: 15,
    padding: 16,
    alignItems: "center",
    borderRadius: 15,
  },
  cancelarTexto: {
    color: "#9C6B4D",
    fontSize: 16,
    fontWeight: "600",
  },
});
