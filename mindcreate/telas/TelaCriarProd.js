import React, { useState } from "react";
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

export default function Chatscreen(props) {
  const [nome, setNome] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardIMG}>
        <Text style={styles.cardTexto}>
          FOTOS DO PRODUTO <Text style={{ color: 'red' }}>*</Text>
        </Text>

        <View style={styles.row}>
          {images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))}

          <TouchableOpacity style={styles.addBox} onPress={pickImage}>
            <Text style={styles.plus}>+</Text>
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
          placeholderTextColor="#000"
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
          placeholderTextColor="#000"
        />
      </View>

      <View style={styles.card}>
        <View style={styles.titulocardP}>
          <Ionicons name="pricetag-outline" size={20} color={''} />
          <Text style={styles.cardTexto}>
            PREÇO <Text style={styles.asterisco}>*</Text>
          </Text>
        </View>
        <TextInput style={styles.cardTextoI} maxLength={6} placeholder={'Definir'} keyboardType='numeric'/>
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
          <Text style={styles.footertextoBotao}>ADICIONAR ARQUIVO</Text>
          <Ionicons name="document-text-outline" size={28} color={''} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerbtn}>
          <Text style={styles.footertextoBotao}>FINALIZAR</Text>
        </TouchableOpacity>
      </View>
</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff5e6',
    padding: 8,
  },
  card: {
    backgroundColor: "#F2A190",
    padding: 16,
    marginBottom: 12,
    margin: 7,
    borderRadius: 8,
    borderColor: "#ddd",
    elevation: 2,
    bottom: 50
  },
  cardIMG: {
    backgroundColor: "#F2A190",
    padding: 16,
    marginBottom: 12,
    margin: 7,
    borderRadius: 8,
    borderColor: "#ddd",
    elevation: 2,
    height: 150,
    bottom: 50,
  },
  cardD: {
    backgroundColor: "#F2A190",
    padding: 16,
    marginBottom: 12,
    margin: 7,
    borderRadius: 8,
    borderColor: "#ddd",
    elevation: 2,
    bottom: 50,
    height: 160,
  },
  cardTextoBTN: {
    backgroundColor: '#FFAE9D',
    borderRadius: 12,
    padding: 4,
    marginBottom: 2,
    flex: 1,
    fontWeight: 'bold',
    width: 90,
  },
  cardBotoes: {
    flexDirection: "row",
    justifyContent: "space-between", 
    marginTop: 10,
    alignContent: 'center',
  },
  cardTextoI: {
    marginTop: 5,
    color: "#000",
  },
  cardTexto: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footertextoBotao: {
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  titulocardP: {
    flexDirection: 'row',
  },
  asterisco: {
    color: "red",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  contador: {
    fontSize: 12,
    color: "#E58585",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  addBox: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  plus: {
    fontSize: 28,
    fontWeight: "bold",
  }
});
