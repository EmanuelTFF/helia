import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert
} from "react-native";
import { supabase } from "../lib/supabase";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [darkTheme, setDarkTheme] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      if (!error) setProfile(data);
    }
    loadProfile();
  }, []);

  if (!profile) return null;

  // Confirmação antes de sair
  const handleSignOut = () => {
    Alert.alert(
      "Confirmação",
      "Você realmente deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (!error) {
              router.replace("../stacks/login");
            } else {
              console.log("Erro ao sair:", error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Cores dinâmicas baseado no tema
  const themeColors = darkTheme ? {
    background: "#121212",
    cardBackground: "#1E1E1E",
    textPrimary: "#FFFFFF",
    textSecondary: "#BBBBBB",
    menuText: "#FFFFFF",
    border: "#333333",
    switchTrack: "#7A8B5A",
    switchThumb: "#FFFFFF"
  } : {
    background: "#F5F5F5",
    cardBackground: "#FFFFFF",
    textPrimary: "#9C6B4E",
    textSecondary: "#6B6B6B",
    menuText: "#5A5A5A",
    border: "#E0E0E0",
    switchTrack: "#D4B999",
    switchThumb: "#7A8B5A"
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.cardBackground }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: darkTheme ? "#7A8B5A" : "#D4B999" }]}>
            <Text style={[styles.avatarText, { color: darkTheme ? "#121212" : "#FFFFFF" }]}>
              {profile.first_name ? profile.first_name.charAt(0).toUpperCase() : profile.email.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={[styles.welcomeText, { color: themeColors.textPrimary }]}>
          Olá, {profile.first_name || "Usuário"}!
        </Text>
        <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>{profile.email}</Text>
      </View>

      {/* Menu Options */}
      <View style={[styles.menuContainer, { backgroundColor: themeColors.cardBackground }]}>
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomColor: themeColors.border }]}
          onPress={() => router.push("../stacks/details/editarperfil")}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: darkTheme ? "#2A2A2A" : "#F0E6D8" }]}>
              <MaterialIcons name="edit" size={20} color="#7A8B5A" />
            </View>
            <Text style={[styles.menuText, { color: themeColors.menuText }]}>Editar Perfil</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: themeColors.border }]}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: darkTheme ? "#2A2A2A" : "#F0E6D8" }]}>
              <MaterialIcons name="payment" size={20} color="#7A8B5A" />
            </View>
            <Text style={[styles.menuText, { color: themeColors.menuText }]}>Pagamento</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: themeColors.border }]}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: darkTheme ? "#2A2A2A" : "#F0E6D8" }]}>
              <Feather name="bell" size={20} color="#7A8B5A" />
            </View>
            <Text style={[styles.menuText, { color: themeColors.menuText }]}>Notificações</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: themeColors.border }]}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: darkTheme ? "#2A2A2A" : "#F0E6D8" }]}>
              <MaterialIcons name="security" size={20} color="#7A8B5A" />
            </View>
            <Text style={[styles.menuText, { color: themeColors.menuText }]}>Segurança</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: themeColors.border }]}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: darkTheme ? "#2A2A2A" : "#F0E6D8" }]}>
              <Feather name="help-circle" size={20} color="#7A8B5A" />
            </View>
            <Text style={[styles.menuText, { color: themeColors.menuText }]}>Ajuda</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
          <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: darkTheme ? "#2A2A2A" : "#F0E6D8" }]}>
              <Feather name="moon" size={20} color="#7A8B5A" />
            </View>
            <Text style={[styles.menuText, { color: themeColors.menuText }]}>Tema Escuro</Text>
          </View>
          <Switch
            value={darkTheme}
            onValueChange={setDarkTheme}
            trackColor={{ false: themeColors.switchTrack, true: themeColors.switchTrack }}
            thumbColor={themeColors.switchThumb}
            ios_backgroundColor={themeColors.border}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: themeColors.cardBackground }]}
        onPress={handleSignOut}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: darkTheme ? "#2A2A2A" : "#FFE6E6" }]}>
            <MaterialIcons name="logout" size={20} color="#FF4444" />
          </View>
          <Text style={[styles.logoutText, { color: "#FF4444" }]}>Sair da Conta</Text>
        </View>
      </TouchableOpacity>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
          v1.0.0 • {new Date().getFullYear()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 80,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
  },
  menuContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.7,
  },
});