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

export default function Chatscreen(props) {
  const [nome, setNome] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardIMG}>
        <Text style={styles.cardTexto}>
          FOTOS DO PRODUTO <Text style={styles.asterisco}>*</Text>
        </Text>
        
        <View style={styles.row}>
          {image && (
            <Image source={{ uri: image }} style={styles.image} />
          )}

          <TouchableOpacity style={styles.addBox} onPress={pickImage}>
            <Ionicons name="add" size={32} color="#8B0000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTexto}>
            NOME DO PRODUTO <Text style={styles.asterisco}>*</Text>
          </Text>
          <Text style={styles.contador}>{nome.length}/100</Text>
        </View>
        <TextInput 
          style={styles.cardTextoI} 
          maxLength={100} 
          value={nome} 
          onChangeText={setNome} 
          placeholder={'Digite o nome do produto'} 
          placeholderTextColor="#8B0000"
        />
      </View>

      <View style={styles.cardD}>
        <View style={styles.header}>
          <Text style={styles.cardTexto}>
            DESCRIÇÃO <Text style={styles.asterisco}>*</Text>
          </Text>
          <Text style={styles.contador}>{desc.length}/500</Text>
        </View>
        <TextInput 
          style={styles.cardTextoI} 
          maxLength={500} 
          value={desc} 
          onChangeText={setDesc} 
          placeholder={'Escreva a descrição'} 
          placeholderTextColor="#8B0000"
          multiline
        />
      </View>

      <View style={styles.card}>
        <View style={styles.titulocardP}>
          <Ionicons name="pricetag-outline" size={20} color="#8B0000" />
          <Text style={styles.cardTexto}>
            PREÇO <Text style={styles.asterisco}>*</Text>
          </Text>
        </View>
        <TextInput 
          style={styles.cardTextoI} 
          maxLength={6} 
          placeholder={'Definir'}
          placeholderTextColor="#8B0000"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTexto}>
          CATEGORIA <Text style={styles.asterisco}>*</Text>
        </Text>
        <View style={styles.cardBotoes}>
          <TouchableOpacity style={styles.cardBotao}>
            <Text style={styles.cardTextoBTN}>RECEITA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardBotao}>
            <Text style={styles.cardTextoBTN}>EBOOK</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardBotao}>
            <Text style={styles.cardTextoBTN}>TUTORIAL</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerbtn}>
          <Ionicons name="document-text-outline" size={24} color="#fff" />
          <Text style={styles.footertextoBotao}>ADICIONAR ARQUIVO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.footerbtn, styles.footerbtnPrimary]}>
          <Text style={styles.footertextoBotao}>FINALIZAR</Text>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#8B0000",
  },
  cardIMG: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#8B0000",
  },
  cardD: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#8B0000",
  },
  cardTextoBTN: {
    backgroundColor: '#8B0000',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
  },
  cardBotoes: {
    flexDirection: "row",
    justifyContent: "space-between", 
    marginTop: 12,
    gap: 8,
  },
  cardBotao: {
    flex: 1,
  },
  cardTextoI: {
    marginTop: 8,
    color: "#8B0000",
    fontSize: 16,
    fontWeight: '600',
    padding: 12,
    backgroundColor: '#fff5e6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  cardTexto: {
    fontWeight: '800',
    fontSize: 16,
    color: "#8B0000",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 2,
    borderColor: "#8B0000",
  },
  footerbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 6,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  footerbtnPrimary: {
    backgroundColor: '#8B0000',
  },
  footertextoBotao: {
    fontWeight: '800',
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 8,
    letterSpacing: 0.5,
  },
  titulocardP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  asterisco: {
    color: "#8B0000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  contador: {
    fontSize: 14,
    color: "#8B0000",
    fontWeight: '600',
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  addBox: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#fff5e6',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
});