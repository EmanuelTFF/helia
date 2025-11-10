import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useRef, useEffect } from 'react'

export default function PaymentSuccessScreen() {
  const router = useRouter()
  const animation = useRef<LottieView>(null)

  useEffect(() => {
    animation.current?.play()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.successBox}>
        <LottieView
          ref={animation}
          source={require('./assets/check-animation.json')} // arquivo JSON Lottie
          autoPlay
          loop={false}
          style={styles.icon}
        />
        <Text style={styles.title}>Pagamento Concluído!</Text>
        <Text style={styles.subtitle}>
          Sua reserva foi confirmada com sucesso.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('./TicketScreen')}
        >
          <Text style={styles.buttonText}>Ver Ingresso</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  successBox: {
    backgroundColor: '#F0E6D2', // bege claro igual ao header do calendário
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%'
  },
  icon: { width: 150, height: 150, marginBottom: 20 },
  title: {
    color: '#5E503F', // mocca escuro
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    color: '#6B8E23', // oliva suave
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#6B8E23', // oliva
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
})
