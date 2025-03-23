import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";

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
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={avatar ? { uri: avatar } : require("../assets/default-avatar.png")}
          style={styles.avatar}
        />
      </TouchableOpacity>

      <TextInput placeholder="Data de Nascimento" style={styles.input} value={birthDate} onChangeText={setBirthDate} />
      <TextInput placeholder="Telefone" style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />
      <TextInput placeholder="Gênero" style={styles.input} value={gender} onChangeText={setGender} />
      <TextInput placeholder="País" style={styles.input} value={country} onChangeText={setCountry} />
      
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#181a20",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#1f222a",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1ab55c",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
