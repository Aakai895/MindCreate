import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Carrinho({navigation}) {
  const [carrinho, setCarrinho] = useState([
    {
      id: '1',
      nome: 'Receita de Abelha Simples com Asas e Três Listras Pretas',
      preco: 9.99,
      imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s',
    },
    {
      id: '2',
      nome: 'Receita Stitch Lilo & Stitch Série Desenho Fofo',
      preco: 10.90,
      imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPM61zjJYWGMf_zD9UJl4kaZRZMxpmcnbAQQ&s',
    },
  ]);

  const excluirItem = (id) => {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.preco, 0).toFixed(2);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imagem }}
        style={styles.listImage}
        defaultSource={require('../../assets/no-image.jpg')}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.nome}</Text>
        <Text style={styles.itemPreco}>R$ {item.preco.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.excluirBtn}
          onPress={() => excluirItem(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.excluirTexto}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#8B0000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Carrinho</Text>
      </View>

      <FlatList
        data={carrinho}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.vazio}>Seu carrinho está vazio.</Text>}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValor}>R$ {calcularTotal()}</Text>
        </View>
        <TouchableOpacity style={styles.bntAdd}>
          <Text style={styles.btnaddText}>FINALIZAR COMPRA</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#8B0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#fff5e6',
    borderRadius: 20,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8B0000',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#8B0000',
  },
  listImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemNome: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
    color: '#8B0000',
    lineHeight: 20,
  },
  itemPreco: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8B0000',
    marginBottom: 10,
  },
  excluirBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  excluirTexto: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: '#8B0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff5e6',
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B0000',
  },
  totalValor: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8B0000',
  },
  bntAdd: {
    backgroundColor: '#8B0000',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  btnaddText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    marginRight: 8,
    letterSpacing: 0.5,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
    color: '#8B0000',
    fontSize: 18,
    fontWeight: '600',
  },
});