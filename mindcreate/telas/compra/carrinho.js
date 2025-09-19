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
        <Text>Preço: R$ {item.preco.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => excluirItem(item.id)}>
          <Text style={styles.excluirTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
          <TouchableOpacity
            style={styles.cart}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="#C14D34" />
          </TouchableOpacity>
        </View>
      <FlatList
        data={carrinho}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.vazio}>Seu carrinho está vazio.</Text>}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalTexto}>Total: R$ {calcularTotal()}</Text>
      </View>
       <TouchableOpacity style={styles.bntAdd} >
          <Text style={styles.btnaddText}>CRIAR PROJETO</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemNome: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  excluirTexto: {
    marginTop: 8,
    color: 'red',
    fontWeight: 'bold',
  },
  totalContainer: {
    
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#CAB7B3',
    margin: 1,
    borderRadius: 3,
  },
  totalTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  
  vazio: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#999',
  },
  header: {
    margin: 10,
    marginTop: 30,
    padding: 5,
  },
   bntAdd: {
    backgroundColor: '#8B0000',
    padding: 15 ,
    alignItems: 'center',
    borderRadius: 3,
    marginTop: 5,
    marginBottom: 40,
   },
     btnaddText: {
    color: 'white',
    fontWeight: 'bold',
  },
    
});

