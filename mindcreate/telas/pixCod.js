import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";

export default function PixScreen() {
  const linkPix = "311fd178b8510f68udm%2Bfb=AliJpHaX5Jpdenkis...";

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(linkPix);
    Alert.alert("Copiado!", "O link do Pix foi copiado para a área de transferência.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR CODE</Text>

      <Image
        source={require("../assets/CodePix.png")}
        style={styles.qrcode}
      />

      <View style={styles.pixContainer}>
        <Text style={styles.titlePix}>Link do Pix</Text>
        <View style={styles.inputPix}>
          <TextInput
            style={styles.input}
            value={linkPix}
            editable={false}
          />
          <TouchableOpacity style={styles.copiar} onPress={copyToClipboard}>
            <Ionicons name="copy-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAEBD7", 
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  qrcode: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  pixContainer: {
    width: "100%",
  },
  titlePix: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputPix: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#555",
  },
  copiar: {
    padding: 5,
  },
});
