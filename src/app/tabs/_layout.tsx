import { Tabs } from "expo-router";
import { House, MagnifyingGlass, Notebook, UserSquare, Robot } from "phosphor-react-native";
import { Text, View, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F5F0E8", // Mocca mousse claro (fundo)
          height: 80,
          paddingTop: 20,
          borderTopWidth: 1,
          borderTopColor: "#D4B999", // Borda mocca mousse
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#7A8C5E", // Oliva suave (ativo)
        tabBarInactiveTintColor: "#9C6B4D", // Terracota médio (inativo)
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <House size={32} color={color} weight="fill" />
              <Text style={[styles.tabText, { color }]}>Home</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <MagnifyingGlass size={32} color={color} weight="fill" />
              <Text style={[styles.tabText, { color }]}>Busca</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ai-search"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <Robot size={32} color={color} weight="fill" />
              <Text style={[styles.tabText, { color }]}>IA</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <UserSquare size={32} color={color} weight="fill" />
              <Text style={[styles.tabText, { color }]}>Perfil</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
});
