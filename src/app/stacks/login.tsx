import { useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import {
    EnvelopeSimple,
    LockKey,
    GoogleLogo,
    FacebookLogo,
} from "phosphor-react-native";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    

    async function handleLogin() {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert("Erro", error.message);
            return;
        }

        // Busca o nome do usuário na tabela `users`
        const { data: userData } = await supabase
            .from("users")
            .select("name")
            .eq("id", data.user.id)
            .single();

        if (userData) {
            router.push({
                pathname: "../tabs/home",
                params: { name: userData.name },
            });
        } else {
            router.push("../tabs/home");
        }
    }

    function handleSignUp() {
        router.push("./signup");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.wellcome}>Faça login na sua conta</Text>

            <View style={styles.content}>
                <View style={styles.contentInput}>
                    <EnvelopeSimple size={32} color="#9C8A75" />
                    <TextInput
                        placeholder="Seu e-mail"
                        style={styles.input}
                        placeholderTextColor="#9C8A75"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.contentInput}>
                    <LockKey size={32} color="#9C8A75" />
                    <TextInput
                        placeholder="Sua senha"
                        style={styles.input}
                        placeholderTextColor="#9C8A75"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.buttonSignIn}>
                <Text style={styles.buttonSignInText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.ContainerSeparator}>
                <View style={styles.separator} />
                <Text style={styles.ContainerSeparatorText}>ou continuar com</Text>
                <View style={styles.separator} />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton}>
                    <GoogleLogo color="#6B8E23" size={32} weight="fill" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerButton}>
                    <FacebookLogo color="#6B8E23" size={32} weight="fill" />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Não possui conta?</Text>
                <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.footerButtonText}>Cadastre-se</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5", // Branco puro de fundo
        alignItems: "center",
        paddingHorizontal: 20,
    },
    wellcome: {
        color: "#5E503F", // Mocca escuro
        marginTop: 150,
        fontSize: 24,
        fontWeight: "600",
    },
    content: {
        width: "100%",
        marginTop: 50,
        alignItems: "center",
        gap: 20,
    },
    contentInput: {
        width: "100%",
        height: 56,
        backgroundColor: "#F0E6D2", // Bege claro
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 10,
    },
    input: { 
        flex: 1, 
        color: "#5E503F", // Mocca escuro
    },
    buttonSignIn: {
        backgroundColor: "#6B8E23", // Oliva
        width: "100%",
        height: 56,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        shadowColor: "#6B8E23",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonSignInText: { 
        color: "#FFFFFF", // Branco puro
        fontSize: 16, 
        fontWeight: "800" 
    },
    ContainerSeparator: {
        width: "100%",
        marginTop: 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    separator: {
        height: 1,
        backgroundColor: "#E0D5C8", // Mocca claro
        flex: 1,
    },
    ContainerSeparatorText: {
        color: "#9C8A75", // Mocca médio
        fontSize: 16,
        fontWeight: "400",
    },
    footer: {
        marginTop: 50,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    footerButton: {
        width: 100,
        height: 60,
        backgroundColor: "#F0E6D2", // Bege claro
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
    },
    footerText: {
        color: "#5E503F", // Mocca escuro
        fontSize: 16,
        fontWeight: "400",
    },
    footerButtonText: {
        color: "#6B8E23", // Oliva
        fontSize: 16,
        fontWeight: "600",
    },
});