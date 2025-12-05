// ProjetoD.js (versão simplificada sem Picker)
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image, Platform, Alert, ScrollView } from 'react-native';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; 
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Icon from 'react-native-vector-icons/MaterialIcons';

dayjs.extend(utc);

export default function ProjetoD({ route, navigation }) {
  const { projeto } = route.params;
  
  console.log('🎨 Tela de DESENHO - Projeto recebido:', projeto);

  const [image, setImage] = useState(projeto.image || '');
  const [nomeP, setNomeP] = useState(projeto.nomeP || '');
  const [notes, setNotes] = useState(projeto.anotacoes || '');
  const [tempoDecorrido, setTempoDecorrido] = useState(projeto.tempo || 0);
  const [iniciado, setIniciado] = useState(projeto.iniciado || false);
  const [etapaAtual, setEtapaAtual] = useState(projeto.etapaAtual || 1);
  const [tecnica, setTecnica] = useState(projeto.tecnica || 'Lápis');
  const [suporte, setSuporte] = useState(projeto.suporte || 'Papel A4');
  
  // Lista de técnicas de desenho
  const tecnicas = [
    'Lápis',
    'Nanquim',
    'Aquarela',
    'Acrílica',
    'Óleo',
    'Giz pastel',
    'Grafite',
    'Digital',
    'Carvão',
    'Mixed Media'
  ];
  
  // Lista de suportes/materiais
  const suportes = [
    'Papel A4',
    'Papel A3',
    'Papel Canson',
    'Tela 30x40',
    'Tela 40x50',
    'Tela 50x70',
    'Madeira',
    'MDF',
    'Papelão',
    'Digital Tablet'
  ];
  
  // Etapas de um desenho
  const etapasDesenho = [
    'Esboço',
    'Estrutura',
    'Definição de formas',
    'Valor tonal',
    'Detalhamento',
    'Finalização',
    'Revisão'
  ];

  // Função para atualizar projeto
  const atualizarProjeto = useCallback(async (dados) => {
    try {
      console.log('🔄 Atualizando projeto de desenho:', projeto.projetoId, 'com dados:', dados);
      const projetoRef = doc(db, 'projetos', projeto.projetoId);
      await updateDoc(projetoRef, dados);
      console.log('✅ Projeto atualizado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao atualizar projeto:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o projeto');
    }
  }, [projeto.projetoId]);

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

  const avancarEtapa = async () => {
    if (etapaAtual < etapasDesenho.length) {
      const novaEtapa = etapaAtual + 1;
      setEtapaAtual(novaEtapa);
      await atualizarProjeto({ etapaAtual: novaEtapa });
      Alert.alert('Etapa Concluída', `Etapa "${etapasDesenho[etapaAtual - 1]}" concluída!`);
    } else {
      Alert.alert('Última Etapa', 'Todas as etapas foram concluídas!');
    }
  };

  const voltarEtapa = async () => {
    if (etapaAtual > 1) {
      const novaEtapa = etapaAtual - 1;
      setEtapaAtual(novaEtapa);
      await atualizarProjeto({ etapaAtual: novaEtapa });
    }
  };

  // Atualiza anotações com debounce
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
      'Deseja marcar este projeto como finalizado?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Finalizar',
          onPress: () => {
            setIniciado(false);
            atualizarProjeto({ status: 'finalizado', iniciado: false });
            Alert.alert('Parabéns!', 'Projeto finalizado com sucesso!');
            setTimeout(() => navigation.goBack(), 1500);
          },
        },
      ]
    );
  };

  const selecionarTecnica = async (novaTecnica) => {
    setTecnica(novaTecnica);
    await atualizarProjeto({ tecnica: novaTecnica });
  };

  const selecionarSuporte = async (novoSuporte) => {
    setSuporte(novoSuporte);
    await atualizarProjeto({ suporte: novoSuporte });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#8B0000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Projeto de Desenho</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.tit}>
          <Text style={styles.title}>{nomeP || 'Projeto de Desenho'}</Text>
          <Text style={styles.subtitle}>Técnica: {tecnica} • Suporte: {suporte}</Text>
        </View>

        <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.imageContainer}>
          {image ? (
            <Image style={styles.image} source={{ uri: image }} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="color-palette" size={50} color="#8B0000" />
              <Text style={styles.placeholderText}>Toque para adicionar imagem</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Seletor de Técnica (simplificado sem Picker) */}
        <View style={styles.configSection}>
          <Text style={styles.sectionTitle}>TÉCNICA</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tecnicasScroll}>
            {tecnicas.map((tec) => (
              <TouchableOpacity
                key={tec}
                style={[styles.tecnicaBtn, tecnica === tec && styles.tecnicaBtnAtivo]}
                onPress={() => selecionarTecnica(tec)}
              >
                <Text style={[styles.tecnicaTexto, tecnica === tec && styles.tecnicaTextoAtivo]}>
                  {tec}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Seletor de Suporte (simplificado sem Picker) */}
        <View style={styles.configSection}>
          <Text style={styles.sectionTitle}>SUPORTE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suportesScroll}>
            {suportes.map((sup) => (
              <TouchableOpacity
                key={sup}
                style={[styles.suporteBtn, suporte === sup && styles.suporteBtnAtivo]}
                onPress={() => selecionarSuporte(sup)}
              >
                <Text style={[styles.suporteTexto, suporte === sup && styles.suporteTextoAtivo]}>
                  {sup}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.etapaContainer}>
            <Text style={styles.sectionTitle}>ETAPA ATUAL</Text>
            <TouchableOpacity
              style={styles.etapaBox}
              onPress={avancarEtapa}
              activeOpacity={0.7}
            >
              <Text style={styles.etapaNumber}>{etapaAtual}</Text>
              <Text style={styles.etapaText}>de {etapasDesenho.length}</Text>
            </TouchableOpacity>
            <Text style={styles.etapaNome}>{etapasDesenho[etapaAtual - 1]}</Text>
            
            <View style={styles.etapaButtons}>
              <TouchableOpacity 
                style={[styles.etapaButton, etapaAtual === 1 && styles.disabledButton]} 
                onPress={voltarEtapa}
                disabled={etapaAtual === 1}
              >
                <Ionicons name="chevron-back" size={20} color="#fff" />
                <Text style={styles.etapaButtonText}>Voltar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.etapaButton, etapaAtual === etapasDesenho.length && styles.disabledButton]} 
                onPress={avancarEtapa}
                disabled={etapaAtual === etapasDesenho.length}
              >
                <Text style={styles.etapaButtonText}>Avançar</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.sectionTitle}>TEMPO DE TRABALHO</Text>
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

        <View style={styles.etapasContainer}>
          <Text style={styles.sectionTitle}>ETAPAS DO DESENHO</Text>
          <View style={styles.etapasList}>
            {etapasDesenho.map((etapa, index) => (
              <View 
                key={index} 
                style={[
                  styles.etapaItem,
                  index + 1 === etapaAtual && styles.etapaAtualItem,
                  index + 1 < etapaAtual && styles.etapaConcluidaItem
                ]}
              >
                <View style={styles.etapaCircle}>
                  <Text style={[
                    styles.etapaCircleText,
                    index + 1 === etapaAtual && styles.etapaCircleTextAtual,
                    index + 1 < etapaAtual && styles.etapaCircleTextConcluida
                  ]}>
                    {index + 1}
                  </Text>
                  {index + 1 < etapaAtual && (
                    <Ionicons name="checkmark" size={14} color="#fff" style={styles.checkIcon} />
                  )}
                </View>
                <Text style={[
                  styles.etapaItemText,
                  index + 1 === etapaAtual && styles.etapaItemTextAtual,
                  index + 1 < etapaAtual && styles.etapaItemTextConcluida
                ]}>
                  {etapa}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>ANOTAÇÕES E REFERÊNCIAS</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Anote referências, cores, observações técnicas..."
            placeholderTextColor="#8B0000"
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.finalizarButton} onPress={finalizarProjeto} activeOpacity={0.8}>
          <Ionicons name="checkmark-done" size={24} color="#fff" />
          <Text style={styles.finalizarButtonText}>Finalizar Projeto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B0000',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  tit: {
    marginTop: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    fontWeight: '500',
  },
  imageContainer: {
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 220,
  },
  imagePlaceholder: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f5ff',
    borderWidth: 2,
    borderColor: '#d0d8f0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 12,
    color: '#8B0000',
    fontSize: 16,
    fontWeight: '600',
  },
  configSection: {
    marginBottom: 20,
  },
  tecnicasScroll: {
    marginTop: 8,
  },
  suportesScroll: {
    marginTop: 8,
  },
  tecnicaBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
  },
  tecnicaBtnAtivo: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  tecnicaTexto: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666666',
  },
  tecnicaTextoAtivo: {
    color: '#fff',
    fontWeight: '600',
  },
  suporteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
  },
  suporteBtnAtivo: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  suporteTexto: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  suporteTextoAtivo: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  etapaContainer: {
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  etapaBox: {
    marginTop: 8,
    backgroundColor: '#8B0000',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  etapaNumber: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '800',
  },
  etapaText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    marginTop: -4,
  },
  etapaNome: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
  },
  etapaButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  etapaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  etapaButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  timeBox: {
    marginTop: 8,
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  time: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    fontVariant: ['tabular-nums'],
  },
  playerButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  playerButton: {
    backgroundColor: '#8B0000',
    width: 50,
    height: 50,
    marginHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: '#B22222',
  },
  etapasContainer: {
    marginBottom: 24,
  },
  etapasList: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  etapaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  etapaAtualItem: {
    backgroundColor: '#fff0f0',
    borderLeftWidth: 4,
    borderLeftColor: '#8B0000',
  },
  etapaConcluidaItem: {
    opacity: 0.8,
  },
  etapaCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  etapaCircleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666666',
  },
  etapaCircleTextAtual: {
    color: '#8B0000',
  },
  etapaCircleTextConcluida: {
    color: '#fff',
  },
  etapaItemText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    flex: 1,
  },
  etapaItemTextAtual: {
    color: '#333333',
    fontWeight: '700',
  },
  etapaItemTextConcluida: {
    color: '#333333',
    textDecorationLine: 'line-through',
  },
  checkIcon: {
    position: 'absolute',
  },
  notesContainer: {
    marginBottom: 24,
  },
  notesInput: {
    marginTop: 8,
    backgroundColor: '#fff',
    padding: 16,
    minHeight: 140,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlignVertical: 'top',
    borderRadius: 8,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  finalizarButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  finalizarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});