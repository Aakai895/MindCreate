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
import { Ionicons } from '@expo/vector-icons';

import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Projeto({ navigation }) {
  const [image, setImage] = useState(
    'https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg'
  );
  const [nomeP] = useState('Boneca Fofa');
  const [notes, setNotes] = useState('');
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [iniciado, setIniciado] = useState(false);
  const [carreiraNum, setCarreira] = useState(1);

  // Função para incrementar carreira
  const carreiraN = () => {
    setCarreira(carreiraNum + 1);
  };

  // Cronômetro
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

  // Image picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
          <TouchableOpacity
            style={styles.cart}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="#C14D34" />
          </TouchableOpacity>
        </View>
      <View style={styles.tit}>
        <Text style={styles.title}>{nomeP}</Text>
      </View>

      <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
        <Image style={styles.image} source={{ uri: image }} />
      </TouchableOpacity>

      <View style={styles.infoRow}>
        <View style={styles.careerContainer}>
          <Text style={styles.sectionTitle}>CARREIRA</Text>
          <TouchableOpacity style={styles.careerBox} onPress={carreiraN} activeOpacity={0.7}>
            <Text style={styles.careerNumber}>{carreiraNum}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.sectionTitle}>HORAS</Text>
          <View style={styles.timeBox}>
            <Text style={styles.time}>
              {moment.utc(tempoDecorrido * 1000).format('HH:mm:ss')}
            </Text>
          </View>

          <View style={styles.playerButtons}>
            <TouchableOpacity onPress={iniciaCronometro} style={styles.playerButton}>
              <Icon
                name={iniciado ? 'pause' : 'play-arrow'}
                size={30}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={zerarCronometro} style={[styles.playerButton, styles.stopButton]}>
              <Icon name="stop" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.notesContainer}>
        <Text style={styles.sectionTitle}>ANOTAÇÕES</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Digite suas anotações aqui..."
          placeholderTextColor="#999"
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Finalizar Projeto</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    marginTop: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8B0000',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    marginBottom: 25,
    backgroundColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  careerContainer: {
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  careerBox: {
    marginTop: 10,
    backgroundColor: '#8B0000',
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B0000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 10,
  },
  careerNumber: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '900',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B0000',
  },
  timeBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#8B0000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  time: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8B0000',
    fontVariant: ['tabular-nums'], // para números alinhados
  },
  playerButtons: {
    flexDirection: 'row',
    marginTop: 15,
  },
  playerButton: {
    backgroundColor: '#8B0000',
    width: 52,
    height: 52,
    borderRadius: 14,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B0000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 12,
    elevation: 8,
  },
  stopButton: {
    backgroundColor: '#B22222',
  },
  notesContainer: {
    marginBottom: 25,
  },
  notesInput: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    minHeight: 120,
    fontSize: 16,
    color: '#333',
    shadowColor: '#8B0000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
  },
  button: {
    backgroundColor: '#8B0000',
    paddingVertical: 16,
    borderRadius: 15,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#8B0000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
