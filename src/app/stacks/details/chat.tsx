import { ArrowLeft, PaperPlaneRight } from "phosphor-react-native";
import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

export default function Chat() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // Mensagens iniciais de exemplo
  useEffect(() => {
    setMessages([
      {
        id: "1",
        text: "Olá! Estou interessado em alugar o Hotel Nova Vista.",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        text: "Olá! Que ótimo! Me conte mais sobre o que você precisa para sua estadia.",
        sender: "other",
        timestamp: new Date(Date.now() - 3500000),
      },
      {
        id: "3",
        text: "Gostaria de reservar para 2 adultos por 5 noites, a partir do dia 15/06.",
        sender: "user",
        timestamp: new Date(Date.now() - 3400000),
      },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simular resposta após 1 segundo
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Perfeito! Posso confirmar sua reserva para 2 adultos, 5 noites a partir de 15/06. O valor total será de $1000.",
        sender: "other",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#5E503F" weight="fill" size={28} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Image 
            source={require("../../assets/hotel.png")} 
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.headerTitle}>Hotel Nova Vista</Text>
            <Text style={styles.headerSubtitle}>Online agora</Text>
          </View>
        </View>
      </View>

      {/* Lista de mensagens */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === "user" ? styles.userMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Área de input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#9C8A75"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={message.trim() === ""}
        >
          <PaperPlaneRight 
            color={message.trim() === "" ? "#9C8A75" : "#6B8E23"} 
            weight="fill" 
            size={24} 
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Branco puro de fundo
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0D5C8", // Mocca claro
    backgroundColor: "#FFFFFF", // Branco puro
  },
  backButton: {
    marginRight: 15,
    marginTop: 20,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginTop: 30,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    color: "#5E503F", // Mocca escuro
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#6B8E23", // Oliva
    fontSize: 12,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 80,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#D4A373", // Terracota
    borderTopRightRadius: 0,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F0E6D2", // Bege claro
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: "#5E503F", // Mocca escuro
    fontSize: 16,
  },
  messageTime: {
    color: "#9C8A75", // Mocca médio
    fontSize: 10,
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF", // Branco puro
    borderTopWidth: 1,
    borderTopColor: "#E0D5C8", // Mocca claro
  },
  input: {
    flex: 1,
    backgroundColor: "#F0E6D2", // Bege claro
    color: "#5E503F", // Mocca escuro
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F0E6D2", // Bege claro
    justifyContent: "center",
    alignItems: "center",
  },
});