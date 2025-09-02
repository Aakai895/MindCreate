import {React, useState} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import Projetos from './projetos';

export default function InicialScreen({ navigation }) {
  const proj = ['31 de Agosto'];
  const [image, setImage] = useState(
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwH4dmberk7y0YX9X9hBgokmG2UFNstAStA&s'
  );

  const title = 'Receita de Abelha Simples com Asas e Duas Listras Pretas';
  const price = 'R$ 10,00';
  const description =
    'Receita natural feita com ingredientes selecionados. Ideal para quem busca um produto artesanal e autêntico. Sem conservantes e perfeita para todas as ocasiões.';

  const [rating, setRating] = useState(0);

  const handleRating = (value) => {
    setRating(value);
    console.log('Nota dada:', value);
  };
  const handlePress = () => {
    navigation.navigate('Projetos'); // Navega para a tela 'Projetos'
  };
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.cardinicial}>
          <View style={styles.container2}>
            <Text style={styles.text}>BEM VINDO!</Text>
          </View>   
          <View style={styles.projeto}>
            <Text style={styles.text2}>Próximo Projeto</Text>
            <Text style={styles.text3}>{proj}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.card2}>
            <Text style={styles.text2}>Descubra mais projetos!</Text>
            <View style={styles.card}>
              <Image style={styles.image} source={{ uri: image }} />
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.card}>
              <Image style={styles.image} source={{ uri: image }} />
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.card}>
              <Image style={styles.image} source={{ uri: image }} />
              <Text style={styles.title}>{title}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 8,
  },
  text: {
    color: '000',
    fontSize: 30,
    textAlign: 'center',
  },
  text2: {
    color: '000',
    fontSize: 20,
    textAlign: 'center',
  },
  text3: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    margin: 3,
    borderRadius: 30,
    border: 3,
    backgroundColor: '#C4624E',
    width: 150,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff5e6',
    padding: 8,
  },
  projeto: {
    alignSelf: 'center',
    margin: 30,
  },
  cardinicial: {
    bottom: 0,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#964534",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    margin: 10,
  },
  
  image: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 10,
    resizeMode: "cover",
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
