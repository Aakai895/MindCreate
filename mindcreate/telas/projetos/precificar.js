import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Inicialscreen({ navigation }) {

  return (
    <SafeAreaView style={styles.container}> 
      <Text style={styles.title}>CALCULADORA DE PREÇOS</Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Materiais usados</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="cube-outline" size={20} color="#8B0000" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Materiais usados"
              placeholderTextColor="#8B0000"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Preço da linha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="pricetag-outline" size={20} color="#8B0000" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="R$00,00" 
                keyboardType="numeric"
                placeholderTextColor="#8B0000"
              />
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Tempo gasto</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="time-outline" size={20} color="#8B0000" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="00:00" 
                keyboardType="numeric"
                placeholderTextColor="#8B0000"
              />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Peso total</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="scale-outline" size={20} color="#8B0000" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="00kg" 
                keyboardType="numeric"
                placeholderTextColor="#8B0000"
              />
            </View>
          </View>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>Outros gastos(R$)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={20} color="#8B0000" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="R$00,00" 
                keyboardType="numeric"
                placeholderTextColor="#8B0000"
              />
            </View>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Custo p/hora</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="speedometer-outline" size={20} color="#8B0000" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="R$00,00/h" 
              keyboardType="numeric"
              placeholderTextColor="#8B0000"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>CALCULAR</Text>
          <Ionicons name="calculator" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff5e6",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 30,
    textTransform: "uppercase",
    color: "#8B0000",
    letterSpacing: 1,
    textShadowColor: 'rgba(139, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  form: {
    flex: 1,
  },
  field: {
    marginBottom: 20,
  },
  fieldRow: {
    flex: 1,
    marginHorizontal: 6,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#8B0000",
    fontWeight: "700",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#8B0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#8B0000',
    fontWeight: '600',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#8B0000",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
    marginRight: 12,
    letterSpacing: 1,
  },
});