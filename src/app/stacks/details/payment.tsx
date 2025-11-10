import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

export default function Payment() {
    const router = useRouter();
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
    const [savedCard, setSavedCard] = useState<any>(null);

    const payments = [
        { id: 'gpay', label: 'Google Pay', image: require('./assets/google.png') },
        { id: 'applepay', label: 'Apple Pay', image: require('./assets/apple.png') },
    ];

    // Função para deletar cartão salvo
    const deleteSavedCard = async () => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw userError;

            const { error } = await supabase
                .from('cards')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;

            setSavedCard(null);
            alert('Cartão removido com sucesso!');
        } catch (err) {
            console.error('Erro ao excluir cartão:', err);
            alert('Não foi possível remover o cartão.');
        }
    };

    // Busca o cartão sempre que a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            const fetchSavedCard = async () => {
                try {
                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    if (userError || !user) return;

                    const { data: card, error } = await supabase
                        .from('cards')
                        .select('last4')
                        .eq('user_id', user.id)
                        .limit(1)
                        .single();

                    if (error) return;

                    if (card) {
                        setSavedCard({
                            id: 'savedcard',
                            label: `•••• •••• •••• ${card.last4}`,
                            image: require('./assets/cartao.png'),
                            onDelete: deleteSavedCard,
                        });
                    } else {
                        setSavedCard(null);
                    }
                } catch (err) {
                    console.error('Erro inesperado:', err);
                }
            };

            fetchSavedCard();
        }, [])
    );

    const allPayments = savedCard
        ? [...payments, savedCard, { id: 'card', label: 'Adicionar novo cartão', image: require('./assets/cartao.png') }]
        : [...payments, { id: 'card', label: 'Adicionar cartão de crédito', image: require('./assets/cartao.png') }];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pagamento</Text>

            <View style={styles.paymentOptions}>
                {allPayments.map((pay) => (
                    <View key={pay.id} style={{ position: 'relative' }}>
                        <TouchableOpacity
                            style={[styles.paymentButton, selectedPayment === pay.id && styles.selectedPaymentButton]}
                            onPress={() => setSelectedPayment(pay.id)}
                        >
                            <Image source={pay.image} style={styles.icon} resizeMode="contain" />
                            <Text style={styles.paymentText}>{pay.label}</Text>
                        </TouchableOpacity>

                        {/* Botão de excluir apenas para cartão salvo */}
                        {pay.onDelete && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => {
                                    Alert.alert(
                                        'Excluir cartão',
                                        'Tem certeza que deseja excluir este cartão?',
                                        [
                                            { text: 'Cancelar', style: 'cancel' },
                                            { text: 'Excluir', style: 'destructive', onPress: pay.onDelete },
                                        ]
                                    );
                                }}
                            >
                                <Text style={styles.deleteText}>Excluir</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.continueButton, !selectedPayment && { opacity: 0.5 }]}
                onPress={() => {
                    if (selectedPayment === 'card') {
                        router.push('./card');
                    } else {
                        router.push('./ReviewScreen');
                    }
                }}
                disabled={!selectedPayment}
            >
                <Text style={styles.continueButtonText}>Continuar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', padding: 24, justifyContent: 'space-between' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#4B3832', marginTop: 40 },
    paymentOptions: { flex: 1, justifyContent: 'center', gap: 16 },
    paymentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
    },
    selectedPaymentButton: { borderColor: '#6B8E23', backgroundColor: '#E6F4EA' },
    icon: { width: 32, height: 32, marginRight: 12 },
    paymentText: { fontSize: 16, color: '#333' },
    continueButton: { backgroundColor: '#6B8E23', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginBottom: 40 },
    continueButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    deleteButton: { position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -12 }], backgroundColor: '#FF6B6B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    deleteText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
