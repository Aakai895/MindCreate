import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";

export default function PixScreen({ navigation }) {
  const linkPix = "311fd178b8510f68udm%2Bfb=AliJpHaX5Jpdenkis...";

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(linkPix);
    Alert.alert("Copiado!", "O link do Pix foi copiado para a área de transferência.");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack("Pagar")} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#8B0000" />
      </TouchableOpacity>
      
      <Text style={styles.title}>PAGAMENTO PIX</Text>

      <View style={styles.qrContainer}>
        <Image
          source={require("../../assets/CodePix.png")}
          style={styles.qrcode}
        />
      </View>

      <View style={styles.pixContainer}>
        <Text style={styles.titlePix}>Link do Pix</Text>
        <View style={styles.inputPix}>
          <TextInput
            style={styles.input}
            value={linkPix}
            editable={false}
          />
          <TouchableOpacity style={styles.copiar} onPress={copyToClipboard}>
            <Ionicons name="copy-outline" size={24} color="#fff" />
            <Text style={styles.copiarText}>Copiar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#8B0000" />
        <Text style={styles.infoText}>O código PIX expira em 30 minutos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff5e6", 
    alignItems: "center",
    padding: 24,
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
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginVertical: 20,
    color: "#8B0000",
    letterSpacing: 1,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  qrcode: {
    width: 220,
    height: 220,
  },
  pixContainer: {
    width: "100%",
    marginBottom: 24,
  },
  titlePix: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#8B0000",
    textAlign: 'center',
  },
  inputPix: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#8B0000",
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#8B0000",
    fontWeight: '600',
  },
  copiar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#8B0000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 8,
    borderRadius: 12,
  },
  copiarText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 6,
    fontSize: 14,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    marginLeft: 8,
    color: "#8B0000",
    fontWeight: "600",
    fontSize: 14,
    flex: 1,
  },
});