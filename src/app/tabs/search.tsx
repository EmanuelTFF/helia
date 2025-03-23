import { useState } from "react";
import { View, Text, TextInput, FlatList, Image, Pressable, StyleSheet } from "react-native";
import { MagnifyingGlass } from "phosphor-react-native";
import { useRouter } from "expo-router";

const data = [
  { id: "1", name: "Hotel Nova Vista", category: "Hotéis", location: "Posse, Goiás", price: "R$ 450,00", image: require("../assets/hotel.png") },
  { id: "2", name: "Pousada Bela Vida", category: "Pousadas", location: "Goiânia, Goiás", price: "R$ 300,00", image: require("../assets/hotel.png") },
  { id: "3", name: "Resort Paraíso", category: "Resorts", location: "Caldas Novas, Goiás", price: "R$ 750,00", image: require("../assets/hotel.png") },
];

const categories = ["Todos", "Hotéis", "Pousadas", "Resorts"];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const router = useRouter();

  const filteredData = data.filter(item =>
    (selectedCategory === "Todos" || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleDetails() {
    router.navigate("./stacks/details/index");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Imóveis</Text>
      <View style={styles.inputContainer}>
        <MagnifyingGlass size={24} color="#757575" weight="duotone" />
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do imóvel..."
          placeholderTextColor="#757575"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        {categories.map(category => (
          <Pressable key={category} onPress={() => setSelectedCategory(category)}>
            <Text style={[styles.filterText, selectedCategory === category && styles.selectedFilter]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={handleDetails} style={styles.card}>
            <Image style={styles.cardImage} source={item.image} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardInfoTitle}>{item.name}</Text>
              <Text style={styles.cardInfoSubTitle}>{item.location}</Text>
              <Text style={styles.cardInfoBuyText}>{item.price}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181a20",
    padding: 20,
  },
  title: {
    marginTop:70,
    fontSize: 30,
    fontWeight: "800",
    color: "#f4f4f4",
    marginBottom: 20,

  },
  inputContainer: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f222a",
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: "#f4f4f4",
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  filterText: {
    color: "#757575",
    fontSize: 16,
  },
  selectedFilter: {
    color: "#1ab65c",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f222a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  cardInfo: {
    marginLeft: 10,
  },
  cardInfoTitle: {
    color: "#f4f4f4",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardInfoSubTitle: {
    color: "#f4f4f4",
    fontSize: 14,
  },
  cardInfoBuyText: {
    color: "#1ab65c",
    fontSize: 18,
    fontWeight: "bold",
  },
});