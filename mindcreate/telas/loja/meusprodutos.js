import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ComprasScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.main}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.metricCard}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>VENDAS DO MÊS</Text>
            <Text style={styles.metricValue}>12</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>SALDO</Text>
            <Text style={styles.metricValue}>R$ 112,00</Text>
          </View>
        </View>

        <View style={styles.graphCard}>
          <Text style={styles.graphTitle}>Vendas da Semana</Text>
          <View style={styles.barContainer}>
            {fakeData.map((item, index) => (
              <View key={index} style={styles.barItem}>
                <View
                  style={[
                    styles.bar,
                    { height: item.valor * 3 },
                  ]}
                />
                <Text style={styles.barLabel}>{item.dia}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Produtos')}
        >
          <Icon name="store" size={28} color="#fff" style={{ marginRight: 12 }} />
          <Text style={styles.buttonText}>Ver Produtos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const fakeData = [
  { dia: 'Seg', valor: 3 },
  { dia: 'Ter', valor: 5 },
  { dia: 'Qua', valor: 2 },
  { dia: 'Qui', valor: 7 },
  { dia: 'Sex', valor: 4 },
  { dia: 'Sáb', valor: 6 },
  { dia: 'Dom', valor: 1 },
];

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff5e6',
  },
  scroll: {
    padding: 24,
  },
  metricCard: {
    backgroundColor: '#C4624E',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 28,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  metricBox: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  graphCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 28,
  },
  graphTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#C4624E',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 8,
  },
  barItem: {
    alignItems: 'center',
    width: 36,
  },
  bar: {
    width: 24,
    backgroundColor: '#C4624E',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  barLabel: {
    marginTop: 10,
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#964534',
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});