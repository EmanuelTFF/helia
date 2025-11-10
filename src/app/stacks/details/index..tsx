import { ArrowLeft, Bookmark, DotsThree, MapPin, Star, WifiHigh, SwimmingPool, Car } from "phosphor-react-native";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function Details() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const hotelData = {
    name: "Hotel Nova Vista",
    address: "Rua Santa Lucia, Quadra 06, Lote 17",
    rating: 4.8,
    price: 200,
    description: "Um hotel luxuoso com vista para as montanhas, oferecendo conforto e serviços premium para sua estadia inesquecível.",
    amenities: [
      { icon: <WifiHigh size={24} color="#9C8A75" />, name: "Wi-Fi Grátis" },
      { icon: <SwimmingPool size={24} color="#9C8A75" />, name: "Piscina" },
      { icon: <Car size={24} color="#9C8A75" />, name: "Estacionamento" },
    ],
    reviews: [
      { user: "Maria Silva", comment: "Adorei a estadia! O serviço foi excelente.", rating: 5 },
      { user: "João Santos", comment: "Quarto muito confortável e limpo.", rating: 4 },
    ]
  };

  // Se não houver hotelData, mostramos a mensagem do antigo index2
  if (!hotelData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Escolha uma opção de detalhes</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com imagem */}
      <View style={styles.header}>
        <Image style={styles.image} source={require("../../assets/hotel.png")} />

        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="#FFFFFF" weight="fill" size={32} />
          </TouchableOpacity>

          <View style={styles.headerButtonsInfo}>
            <Bookmark color="#FFFFFF" weight="fill" size={32} />
            <DotsThree color="#FFFFFF" weight="fill" size={32} />
          </View>
        </View>
      </View>

      {/* Conteúdo principal com ScrollView */}
      <ScrollView style={styles.contentScroll}>
        {/* Informações básicas */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoNameHotel}>{hotelData.name}</Text>

          <View style={styles.ratingContainer}>
            <Star color="#D4A373" weight="fill" size={20} />
            <Text style={styles.ratingText}>{hotelData.rating}</Text>
          </View>

          <View style={styles.infoContainerAddress}>
            <MapPin color="#6B8E23" weight="fill" size={20} />
            <Text style={styles.infoAddress}>{hotelData.address}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>{hotelData.description}</Text>
        </View>

        <View style={styles.separator} />

        {/* Comodidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comodidades</Text>
          <View style={styles.amenitiesContainer}>
            {hotelData.amenities.map((item, index) => (
              <View key={index} style={styles.amenityItem}>
                {item.icon}
                <Text style={styles.amenityText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.separator} />

        {/* Galeria de fotos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Galeria de Fotos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal style={styles.galleryContainer}>
            <Image style={styles.galleryImage} source={require("../../assets/hotel.png")} />
            <Image style={styles.galleryImage} source={require("../../assets/hotel.png")} />
            <Image style={styles.galleryImage} source={require("../../assets/hotel.png")} />
            <Image style={styles.galleryImage} source={require("../../assets/hotel.png")} />
          </ScrollView>
        </View>

        <View style={styles.separator} />

        {/* Avaliações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações</Text>
          {hotelData.reviews.map((review, index) => (
            <View key={index} style={styles.reviewContainer}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <View style={styles.reviewRating}>
                  <Star color="#D4A373" weight="fill" size={16} />
                  <Text style={styles.reviewRatingText}>{review.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer com preço e botão */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <View style={styles.footerContainerText}>
          <Text style={styles.footerContainerTextMoney}>R$ {hotelData.price}</Text>
          <Text style={styles.footerContainerTextMonth}>/ mês</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.push("/stacks/details/calendar")}
        >
          <Text style={styles.buttonText}>Alugar Agora</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, fontWeight: "bold" },
  header: { width: "100%", height: "40%", position: "relative" },
  image: { width: "100%", height: "100%", position: "absolute" },
  headerButtons: { marginTop: 50, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between" },
  headerButtonsInfo: { flexDirection: "row", gap: 15 },
  contentScroll: { flex: 1, marginBottom: 100 },
  infoContainer: { paddingHorizontal: 20, marginTop: 15 },
  infoNameHotel: { color: "#5E503F", fontSize: 28, fontWeight: "bold", marginBottom: 5 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  ratingText: { color: "#D4A373", fontSize: 16, marginLeft: 5 },
  infoContainerAddress: { flexDirection: "row", alignItems: "center", gap: 5 },
  infoAddress: { color: "#5E503F", fontSize: 14, fontWeight: "300" },
  separator: { height: 1, backgroundColor: "#E0D5C8", marginHorizontal: 20, marginVertical: 20 },
  section: { paddingHorizontal: 20, marginBottom: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  sectionTitle: { color: "#5E503F", fontSize: 20, fontWeight: "bold" },
  descriptionText: { color: "#9C8A75", fontSize: 14, lineHeight: 20 },
  amenitiesContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 15 },
  amenityItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#F0E6D2", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, gap: 8 },
  amenityText: { color: "#5E503F", fontSize: 14 },
  galleryContainer: { marginTop: 10 },
  galleryImage: { width: 120, height: 120, borderRadius: 12, marginRight: 10 },
  seeAllText: { color: "#6B8E23", fontSize: 14 },
  reviewContainer: { backgroundColor: "#F0E6D2", borderRadius: 12, padding: 15, marginBottom: 15 },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  reviewUser: { color: "#5E503F", fontSize: 16, fontWeight: "bold" },
  reviewRating: { flexDirection: "row", alignItems: "center" },
  reviewRatingText: { color: "#D4A373", fontSize: 14, marginLeft: 5 },
  reviewComment: { color: "#9C8A75", fontSize: 14 },
  footer: { position: "absolute", bottom: 0, width: "100%", borderTopWidth: 1, borderTopColor: "#E0D5C8", height: 90, backgroundColor: "#FFFFFF", paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 10 },
  footerContainerText: { flexDirection: "row", alignItems: "flex-end" },
  footerContainerTextMoney: { fontSize: 28, fontWeight: "bold", color: "#6B8E23" },
  footerContainerTextMonth: { fontSize: 14, color: "#9C8A75", marginBottom: 4, marginLeft: 2 },
  button: { backgroundColor: "#D4A373", width: "60%", height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center", flexDirection: "row", shadowColor: "#D4A373", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold", marginRight: 5 },
});
