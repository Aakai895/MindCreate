import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function Sel1({ navigation }) {
  const beneficios = [
    "Acesso a conteúdo exclusivo",
    "Suporte prioritário",
    "Descontos especiais",
    "Eventos online",
    "Comunidade privada",
    "Material bônus",
    "Atualizações constantes"
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack("Assinar")}
      >
        <Ionicons name="arrow-back" size={28} color="#8B0000" />
      </TouchableOpacity>
      
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>MENSAL CREATOR</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BÁSICO</Text>
            </View>
          </View>
          <Text style={styles.price}>R$20,00</Text>
          <Text style={styles.period}>por mês</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.body}>
          <Text style={styles.benefitsTitle}>BENEFÍCIOS INCLUÍDOS</Text>
          <View style={styles.benefitsList}>
            {beneficios.map((item, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#fff" />
          <Text style={styles.date}>
            Cobrança será realizada no dia 01/10/2025
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>CONFIRMAR PAGAMENTO</Text>
        <Ionicons name="lock-closed" size={20} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff5e6", 
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
  card: {
    backgroundColor: "#8B0000", 
    borderRadius: 20,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#8B0000',
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginRight: 12,
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#8B0000",
  },
  price: {
    fontSize: 36,
    fontWeight: "800",
    color: "white",
    marginBottom: 4,
  },
  period: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    opacity: 0.9,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
    marginVertical: 16,
    opacity: 0.3,
  },
  body: {
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  date: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#8B0000",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginRight: 12,
    letterSpacing: 0.5,
  },
});