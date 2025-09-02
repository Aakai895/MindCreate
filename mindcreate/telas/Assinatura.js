import React, { useState } from "react";
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';


export default function Inicialscreen({ navigation }) {

   const beneficios = [
    "Benefícios",
    "Benefícios",
    "Benefícios",
    "Benefícios",
    "Benefícios",
    "Benefícios",
    "Benefícios",
  ];

  return <SafeAreaView style={styles.container}> 
  <View style={styles.card}>
      <View style={styles.textoHeader}>
        <Text style={styles.textoTitle}>MENSAL CREATOR</Text>
        <Text style={styles.textoPreco}>R$20,00</Text>
      </View>
      <View style={styles.cardTexto}>
        <Text style={styles.texto}>Titular: <Text style={styles.bold}>Dalva Figueira</Text></Text>
        <Text style={styles.texto}>Status: <Text style={styles.bold}>Pago</Text></Text>
        <Text style={styles.texto}>Próximo Pagamento: <Text style={styles.bold}>01/08</Text></Text>
      </View>
    </View>
    <View style={styles.btn}>
      <TouchableOpacity><Text style={styles.red}>Cancelar Assinatura</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Assinar')}><Text>Trocar Assinatura</Text></TouchableOpacity>
    </View>
      <View style={styles.cardB}>
        <Text style={styles.textoTitle2}>BENEFÍCIOS</Text>
        {beneficios.map((item, index) => (
          <Text key={index} style={styles.textoBen}>• {item}</Text>
        ))}

    </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff5e6',
    padding: 8,
  },
  card: {
    backgroundColor: "#8B3A2D",
    borderRadius: 10,
    padding: 16,
    margin: 12,
    elevation: 3, 
    shadowColor: "#000", 
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    bottom: 65,
    height: 170,
  },
  cardB: {
    backgroundColor: "#8B3A2D",
    borderRadius: 10,
    padding: 20,
    width: "85%",
    elevation: 3, 
    shadowColor: "#000", 
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
    top: 0,
  },
  cardTexto: {
    left: 15,
    top: 10,
  },
  textoPreco: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 1,
  },
  textoTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 'bold',
  },
  textoHeader:{
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  texto:{
    color: "#fff",
    fontSize: 13,
    marginVertical: 2,
  },
  bold:{
    fontWeight: 'bold',
  },
  red:{
    color: 'red',
  },
  btn:{
    alignItems: 'center',
    bottom: 65,
  },
  textoBen:{
    color: "#fff",
    fontSize: 13,
    marginVertical: 2,
    left: 30,
  },
  textoTitle2: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
