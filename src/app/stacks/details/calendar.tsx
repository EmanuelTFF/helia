import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";
import { useState } from "react";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import 'moment/locale/pt-br';
import { supabase } from "../../lib/supabase"; // ajuste o caminho

moment.locale("pt-br");

export default function CalendarPage() {
  const router = useRouter();
  const [guestCount, setGuestCount] = useState(2);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(selectedDate);
      setCheckOut("");
    } else {
      if (moment(selectedDate).isAfter(checkIn)) {
        setCheckOut(selectedDate);
      } else {
        setCheckIn(selectedDate);
        setCheckOut("");
      }
    }
  };

  const getMarkedDates = () => {
    const marks = {};
    if (checkIn) {
      marks[checkIn] = {
        startingDay: true,
        color: "#D4A373",
        textColor: "white",
      };
    }

    if (checkOut) {
      const start = moment(checkIn);
      const end = moment(checkOut);
      for (let m = start.clone().add(1, "days"); m.isBefore(end); m.add(1, "days")) {
        marks[m.format("YYYY-MM-DD")] = {
          color: "#F0E6D2",
          textColor: "#5E503F",
        };
      }
      marks[checkOut] = {
        endingDay: true,
        color: "#D4A373",
        textColor: "white",
      };
    }
    return marks;
  };

  const totalNights = checkIn && checkOut ? moment(checkOut).diff(moment(checkIn), "days") : 0;
  const totalPrice = totalNights * 145;

  const salvarReserva = async () => {
    if (!checkIn || !checkOut) {
      Alert.alert("Erro", "Selecione as datas de check-in e check-out.");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        Alert.alert("Erro", "Usuário não está logado.");
        return;
      }

      const { error } = await supabase
        .from("reservations")
        .insert([{
          user_id: user.id,
          check_in: checkIn,
          check_out: checkOut,
          guests: guestCount,
          total_price: totalPrice
        }]);

      if (error) throw error;

      router.push("./credentials");
    } catch (err) {
      console.error("Erro ao salvar reserva:", err);
      Alert.alert("Erro", "Não foi possível salvar a reserva.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <ArrowLeft color="#5E503F" weight="bold" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selecionar Datas</Text>
      </View>

      {/* Calendário */}
      <Calendar
        current={moment().format("YYYY-MM-DD")}
        minDate={moment().format("YYYY-MM-DD")}
        maxDate={"2025-12-31"}
        markingType={"period"}
        markedDates={getMarkedDates()}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: "#FFFFFF",
          calendarBackground: "#FFFFFF",
          dayTextColor: "#5E503F",
          monthTextColor: "#6B8E23",
          selectedDayBackgroundColor: "#D4A373",
          selectedDayTextColor: "#fff",
          todayTextColor: "#6B8E23",
          arrowColor: "#6B8E23",
          textDisabledColor: "#ccc",
        }}
      />

      {/* Informações selecionadas */}
      <View style={styles.content}>
        <Text style={styles.label}>Check-in</Text>
        <Text style={styles.box}>
          {checkIn ? moment(checkIn).format("DD [de] MMMM") : "--"}
        </Text>

        <Text style={styles.label}>Check-out</Text>
        <Text style={styles.box}>
          {checkOut ? moment(checkOut).format("DD [de] MMMM") : "--"}
        </Text>

        <Text style={styles.label}>Hóspedes</Text>
        <View style={styles.guestContainer}>
          <TouchableOpacity
            onPress={() => setGuestCount((prev) => Math.max(1, prev - 1))}
            style={styles.guestButton}
          >
            <Text style={styles.guestButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.guestCount}>{guestCount}</Text>
          <TouchableOpacity
            onPress={() => setGuestCount((prev) => prev + 1)}
            style={styles.guestButton}
          >
            <Text style={styles.guestButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.total}>Total: R${totalPrice},00</Text>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={salvarReserva}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#F0E6D2",
  },
  headerTitle: {
    color: "#5E503F",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: { padding: 20 },
  label: {
    color: "#6B8E23",
    fontSize: 16,
    marginTop: 20,
  },
  box: {
    backgroundColor: "#F0E6D2",
    color: "#5E503F",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  guestContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  guestButton: {
    backgroundColor: "#D4A373",
    padding: 10,
    borderRadius: 10,
  },
  guestButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  guestCount: {
    color: "#5E503F",
    fontSize: 18,
    marginHorizontal: 20,
  },
  total: {
    color: "#5E503F",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
  },
  continueButton: {
    backgroundColor: "#6B8E23",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
