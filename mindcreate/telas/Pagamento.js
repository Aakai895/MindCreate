import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function CartaoPagamento({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: 'https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png',
            }}
            style={styles.logo}
          />
        </View>

        <Text style={styles.tipoCartao}>CARTÃO DE DÉBITO</Text>
        <Text style={styles.numeroCartao}>XXXX XXXX XXXX XXXX</Text>

        <View style={styles.row}>
          <View style={{left: 30,}}>
            <Text style={styles.label}>CVV</Text>
            <Text style={styles.value}>XXX</Text>
          </View>
          <View>
            <Text style={styles.label}>VALIDADE</Text>
            <Text style={styles.value}>XX/XX</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OU</Text>
        <View style={styles.line} />
      </View>

      <Text style={styles.addText}>Adicionar</Text>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Pix')}>
        <Image
            source={{
              uri: 'https://artpoin.com/wp-content/uploads/2023/09/artpoin-logo-pix.png',
            }}
            style={styles.logo2}/>
        <Text style={styles.optionText}>Pix</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('AddCred')}>
        <Ionicons name="card-outline" size={22} color="#15006A" />
        <Text style={styles.optionText}>Crédito</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('AddDeb')}>
        <Ionicons name="card-outline" size={22} color="#118000" />
        <Text style={styles.optionText}>Débito</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5e8da' },
  card: {
    backgroundColor: '#A3422C',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  logoContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  logo: {
    width: 50,
    height: 40,
    resizeMode: 'contain',
    top: 40,
  },
  logo2: {
    width: 22,
    height: 22,
  },
  tipoCartao: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'right',
    marginBottom: 20,
  },
  numeroCartao: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 3,
    marginBottom: 20,
    left: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  line: { flex: 1, height: 1, backgroundColor: "#333" },
  dividerText: {
    marginHorizontal: 8,
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  addText: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
    color: "#333",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: 360,
    alignSelf: 'center',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#2d3436",
  },
});
