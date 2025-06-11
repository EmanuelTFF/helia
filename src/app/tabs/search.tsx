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
        <MagnifyingGlass size={24} color="#8B8B8B" weight="duotone" />
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do imóvel..."
          placeholderTextColor="#8B8B8B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        {categories.map(category => (
          <Pressable 
            key={category} 
            onPress={() => setSelectedCategory(category)}
            style={({pressed}) => [
              styles.filterButton,
              selectedCategory === category && styles.selectedFilterButton,
              pressed && { opacity: 0.8 }
            ]}
          >
            <Text style={[
              styles.filterText,
              selectedCategory === category && styles.selectedFilterText
            ]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable 
            onPress={handleDetails} 
            style={({pressed}) => [
              styles.card,
              pressed && { opacity: 0.9 }
            ]}
          >
            <Image style={styles.cardImage} source={item.image} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardInfoTitle}>{item.name}</Text>
              <Text style={styles.cardInfoSubTitle}>{item.location}</Text>
              <Text style={styles.cardInfoPrice}>{item.price}</Text>
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Branco puro
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#9C6B4E", // Terracota
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Branco
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0", // Cinza claro
    elevation: 2,
  },
  input: {
    flex: 1,
    color: "#6B6B6B", // Cinza escuro
    marginLeft: 10,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F0F0F0", // Cinza muito claro
    marginBottom: 10,
  },
  selectedFilterButton: {
    backgroundColor: "#7A8B5A", // Oliva suave
  },
  filterText: {
    color: "#8B8B8B", // Cinza médio
    fontSize: 14,
    fontWeight: "500",
  },
  selectedFilterText: {
    color: "#FFFFFF", // Branco
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Branco
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  cardInfo: {
    marginLeft: 15,
    flex: 1,
  },
  cardInfoTitle: {
    color: "#5A5A5A", // Cinza escuro
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardInfoSubTitle: {
    color: "#8B8B8B", // Cinza médio
    fontSize: 14,
    marginBottom: 6,
  },
  cardInfoPrice: {
    color: "#9C6B4E", // Terracota
    fontSize: 16,
    fontWeight: "700",
  },
});