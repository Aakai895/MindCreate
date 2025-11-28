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
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderWidth: 2,
    borderColor: '#8B0000',
    borderRadius: 25,
    width: '82%',
    fontSize: 16,
    color: '#8B0000',
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cart: {
    padding: 8,
  },
  cartBadge: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  card: {
    borderColor: '#8B0000',
    borderWidth: 2,
    borderRadius: 16,
    width: '48%',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    height: 120,
    width: '100%',
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  titprod: {
    fontSize: 14,
    marginVertical: 6,
    color: '#8B0000',
    fontWeight: '600',
    lineHeight: 18,
  },
  ratingContainer: {
    marginVertical: 6,
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8B0000',
    marginTop: 4,
  },
});