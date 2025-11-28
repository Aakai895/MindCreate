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
                <View style={styles.imageContainer}>
                  <Image style={styles.image} source={{ uri: item.image }} />
                </View>
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
    padding: 20,
  },
  container: {
    flex: 1,
  },
  text: {
    color: '#8B0000',
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: 'rgba(139, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  text2: {
    color: '#8B0000',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8B0000',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  text3: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    backgroundColor: '#8B0000',
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardinicial: {
    marginBottom: 40,
    paddingVertical: 20,
  },
  card2: {
    paddingVertical: 15,
  },
  projeto: {
    alignItems: 'center',
  },
  badge: {
    marginTop: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#8B0000',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginRight: 18,
    width: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 85,
    height: 85,
    borderRadius: 12,
    marginRight: 16,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    lineHeight: 22,
  },
});