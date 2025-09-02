import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function Sel1({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack("Assinar")} style={{bottom: 90, right: 90,}}>
                <Ionicons name="arrow-back" size={28} color="#a33" />
              </TouchableOpacity>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>MENSAL CREATOR</Text>
          <Text style={styles.price}>R$20</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.body}>
          <Text style={styles.benefitsTitle}>BENEFÍCIOS</Text>
          {Array(7).fill("Benefícios").map((item, index) => (
            <Text key={index} style={styles.benefitItem}>• {item}</Text>
          ))}
        </View>

        <Text style={styles.date}>Cobrança será realizada no dia{"\n"}01/10/2025</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>PAGAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5E6", 
    padding: 16,
  },
  card: {
    backgroundColor: "#964534", 
    borderRadius: 12,
    padding: 16,
    width: "90%",
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#FFD7C2",
    marginVertical: 10,
  },
  body: {
    marginBottom: 12,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  benefitItem: {
    color: "white",
    fontSize: 14,
    marginVertical: 2,
  },
  date: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#964534",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
