import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, Platform, Alert } from 'react-native';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; 
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Icon from 'react-native-vector-icons/MaterialIcons';

dayjs.extend(utc);

export default function Projeto({ route, navigation }) {
  const { projetoId } = route.params;
  
  console.log('📱 Tela de DETALHES - Projeto ID recebido:', projetoId);
  console.log('📱 Tipo do ID:', typeof projetoId);

  const [image, setImage] = useState('');
  const [nomeP, setNomeP] = useState('');
  const [notes, setNotes] = useState('');
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [iniciado, setIniciado] = useState(false);
  const [carreiraNum, setCarreira] = useState(1);
  const [loading, setLoading] = useState(false);

  // Função para atualizar projeto
  const atualizarProjeto = useCallback(async (dados) => {
    try {
      console.log('🔄 Atualizando projeto:', projetoId, 'com dados:', dados);
      const projetoRef = doc(db, 'projetos', projetoId);
      await updateDoc(projetoRef, dados);
      console.log('✅ Projeto atualizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar projeto:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o projeto');
    }
  }, [projetoId]);

  // Escuta em tempo real as mudanças no projeto
  useEffect(() => {
    console.log('🔍 Iniciando listener para projeto ID:', projetoId);
    console.log('🔍 DB object:', db); // ← ISSO É IMPORTANTE!

    if (!projetoId) {
      console.log('❌ projetoId é undefined ou null');
      Alert.alert('Erro', 'ID do projeto não encontrado');
      return;
    }

    const projetoRef = doc(db, 'projetos', projetoId);
    console.log('👂 Criando listener para:', projetoRef.path);

    const unsubscribe = onSnapshot(
      projetoRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('📄 Dados recebidos do Firestore:', data);
          setImage(data.image || '');
          setNomeP(data.nomeP || '');
          setNotes(data.anotacoes || '');
          setTempoDecorrido(data.tempo || 0);
          setCarreira(data.carreiras || 1);
          setIniciado(data.iniciado || false);
        } else {
          console.log('❌ Projeto não encontrado no Firestore');
          Alert.alert('Erro', 'Projeto não encontrado');
        }
      },
      (error) => {
        console.error('❌ Erro no onSnapshot:', error);
        Alert.alert('Erro', 'Falha ao carregar projeto');
      }
    );

    return () => {
      console.log('🔇 Removendo listener do projeto');
      unsubscribe();
    };
  }, [projetoId]);

  // Atualiza tempo no Firestore enquanto cronômetro está ativo
  useEffect(() => {
    if (!iniciado) return;

    const interval = setInterval(() => {
      setTempoDecorrido((prev) => {
        const novo = prev + 1;
        atualizarProjeto({ tempo: novo });
        return novo;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [iniciado, atualizarProjeto]);

  const iniciaCronometro = async () => {
    const novoEstado = !iniciado;
    setIniciado(novoEstado);
    await atualizarProjeto({ iniciado: novoEstado });
  };

  const zerarCronometro = async () => {
    setIniciado(false);
    setTempoDecorrido(0);
    await atualizarProjeto({ tempo: 0, iniciado: false });
  };

  const carreiraN = async () => {
    const nova = carreiraNum + 1;
    setCarreira(nova);
    await atualizarProjeto({ carreiras: nova });
  };

  // Atualiza anotações com debounce para evitar muitos writes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (notes !== '') {
        atualizarProjeto({ anotacoes: notes });
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [notes, atualizarProjeto]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await atualizarProjeto({ image: uri });
    }
  };

  const finalizarProjeto = () => {
    Alert.alert(
      'Finalizar Projeto',
      'Deseja finalizar este projeto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Finalizar',
          onPress: () => {
            setIniciado(false);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#8B0000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tit}>
        <Text style={styles.title}>{nomeP || 'Carregando...'}</Text>
      </View>

      <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
        {image ? (
          <Image style={styles.image} source={{ uri: image }} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera" size={50} color="#8B0000" />
            <Text style={styles.placeholderText}>Toque para adicionar imagem</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.infoRow}>
        <View style={styles.careerContainer}>
          <Text style={styles.sectionTitle}>CARREIRA</Text>
          <TouchableOpacity
            style={styles.careerBox}
            onPress={carreiraN}
            activeOpacity={0.7}
          >
            <Text style={styles.careerNumber}>{carreiraNum}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.sectionTitle}>HORAS</Text>
          <View style={styles.timeBox}>
            <Text style={styles.time}>
              {dayjs.utc(tempoDecorrido * 1000).format('HH:mm:ss')}
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
            <TouchableOpacity
              onPress={zerarCronometro}
              style={[styles.playerButton, styles.stopButton]}
            >
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
          placeholderTextColor="#8B0000"
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={finalizarProjeto} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Finalizar Projeto</Text>
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
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
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tit: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#8B0000',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(139, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    marginBottom: 25,
    borderWidth: 3,
    borderColor: '#8B0000',
  },
  imagePlaceholder: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#8B0000',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 12,
    color: '#8B0000',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  careerContainer: {
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  careerBox: {
    marginTop: 12,
    backgroundColor: '#8B0000',
    width: 90,
    height: 90,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  careerNumber: {
    fontSize: 40,
    color: '#fff',
    fontWeight: '900',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8B0000',
    letterSpacing: 0.5,
  },
  timeBox: {
    marginTop: 12,
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  time: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8B0000',
    fontVariant: ['tabular-nums'],
  },
  playerButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  playerButton: {
    backgroundColor: '#8B0000',
    width: 60,
    height: 60,
    borderRadius: 16,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  stopButton: {
    backgroundColor: '#B22222',
  },
  notesContainer: {
    marginBottom: 30,
  },
  notesInput: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    minHeight: 140,
    fontSize: 16,
    color: '#8B0000',
    fontWeight: '600',
    borderWidth: 2,
    borderColor: '#8B0000',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#8B0000',
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginRight: 12,
    letterSpacing: 0.5,
  },
});