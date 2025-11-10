import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  Switch,
} from "react-native";
import { MagnifyingGlass, Funnel } from "phosphor-react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";

const data = [
  {
    id: "1",
    name: "Hotel Nova Vista",
    category: "Hotéis",
    location: "Posse, Goiás",
    price: 450,
    image: require("../assets/hotel.png"),
  },
  {
    id: "2",
    name: "Pousada Bela Vida",
    category: "Pousadas",
    location: "Goiânia, Goiás",
    price: 300,
    image: require("../assets/hotel.png"),
  },
  {
    id: "3",
    name: "Resort Paraíso",
    category: "Resorts",
    location: "Caldas Novas, Goiás",
    price: 750,
    image: require("../assets/hotel.png"),
  },
];

const countries = ["Brasil", "França", "Itália", "Alemanha"];
const categories = ["Todos", "Hotéis", "Pousadas", "Resorts"];
const facilities = ["WiFi", "Piscina", "Estacionamento", "Restaurante"];
const ratings = [5, 4, 3, 2, 1];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Brasil");
  const [selectedRating, setSelectedRating] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedFacilities, setSelectedFacilities] = useState({});

  const router = useRouter();

  const filteredData = data.filter(
    (item) =>
      (selectedCategory === "Todos" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.price >= minPrice &&
      item.price <= maxPrice &&
      (selectedRating === 0 || item.rating === selectedRating)
  );

  function handleDetails() {
    router.navigate("./stacks/details/index");
  }

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) => ({
      ...prev,
      [facility]: !prev[facility],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Imóveis</Text>

      <View style={styles.searchRow}>
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

        <Pressable onPress={() => setFilterVisible(true)} style={styles.filterIcon}>
          <Funnel size={24} color="#7A8B5A" weight="duotone" />
        </Pressable>
      </View>

      <View style={styles.filterContainer}>
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={({ pressed }) => [
              styles.filterButton,
              selectedCategory === category && styles.selectedFilterButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === category && styles.selectedFilterText,
              ]}
            >
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
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
          >
            <Image style={styles.cardImage} source={item.image} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardInfoTitle}>{item.name}</Text>
              <Text style={styles.cardInfoSubTitle}>{item.location}</Text>
              <Text style={styles.cardInfoPrice}>R$ {item.price}</Text>
            </View>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal de Filtros Avançados */}
      <Modal visible={filterVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.title}>Filtrar Imóveis</Text>

          <Text style={styles.section}>País</Text>
          <View style={styles.rowWrap}>
            {countries.map((country) => (
              <Pressable
                key={country}
                onPress={() => setSelectedCountry(country)}
                style={[styles.filterButton, selectedCountry === country && styles.selectedFilterButton]}
              >
                <Text
                  style={[styles.filterText, selectedCountry === country && styles.selectedFilterText]}
                >
                  {country}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.section}>Faixa de Preço (R$)</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Min: R$ {minPrice}</Text>
            <Slider
              style={{ width: "100%" }}
              minimumValue={0}
              maximumValue={1000}
              step={50}
              value={minPrice}
              onValueChange={setMinPrice}
              minimumTrackTintColor="#7A8B5A"
              maximumTrackTintColor="#CCC"
            />
            <Text style={styles.sliderLabel}>Max: R$ {maxPrice}</Text>
            <Slider
              style={{ width: "100%" }}
              minimumValue={0}
              maximumValue={1000}
              step={50}
              value={maxPrice}
              onValueChange={setMaxPrice}
              minimumTrackTintColor="#7A8B5A"
              maximumTrackTintColor="#CCC"
            />
          </View>

          <Text style={styles.section}>Estrelas</Text>
          <View style={styles.rowWrap}>
            {ratings.map((r) => (
              <Pressable
                key={r}
                onPress={() => setSelectedRating(r)}
                style={[styles.filterButton, selectedRating === r && styles.selectedFilterButton]}
              >
                <Text
                  style={[styles.filterText, selectedRating === r && styles.selectedFilterText]}
                >
                  {r} ★
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.section}>Facilidades</Text>
          <View>
            {facilities.map((item) => (
              <View key={item} style={styles.switchRow}>
                <Text style={styles.filterText}>{item}</Text>
                <Switch
                  trackColor={{ false: "#ccc", true: "#7A8B5A" }}
                  thumbColor="#fff"
                  value={selectedFacilities[item] || false}
                  onValueChange={() => toggleFacility(item)}
                />
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Pressable onPress={() => setFilterVisible(false)} style={styles.resetButton}>
              <Text style={styles.iaButtonText}>Fechar</Text>
            </Pressable>
            <Pressable onPress={() => setFilterVisible(false)} style={styles.iaButton}>
              <Text style={styles.iaButtonText}>Aplicar Filtros</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "700", color: "#9C6B4E", marginBottom: 20 },
  searchRow: { flexDirection: "row", alignItems: "center" },
  inputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF",
    borderRadius: 12, paddingHorizontal: 20, height: 50, borderWidth: 1,
    borderColor: "#E0E0E0", elevation: 2, flex: 1,
  },
  input: { flex: 1, color: "#6B6B6B", marginLeft: 10, fontSize: 16 },
  filterIcon: { marginLeft: 12, padding: 10, backgroundColor: "#FFFFFF", borderRadius: 10, elevation: 2 },
  filterContainer: {
    flexDirection: "row", justifyContent: "space-between", marginBottom: 20,
    flexWrap: "wrap", marginTop: 30,
  },
  filterButton: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "#F0F0F0",
    marginBottom: 10, marginRight: 8,
  },
  selectedFilterButton: { backgroundColor: "#7A8B5A" },
  filterText: { color: "#8B8B8B", fontSize: 14, fontWeight: "500" },
  selectedFilterText: { color: "#FFFFFF", fontWeight: "600" },
  card: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF",
    borderRadius: 12, padding: 15, marginBottom: 12, elevation: 2,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: { width: 90, height: 90, borderRadius: 8 },
  cardInfo: { marginLeft: 15, flex: 1 },
  cardInfoTitle: { color: "#5A5A5A", fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardInfoSubTitle: { color: "#8B8B8B", fontSize: 14, marginBottom: 6 },
  cardInfoPrice: { color: "#9C6B4E", fontSize: 16, fontWeight: "700" },
  iaButton: {
    backgroundColor: "#7A8B5A", paddingVertical: 14, borderRadius: 12,
    alignItems: "center", marginTop: 20, paddingHorizontal: 20, elevation: 2,
  },
  resetButton: {
    backgroundColor: "#CCCCCC", paddingVertical: 14, borderRadius: 12,
    alignItems: "center", marginTop: 20, paddingHorizontal: 20, elevation: 2,
  },
  iaButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  modalContainer: { padding: 20, paddingTop: 60, backgroundColor: "#F5F5F5" },
  section: { fontSize: 16, fontWeight: "500", marginBottom: 12, color: "#6B6B6B" },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  sliderContainer: { marginBottom: 20 },
  sliderLabel: { fontSize: 14, color: "#6B6B6B", marginBottom: 8 },
  switchRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 12, backgroundColor: "#fff", padding: 12, borderRadius: 10,
    borderWidth: 1, borderColor: "#E0E0E0",
  },
});