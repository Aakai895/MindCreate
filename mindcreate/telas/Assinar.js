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


export default function Assinar({navigation}) {


  return <SafeAreaView style={styles.container}> 
    <View style={styles.card}>
      <View style={styles.textoHeader}>
        <Text style={styles.textoTitle}>MENSAL CREATOR</Text>
      </View>
      <View style={styles.cardTexto}>
        <Text style={styles.textoPreco}>R$20,00</Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Selecao1')}><Text style={styles.textoBTN}>SELECIONAR</Text></TouchableOpacity>
      </View>
    </View>
    <View style={styles.card2}>
      <View style={styles.textoHeader}>
        <Text style={styles.textoTitle}>MENSAL CREATOR+</Text>
      </View>
      <View style={styles.cardTexto}>
        <Text style={styles.textoPreco}>R$50,00</Text>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Selecao2')}><Text style={styles.textoBTN}>SELECIONAR</Text></TouchableOpacity>
      </View>
    </View>
    <View style={styles.card3}>
      <View style={styles.textoHeader}>
        <Text style={styles.textoTitle}>ANUAL CREATOR</Text>
      </View>
      <View style={styles.cardTexto}>
        <Text style={styles.textoPreco}>R$480<Text style={{left: 30, fontSize: 12,}}>-20%</Text></Text>
          <TouchableOpacity onPress={() => navigation.navigate('Selecao3')} style={styles.btn}><Text style={styles.textoBTN}>SELECIONAR</Text></TouchableOpacity>
      </View>
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
    height: 170,
  },
  card2: {
    backgroundColor: "#C55841",
    borderRadius: 10,
    padding: 16,
    margin: 12,
    elevation: 3, 
    shadowColor: "#000", 
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    height: 170,
  },
  card3: {
    backgroundColor: "#E65C3F",
    borderRadius: 10,
    padding: 16,
    margin: 12,
    elevation: 3, 
    shadowColor: "#000", 
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    height: 170,
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
  textoBTN:{
    fontSize: 13,
    marginVertical: 2,
    textAlign: 'center',
    top: 3,
  },
  btn:{
    alignSelf: 'center',
    top: 23,
    right: 15,
    backgroundColor: '#fff',
    height: 30,
    width: 200,
    borderRadius: 30
  },
});
