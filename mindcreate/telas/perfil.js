import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Profile({ navigation }) {






  //nome usuário
  const [nome, setNome] = useState('cheirosa_111');
  const seguidores = useState('0');
  const seguindo = useState('0');
  //mudar imagem

  const [image, setImage] = useState(
    'https://cdn-icons-png.flaticon.com/512/3736/3736502.png'
  );
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View >
          <TouchableOpacity onPress={pickImage}>
            <Image
              style={{
              width: 100,
              height: 100,
              marginTop: 30,
              borderRadius: 100,
                }}
              source={{ uri: image }}
              />
          </TouchableOpacity>
          <Text style={styles.username}>@{nome}</Text>
        </View>
        <View style={styles.segcontainer}>
            <Text style={styles.segText}>Seguidores:</Text>
            <Text style={styles.segNumber}>{seguidores}</Text>
          </View>
        <View style={styles.segcontainer}>
          <Text style={styles.segText}>Seguindo:</Text>
          <Text style={styles.segNumber}>{seguidores}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff5e6',
  },
  container: {
    margin: '1%',
    flexDirection: 'row',
    justifyContent: 'center',
    
  },
  username: {
    margin: '2%',
  },
  segcontainer: {
    margin: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segText: {
    margin: '2%',
    fontWeight: 'bold',
  },

});
