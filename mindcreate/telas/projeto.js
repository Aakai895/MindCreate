import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Projeto({ navigation }) {
  const [image, setImage] = useState('https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg');
  const nomeP = useState('Boneca Fofa');
  const [notes, setNotes] = useState('');
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [iniciado, setIniciado] = useState(false);
  const [carreiraNum, setCarreira] = useState(1);
  //carreira func
  const carreiraN = () => {
    setCarreira(carreiraNum + 1);
  };
  //cronometro func
  useEffect(() => {
    let interval;
    if (iniciado) {
      interval = setInterval(() => {
        setTempoDecorrido((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [iniciado]);

  const iniciaCronometro = () => setIniciado(!iniciado);

  const zerarCronometro = () => {
    setTempoDecorrido(0);
    setIniciado(false);
  };
  //image picker
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{nomeP}</Text>
        {/* Você pode adicionar um ícone de coração aqui */}
      </View>
      <View>
        <TouchableOpacity onPress={pickImage}>
          <Image style={styles.image} source={{ uri: image }} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CARREIRA</Text>
        <Text style={styles.sectionTitle}>HORAS</Text>
      </View>

      <View style={styles.sectionContent}>
        <TouchableOpacity style={styles.careerBox} onPress={carreiraN}>
          <View style={styles.carreCron}>
            <Text style={styles.careerNumber}>{carreiraNum}</Text>
          </View>
        </TouchableOpacity>
        <View>
          <View style={styles.timeBox}>
            <Text style={styles.time}>
              {moment.utc(tempoDecorrido * 1000).format('HH:mm:ss')}
            </Text>
          </View>
          <View style={styles.playerButtons}>
            <TouchableOpacity
              onPress={iniciaCronometro}
              style={styles.playerButton}>
              <Icon
                name={iniciado ? 'pause' : 'play-arrow'}
                size={30}
                color="#8B0000"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={zerarCronometro}
              style={styles.playerButton}>
              <Icon name="stop" size={30} color="#8B0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.sectionTitle}>ANOTAÇÕES</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Digite suas anotações aqui..."
        />
      </View>
      <View style={styles.botaoFim}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Finalizar Projeto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff5e6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 150,
    marginTop: 20,
    borderRadius: 8,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
    marginLeft: 20,
    alignItems: 'center',
  },
  botaoFim: {},
  careerBox: {
    backgroundColor: '#8B0000',
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  careerNumber: {
    fontSize: 24,
    color: '#fff',
  },
  timeBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row', // Adiciona flexDirection row
    justifyContent: 'center', // Adiciona justifyContent space-between
    alignItems: 'center', // Adiciona alignItems center
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notesInput: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#8B0000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerButtons: {
    flexDirection: 'row',
  },
  playerButton: {
   
    backgroundColor: '#fff',
    borderRadius: 2,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
});
