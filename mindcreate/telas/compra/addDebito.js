import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function CartaoCreditoScreen({ navigation }) {
  const [numero, setNumero] = useState("");
  const [titular, setTitular] = useState("");
  const [cvv, setCvv] = useState("");
  const [validade, setValidade] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack("Pagar")} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#8B0000" />
      </TouchableOpacity>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.logoMastercard} />
            <View style={[styles.logoMastercard, styles.logoRed]} />
          </View>
          <Text style={styles.cardTitle}>CARTÃO DE DÉBITO</Text>
        </View>
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

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Número do cartão"
          placeholderTextColor="#FFD7C2"
          keyboardType="numeric"
          value={numero}
          onChangeText={setNumero}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome do Titular"
          placeholderTextColor="#FFD7C2"
          value={titular}
          onChangeText={setTitular}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="CVV"
            placeholderTextColor="#FFD7C2"
            keyboardType="numeric"
            value={cvv}
            onChangeText={setCvv}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Validade"
            placeholderTextColor="#FFD7C2"
            value={validade}
            onChangeText={setValidade}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Adicionar Cartão</Text>
        <Ionicons name="card" size={20} color="#fff" style={styles.buttonIcon} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFF5E6", 
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: "#8B0000",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
  },
  logoMastercard: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F79E1B",
  },
  logoRed: {
    backgroundColor: "#EB001B",
    marginLeft: -12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  cardNumber: {
    color: "#fff",
    fontSize: 22,
    letterSpacing: 3,
    marginVertical: 16,
    fontWeight: "700",
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  smallText: {
    color: "#FFD7C2",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  cardInfo: {
    color: "#fff",
    fontSize: 16,
    marginTop: 6,
    fontWeight: "700",
  },
  formContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#8B0000",
    width: "100%",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    borderWidth: 2,
    borderColor: "#A94436",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: "#8B0000",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 12,
  },
});