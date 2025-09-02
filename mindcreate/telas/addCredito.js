import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function CartaoCreditoScreen() {
  const [numero, setNumero] = useState("");
  const [titular, setTitular] = useState("");
  const [cvv, setCvv] = useState("");
  const [validade, setValidade] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#a33" />
        </TouchableOpacity>
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.logoMastercard} />
          <View style={[styles.logoMastercard, { backgroundColor: "#EB001B", marginLeft: -10 }]} />
        </View>
        <Text style={styles.cardTitle}>CARTÃO DE CRÉDITO</Text>
        <Text style={styles.cardNumber}>XXXX XXXX XXXX XXXX</Text>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.smallText}>CVV</Text>
            <Text style={styles.cardInfo}>XXX</Text>
          </View>
          <View>
            <Text style={styles.smallText}>VALIDADE</Text>
            <Text style={styles.cardInfo}>XX/XX</Text>
          </View>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Número do cartão"
        keyboardType="numeric"
        value={numero}
        onChangeText={setNumero}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome do Titular"
        value={titular}
        onChangeText={setTitular}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="CVV"
          keyboardType="numeric"
          value={cvv}
          onChangeText={setCvv}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Validade"
          value={validade}
          onChangeText={setValidade}
        />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Adicionar Cartão</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF5E6", 
  },
  card: {
    backgroundColor: "#A94436",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    marginBottom: 30,
    elevation: 5,
  },
  logoMastercard: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F79E1B",
  },
  cardTitle: {
    color: "white",
    fontSize: 14,
    marginTop: 10,
  },
  cardNumber: {
    color: "white",
    fontSize: 18,
    letterSpacing: 2,
    marginTop: 10,
    fontWeight: "bold",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  smallText: {
    color: "#FFD7C2",
    fontSize: 12,
  },
  cardInfo: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#CC5A43",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfInput: {
    width: "48%",
  },
  button: {
    backgroundColor: "#CC5A43",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
