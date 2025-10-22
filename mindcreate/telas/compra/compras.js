import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';

export default function ComprasScreen({ navigation }) {
  const [rating, setRating] = useState(0);

  const handleRating = (value) => {
    setRating(value);
    console.log('Nota dada:', value);
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.headerContainer}>
        <TextInput style={styles.input} placeholder="escreva aqui" />
        <TouchableOpacity
          style={styles.cart}
          onPress={() => navigation.navigate('Carrinho')}
        >
          <Ionicons name="cart-sharp" size={30} color="#8B0000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardContainer}>
          {[...Array(6)].map((_, index) => (
            <View key={index} style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate('Produto')}>
                <Image
                  style={styles.image}
                  source={require('../../assets/receitaabelha.webp')}
                />
                <Text style={styles.titprod}>
                  Receita de abelha simples...
                </Text>
                <View style={styles.ratingContainer}>
                  <Rating
                    type="star"
                    ratingCount={5}
                    imageSize={15}
                    startingValue={rating}
                    onFinishRating={handleRating}
                    showRating={false}
                    starStyle={{ backgroundColor: 'transparent' }}
                  />
                </View>
                <Text>10,00</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: '80%',
  },
  cart: {
    padding: 5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  card: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 3,
    width: 160,
    margin: 10,
    padding: 5,
    backgroundColor: '#fff',
  },
  image: {
    height: 110,
    width: '100%',
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 5,
  },
  titprod: {
    fontSize: 10,
    marginVertical: 5,
  },
  ratingContainer: {
    marginVertical: 4,
    alignItems: 'flex-start',
  },
});
