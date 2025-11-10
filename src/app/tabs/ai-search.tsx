import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function AiSearch() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const router = useRouter();

  async function handleSearch() {
    if (!description.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
          "HTTP-Referer": "https://seuapp.com",
          "X-Title": "MeuAppViagens",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content: `Você é um assistente de viagens simpático, divertido e criativo.
              Sempre responde com entusiasmo e dá dicas de forma leve e envolvente.
              Fale como um amigo apaixonado por viagens, com energia e carisma.`,
            },
            {
              role: "user",
              content: description,
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("Resposta da API:", data);

      // ✅ Verifica se veio texto em message.content ou text
      if (response.ok && data.choices?.length > 0) {
        const fullText =
          data.choices[0]?.message?.content?.trim() ||
          data.choices[0]?.text?.trim() ||
          "Não foi possível obter uma resposta da IA.";

        // Animação de digitação
        let currentText = "";
        let index = 0;

        const interval = setInterval(() => {
          currentText += fullText[index];
          setResult(currentText);
          index++;

          if (index >= fullText.length) {
            clearInterval(interval);
            setLoading(false);
          }
        }, 20);
      } else {
        console.error("Erro na resposta da IA:", data);
        Alert.alert("Erro", "Não foi possível obter sugestões. Tente novamente.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro geral:", error);
      Alert.alert("Erro", "Ocorreu um erro inesperado. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButtonHeader} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#6B4F3E" />
        </Pressable>
        <Text style={styles.title}>Assistente de Viagens</Text>
        <View style={styles.underline}></View>
      </View>

      {/* Conteúdo Principal */}
      <View style={styles.content}>
        <View style={styles.introCard}>
          <MaterialIcons name="travel-explore" size={32} color="#7A8C5E" />
          <Text style={styles.introTitle}>Descreva sua viagem ideal</Text>
          <Text style={styles.introText}>
            Conte com detalhes o tipo de lugar que você quer conhecer, o estilo de
            hospedagem, o clima, atividades e preferências. Nossa IA criará
            sugestões personalizadas para você!
          </Text>
        </View>

        {/* Área de Texto */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sua descrição</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ex: Quero um lugar tranquilo com natureza, perto de cachoeiras, clima ameno e pousadas aconchegantes..."
            placeholderTextColor="#A68A6D"
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Botão de Busca */}
        <Pressable
          onPress={handleSearch}
          disabled={loading}
          style={({ pressed }) => [
            styles.searchButton,
            pressed && styles.searchButtonPressed,
            loading && styles.searchButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <MaterialIcons name="auto-awesome" size={20} color="#FFF" />
              <Text style={styles.searchButtonText}>Buscar sugestões com IA</Text>
            </>
          )}
        </Pressable>

        {/* Resultados */}
        {result !== "" && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <MaterialIcons name="recommend" size={24} color="#7A8C5E" />
              <Text style={styles.resultTitle}>Sugestões da IA</Text>
            </View>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}

        {/* Botão Voltar */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backButtonText}>Voltar ao início</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#E8D9C5",
    paddingHorizontal: 25,
    paddingTop: 70,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#6B4F3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  backButtonHeader: {
    position: "absolute",
    left: 25,
    top: 70,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  title: {
    color: "#6B4F3E",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  underline: {
    width: 60,
    height: 4,
    backgroundColor: "#7A8C5E",
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  introTitle: {
    color: "#6B4F3E",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 8,
    textAlign: "center",
  },
  introText: {
    color: "#6B6B6B",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    color: "#6B4F3E",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 5,
  },
  textArea: {
    borderWidth: 2,
    borderColor: "#D4B999",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 15,
    color: "#6B4F3E",
    fontWeight: "500",
    fontSize: 15,
    textAlignVertical: "top",
    minHeight: 150,
    shadowColor: "#D4B999",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: "#7A8C5E",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#7A8C5E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  searchButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 8,
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  resultTitle: {
    color: "#7A8C5E",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
  resultText: {
    color: "#444",
    fontSize: 15,
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: "#E8D9C5",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  backButtonText: {
    color: "#9C6B4D",
    fontSize: 16,
    fontWeight: "600",
  },
});
