import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  FlatList,
} from 'react-native';

export default function Telainicial({ navigation }) {
  const proj = ['31 de Agosto'];

  const [image] = useState(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s'
  );

  const title = 'Receita de Abelha Simples com Asas e\nDuas Listras Pretas';

  const projetosData = [
    { id: '1', title, image },
    { id: '2', title, image },
    { id: '3', title, image },
  ];

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.cardinicial}>
          <Text style={styles.text}>BEM VINDO!</Text>

          <View style={styles.projeto}>
            <Text style={styles.text2}>Próximo Projeto</Text>
            <View style={styles.badge}>
              <Text style={styles.text3}>{proj}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card2}>
          <Text style={styles.text2}>Descubra mais projetos!</Text>
          <Text style={styles.subtitle}>
            Explore ideias interessantes para seus próximos passos
          </Text>
          <FlatList
            data={projetosData}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image style={styles.image} source={{ uri: item.image }} />
                <Text style={styles.title}>{item.title}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 16,
  },
  container: {
    flex: 1,
  },
  text: {
    color: '#000',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
  },
  text2: {
    color: '#000',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: '#4a4a4a',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
  },
  text3: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: '#8B0000',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  cardinicial: {
    marginBottom: 30,
  },
  card2: {
    paddingVertical: 10,
  },
  projeto: {
    alignItems: 'center',
  },
  badge: {
    marginTop: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#8B0000',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 15,
    width: 320,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 14,
    resizeMode: 'cover',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
});
