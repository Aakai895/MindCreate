import React, { useState } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';

export default function Produto({ navigation }) {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#C14D34" />
          </TouchableOpacity>
        </View>

        <Image style={styles.image} source={{ uri: image }} />

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.ratingPriceRow}>
            <Rating
              type="star"
              ratingCount={5}
              imageSize={24}
              startingValue={rating}
              onFinishRating={handleRating}
              showRating={false}
              starStyle={{ backgroundColor: 'transparent' }}
            />
            <Text style={styles.price}>{price}</Text>
          </View>

          <TouchableOpacity style={styles.buyButton} onPress={() => navigation.navigate('Pagar')}>
            <Text style={styles.buyButtonText}>Comprar Agora</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartButton}>
            <Text style={styles.cartButtonText}>Adicionar ao Carrinho</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ratingPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C14D34',
  },
  buyButton: {
    backgroundColor: '#C14D34',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#FFE3D4',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  cartButtonText: {
    color: '#C14D34',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
    color: '#555',
  },
});
