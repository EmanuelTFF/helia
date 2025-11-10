import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  Easing,
  Modal,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function HelpScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [animation] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const faqs = [
    {
      question: "Como faço login no aplicativo?",
      answer:
        "Insira seu e-mail e senha cadastrados. Caso esqueça a senha, clique em 'Esqueci minha senha' na tela de login.",
    },
    {
      question: "O aplicativo é gratuito?",
      answer:
        "Sim. Todas as funções essenciais são gratuitas. No entanto, poderão ser adicionados planos premium futuramente.",
    },
    {
      question: "Como alterar meu perfil?",
      answer:
        "Acesse a aba Perfil e selecione 'Editar Perfil' para atualizar suas informações.",
    },
    {
      question: "Como entro em contato com o suporte?",
      answer:
        "Você pode entrar em contato por e-mail ou WhatsApp utilizando os botões abaixo.",
    },
  ];

  const devs = [
    "Emanuel Tonis Florz Filho",
    "Victhor Cani",
    "Bernardo Correa",
    "Ana Rotiini",
    "Arthur Pereira",
    "Gustavo Xavier",
  ];

  const toggleFAQ = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
      Animated.timing(animation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      setOpenIndex(index);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const handleDeleteAccount = () => {
    setModalVisible(false);
    router.push("../login"); // simulação
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho */}
      <LinearGradient
        colors={["#EBDAC3", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => router.push("/tabs/profile")}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#7A8B5A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda</Text>
        <View style={{ width: 26 }} />
      </LinearGradient>

      <Text style={styles.subtitle}>
        Encontre respostas rápidas ou entre em contato com o suporte.
      </Text>

      {/* FAQ */}
      <View style={styles.faqContainer}>
        {faqs.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.faqQuestion}
              onPress={() => toggleFAQ(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.questionText}>{item.question}</Text>
              <Feather
                name={openIndex === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="#7A8B5A"
              />
            </TouchableOpacity>

            {openIndex === index && (
              <Animated.View
                style={{
                  opacity: animation,
                  transform: [
                    {
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-5, 0],
                      }),
                    },
                  ],
                }}
              >
                <Text style={styles.answerText}>{item.answer}</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </View>

      {/* Contato */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL("mailto:suporte@heliaapp.com")}
          activeOpacity={0.8}
        >
          <MaterialIcons name="email" size={20} color="white" />
          <Text style={styles.buttonText}>Enviar e-mail</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.whatsappButton]}
          onPress={() => Linking.openURL("https://wa.me/5599999999999")}
          activeOpacity={0.8}
        >
          <Feather name="message-circle" size={20} color="white" />
          <Text style={styles.buttonText}>Falar pelo WhatsApp</Text>
        </TouchableOpacity>
      </View>

      {/* Sobre o app */}
      <View style={[styles.section, styles.aboutSection]}>
        <Text style={styles.sectionTitle}>Informações do aplicativo</Text>
        <View style={styles.aboutBox}>
          <Text style={styles.aboutText}>Nome: LocalLodge</Text>
          <Text style={styles.aboutText}>Versão: 1.0.0</Text>

          <Text style={[styles.aboutText, styles.devTitle]}>
            Desenvolvido por:
          </Text>
          <View style={styles.devList}>
            {devs.map((dev, i) => (
              <View key={i} style={styles.devItem}>
                <Feather name="user" size={14} color="#7A8B5A" />
                <Text style={styles.devName}>{dev}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.aboutText}>
            Seus dados são protegidos de acordo com a Lei Geral de Proteção de
            Dados (LGPD).
          </Text>
        </View>
      </View>

      {/* Botão de Excluir Conta */}
      <View style={{ alignItems: "center", marginBottom: 60 }}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Feather name="trash-2" size={18} color="white" />
          <Text style={styles.deleteText}>Excluir conta</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <Animated.View style={styles.modalBox}>
            <Feather name="alert-triangle" size={40} color="#E74C3C" />
            <Text style={styles.modalTitle}>Excluir conta</Text>
            <Text style={styles.modalMessage}>
              Tem certeza de que deseja excluir sua conta? Esta ação é
              permanente e não poderá ser desfeita.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#E74C3C" }]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#7A8B5A" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF8F5" },

  header: {
    paddingTop: 55,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  backButton: {
    backgroundColor: "#F0E6D8",
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#7A8B5A" },
  subtitle: {
    fontSize: 14,
    color: "#6C6C6C",
    textAlign: "center",
    marginHorizontal: 25,
    marginTop: 20,
    marginBottom: 10,
  },

  faqContainer: { marginHorizontal: 20, marginTop: 10 },
  faqItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3A3A3A",
    flex: 1,
    paddingRight: 8,
  },
  answerText: { fontSize: 14, color: "#555", lineHeight: 20, marginTop: 8 },

  section: { marginTop: 30, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#7A8B5A",
    marginBottom: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7A8B5A",
    paddingVertical: 13,
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: "center",
    elevation: 2,
  },
  whatsappButton: { backgroundColor: "#25D366" },
  buttonText: { color: "#FFF", marginLeft: 10, fontSize: 16, fontWeight: "600" },

  aboutSection: { marginBottom: 40 },
  aboutBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  aboutText: { fontSize: 14, color: "#444", marginBottom: 6 },
  devTitle: { marginTop: 10, fontWeight: "600", color: "#3A3A3A" },
  devList: { marginTop: 6, marginBottom: 10 },
  devItem: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  devName: { fontSize: 14, color: "#555", marginLeft: 6 },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 2,
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginTop: 10,
  },
  modalMessage: {
    color: "#666",
    textAlign: "center",
    marginVertical: 15,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: { color: "white", fontWeight: "bold", fontSize: 15 },
});
