import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';

export default function Inicialscreen({ navigation }) {

  return (
    <SafeAreaView style={styles.container}> 
      <Text style={styles.title}>CALCULADORA DE PREÇOS</Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Materiais usados</Text>
          <TextInput style={styles.input} placeholder="Materiais usados"/>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Preço da linha</Text>
            <TextInput style={styles.input} placeholder="R$00,00" keyboardType="numeric"/>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Tempo gasto</Text>
            <TextInput style={styles.input} placeholder="00:00" keyboardType="numeric"/>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Peso total</Text>
            <TextInput style={styles.input} placeholder="00kg" keyboardType="numeric"/>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Outros gastos(R$)</Text>
            <TextInput style={styles.input} placeholder="R$00,00" keyboardType="numeric"/>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Custo p/hora</Text>
          <TextInput style={styles.input} placeholder="R$00,00/h" keyboardType="numeric"/>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>CALCULAR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAEBD7", // bege claro
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    textTransform: "uppercase",
  },
  form: {
    flex: 1,
  },
  field: {
    marginBottom: 15,
  },
  fieldRow: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#B64B35",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
