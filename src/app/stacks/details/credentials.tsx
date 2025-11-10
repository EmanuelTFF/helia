import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ArrowLeft } from "phosphor-react-native";
import { supabase } from "../../lib/supabase"; // 👈 importa seu client

export default function Credentials() {
    const router = useRouter();
    const [title, setTitle] = useState("Sr.");
    const [nomeCompleto, setNomeCompleto] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");

    useEffect(() => {
        async function loadProfile() {
            try {
                const { data: authData, error: authError } = await supabase.auth.getUser();
                if (authError) throw authError;
                if (!authData?.user) return;

                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("first_name, last_name, email, phone_number, birth_date, gender")
                    .eq("user_id", authData.user.id)
                    .single();

                if (profileError) throw profileError;


                // Preenche os estados
                setNomeCompleto(`${profile.first_name} ${profile.last_name}`);
                setEmail(profile.email || "");
                setTelefone(profile.phone_number || "");
                setNascimento(profile.birth_date ? formatDate(profile.birth_date) : "");

                // Define título baseado no gênero (opcional)
                if (profile.gender === "male") setTitle("Sr.");
                else if (profile.gender === "female") setTitle("Sra.");
                else setTitle("Sr.");
            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
            }
        }

        loadProfile();
    }, []);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
                    <ArrowLeft color="#5E503F" size={28} weight="bold" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nome da Reserva</Text>
            </View>

            {/* Títulos */}
            <View style={styles.titlesContainer}>
                {["Sr.", "Sra.", "Srta."].map((item) => (
                    <TouchableOpacity
                        key={item}
                        onPress={() => setTitle(item)}
                        style={[
                            styles.titleButton,
                            title === item && styles.titleButtonSelected,
                        ]}
                    >
                        <Text
                            style={[
                                styles.titleButtonText,
                                title === item && styles.titleButtonTextSelected,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Formulário */}
            <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#aaa"
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
            />
            <TextInput
                style={styles.input}
                placeholder="Data de nascimento (DD/MM/AAAA)"
                placeholderTextColor="#aaa"
                value={nascimento}
                onChangeText={setNascimento}
            />
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Telefone"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
            />

            {/* Botão continuar */}
            <TouchableOpacity
                style={styles.continueButton}
                onPress={() => router.push('./payment')}
            >
                <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 60,
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 22,
        color: "#5E503F",
        fontWeight: "bold",
    },
    titlesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },
    titleButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#6B8E23",
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 25,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    titleButtonSelected: {
        backgroundColor: "#D4A373",
        borderColor: "#D4A373",
    },
    titleButtonText: {
        color: "#5E503F",
        fontSize: 14,
    },
    titleButtonTextSelected: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    input: {
        backgroundColor: "#F0E6D2",
        padding: 16,
        borderRadius: 12,
        color: "#5E503F",
        fontSize: 15,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#D4A373",
    },
    continueButton: {
        backgroundColor: "#6B8E23",
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    continueButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
});
