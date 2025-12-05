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
        <TextInput 
          style={styles.input} 
          placeholder="Pesquisar produtos..." 
          placeholderTextColor="#8B0000"
        />
        <TouchableOpacity
          style={styles.cart}
          onPress={() => navigation.navigate('Carrinho')}
        >
          <View style={styles.cartBadge}>
            <Ionicons name="cart-sharp" size={28} color="#8B0000" />
          </View>
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
                  Receita de abelha simples com asas e duas listras pretas
                </Text>
                <View style={styles.ratingContainer}>
                  <Rating
                    type="star"
                    ratingCount={5}
                    imageSize={18}
                    startingValue={rating}
                    onFinishRating={handleRating}
                    showRating={false}
                    tintColor="#fffaf0"
                  />
                </View>
                <Text style={styles.price}>R$ 10,00</Text>
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
    padding: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '82%',
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  cart: {
    padding: 4,
  },
  cartBadge: {
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '48%',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  image: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  titprod: {
    fontSize: 13,
    marginVertical: 6,
    color: '#333333',
    fontWeight: '600',
    lineHeight: 16,
  },
  ratingContainer: {
    marginVertical: 6,
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B0000',
    marginTop: 4,
  },
});