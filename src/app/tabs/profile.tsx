import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";
import { MaterialIcons, FontAwesome, Feather } from "@expo/vector-icons";

export default function CompleteProfile() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [avatar, setAvatar] = useState(null);

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  }

  async function handleSaveProfile() {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return;

    let avatarUrl = null;
    if (avatar) {
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const { data, error } = await supabase.storage.from("avatars").upload(fileName, {
        uri: avatar,
        type: "image/jpeg",
        name: fileName,
      });
      if (error) {
        console.error("Erro ao enviar imagem:", error.message);
        return;
      }
      avatarUrl = data.path;
    }

    const { error } = await supabase.from("profiles").update({
      birth_date: birthDate,
      phone_number: phoneNumber,
      gender,
      country,
      avatar_url: avatarUrl,
    }).eq("user_id", user.id);

    if (error) {
      console.error("Erro ao salvar perfil:", error.message);
    } else {
      router.push("./tabs/home");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#1ab65c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complete seu Perfil</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
            <Image
              source={avatar ? { uri: avatar } : require("../assets/default-avatar.png")}
              style={styles.avatar}
            />
            <View style={styles.cameraIcon}>
              <FontAwesome name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarText}>Adicionar foto</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Birth Date */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="event" size={20} color="#757575" style={styles.inputIcon} />
            <TextInput
              placeholder="Data de Nascimento"
              placeholderTextColor="#757575"
              style={styles.input}
              value={birthDate}
              onChangeText={setBirthDate}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <Feather name="phone" size={20} color="#757575" style={styles.inputIcon} />
            <TextInput
              placeholder="Telefone"
              placeholderTextColor="#757575"
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Gender */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="person-outline" size={20} color="#757575" style={styles.inputIcon} />
            <TextInput
              placeholder="Gênero"
              placeholderTextColor="#757575"
              style={styles.input}
              value={gender}
              onChangeText={setGender}
            />
          </View>

          {/* Country */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="location-on" size={20} color="#757575" style={styles.inputIcon} />
            <TextInput
              placeholder="País"
              placeholderTextColor="#757575"
              style={styles.input}
              value={country}
              onChangeText={setCountry}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#181a20",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    color: "#f4f4f4",
    fontSize: 18,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#1ab65c",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#1ab65c",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#f4f4f4",
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f222a",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 56,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#f4f4f4",
    fontSize: 16,
    height: "100%",
  },
  button: {
    backgroundColor: "#1ab65c",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#1ab65c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
});