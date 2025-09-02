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
        {/* Bloco de métricas */}
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

        {/* Gráfico fictício */}
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

        {/* Botão de navegação */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Produtos')}
        >
          <Icon name="store" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Ver Produtos</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Dados de exemplo para o gráfico
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
    padding: 20,
  },
  metricCard: {
    backgroundColor: '#C4624E',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },
  metricBox: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  graphCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C4624E',
    marginBottom: 15,
    textAlign: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barItem: {
    alignItems: 'center',
    width: 30,
  },
  bar: {
    width: 20,
    backgroundColor: '#C4624E',
    borderRadius: 4,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#444',
  },
  button: {
    backgroundColor: '#964534',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
