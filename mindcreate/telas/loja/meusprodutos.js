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
                    { height: item.valor * 20 },
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
    padding: 16,
  },
  metricCard: {
    backgroundColor: '#8B0000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  metricBox: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '800',
  },
  graphCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 4,
  },
  barItem: {
    alignItems: 'center',
    width: 32,
  },
  bar: {
    width: 20,
    backgroundColor: '#8B0000',
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#8B0000',
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});