import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function CartaoPagamento({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: 'https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png',
              }}
              style={styles.logo}
            />
          </View>
          <Text style={styles.tipoCartao}>CARTÃO DE DÉBITO</Text>
        </View>
        
        <Text style={styles.numeroCartao}>XXXX XXXX XXXX XXXX</Text>

        <View style={styles.cardFooter}>
          <View style={styles.infoGroup}>
            <Text style={styles.label}>CVV</Text>
            <Text style={styles.value}>XXX</Text>
          </View>
          <View style={styles.infoGroup}>
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

      <Text style={styles.addText}>Adicionar método de pagamento</Text>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Pix')}>
        <Image
          source={{
            uri: 'https://artpoin.com/wp-content/uploads/2023/09/artpoin-logo-pix.png',
          }}
          style={styles.logo2}
        />
        <Text style={styles.optionText}>Pix</Text>
        <Ionicons name="chevron-forward" size={20} color="#8B0000" style={styles.arrowIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('AddCred')}>
        <Ionicons name="card-outline" size={24} color="#8B0000" />
        <Text style={styles.optionText}>Cartão de Crédito</Text>
        <Ionicons name="chevron-forward" size={20} color="#8B0000" style={styles.arrowIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('AddDeb')}>
        <Ionicons name="card-outline" size={24} color="#8B0000" />
        <Text style={styles.optionText}>Cartão de Débito</Text>
        <Ionicons name="chevron-forward" size={20} color="#8B0000" style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff5e6',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#8B0000',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 40,
    height: 32,
    resizeMode: 'contain',
  },
  tipoCartao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  numeroCartao: {
    color: '#fff',
    fontSize: 22,
    letterSpacing: 3,
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoGroup: {
    alignItems: 'center',
  },
  label: {
    color: '#FFD7C2',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  line: { 
    flex: 1, 
    height: 2, 
    backgroundColor: "#8B0000",
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 16,
    fontWeight: "800",
    fontSize: 16,
    color: "#8B0000",
  },
  addText: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 18,
    fontWeight: '700',
    color: "#8B0000",
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#8B0000',
  },
  logo2: {
    width: 24,
    height: 24,
  },
  optionText: {
    marginLeft: 16,
    fontSize: 17,
    fontWeight: '600',
    color: "#8B0000",
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
});