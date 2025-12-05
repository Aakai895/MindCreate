import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  SafeAreaView, Image, Platform, Alert, Modal, ScrollView 
} from 'react-native';
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

  const [image, setImage] = useState('');
  const [nomeP, setNomeP] = useState('');
  const [notes, setNotes] = useState('');
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [iniciado, setIniciado] = useState(false);
  const [carreiraNum, setCarreira] = useState(1);
  
  // Estado para o modal de precificação SIMPLIFICADO
  const [modalPrecificacaoVisivel, setModalPrecificacaoVisivel] = useState(false);
  const [valorLinha, setValorLinha] = useState(''); // Quanto gastou com linha
  const [valorOutrosMateriais, setValorOutrosMateriais] = useState(''); // Outros materiais
  const [valorHora, setValorHora] = useState('30'); // Valor da hora de trabalho
  const [precoCalculado, setPrecoCalculado] = useState(0);
  const [custoTotalMaterial, setCustoTotalMaterial] = useState(0);

  // Função para atualizar projeto
  const atualizarProjeto = useCallback(async (dados) => {
    try {
      const projetoRef = doc(db, 'projetos', projetoId);
      await updateDoc(projetoRef, dados);
    } catch (error) {
      console.error('❌ Erro ao atualizar projeto:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o projeto');
    }
  }, [projetoId]);

  // Escuta em tempo real as mudanças no projeto
  useEffect(() => {
    if (!projetoId) {
      Alert.alert('Erro', 'ID do projeto não encontrado');
      return;
    }

    const projetoRef = doc(db, 'projetos', projetoId);
    const unsubscribe = onSnapshot(
      projetoRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setImage(data.image || '');
          setNomeP(data.nomeP || '');
          setNotes(data.anotacoes || '');
          setTempoDecorrido(data.tempo || 0);
          setCarreira(data.carreiras || 1);
          setIniciado(data.iniciado || false);
        } else {
          Alert.alert('Erro', 'Projeto não encontrado');
        }
      },
      (error) => {
        console.error('❌ Erro no onSnapshot:', error);
        Alert.alert('Erro', 'Falha ao carregar projeto');
      }
    );

    return () => unsubscribe();
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

  // Funções do cronômetro
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

  // Atualiza anotações
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

  // FUNÇÕES DE PRECIFICAÇÃO SIMPLIFICADA
  const calcularPreco = () => {
    // Converte valores para números
    const linha = parseFloat(valorLinha) || 0;
    const outros = parseFloat(valorOutrosMateriais) || 0;
    const hora = parseFloat(valorHora) || 30;
    
    // Calcula custo total do material
    const materialTotal = linha + outros;
    setCustoTotalMaterial(materialTotal);
    
    // Calcula horas trabalhadas (segundos para horas)
    const horasTrabalhadas = tempoDecorrido / 3600;
    
    // Calcula mão de obra
    const maoDeObra = horasTrabalhadas * hora;
    
    // Calcula preço total (custo do material + mão de obra)
    const total = materialTotal + maoDeObra;
    
    // Arredonda para 2 casas decimais
    setPrecoCalculado(Math.round(total * 100) / 100);
  };

  // Recalcula sempre que algum valor muda
  useEffect(() => {
    if (modalPrecificacaoVisivel) {
      calcularPreco();
    }
  }, [valorLinha, valorOutrosMateriais, valorHora, tempoDecorrido, modalPrecificacaoVisivel]);

  const abrirModalPrecificacao = () => {
    // Abre o modal
    setModalPrecificacaoVisivel(true);
  };

  const formatarTempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    return `${horas}h ${minutos}min`;
  };

  const formatarDinheiro = (valor) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
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
          <Text style={styles.sectionTitle}>TEMPO</Text>
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

      {/* Botão de Precificação */}
      <TouchableOpacity 
        style={[styles.button, styles.priceButton]} 
        onPress={abrirModalPrecificacao}
        activeOpacity={0.8}
      >
        <Ionicons name="calculator-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>CALCULAR PREÇO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.finishButton]} onPress={finalizarProjeto} activeOpacity={0.8}>
        <Text style={styles.buttonText}>FINALIZAR PROJETO</Text>
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
      </TouchableOpacity>

      {/* MODAL DE PRECIFICAÇÃO SIMPLIFICADO */}
      <Modal
        visible={modalPrecificacaoVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalPrecificacaoVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Calculadora de Preço</Text>
              <TouchableOpacity onPress={() => setModalPrecificacaoVisivel(false)}>
                <Ionicons name="close" size={28} color="#8B0000" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Tempo Trabalhado */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tempo gasto no projeto</Text>
                <View style={styles.timeDisplay}>
                  <Text style={styles.timeValue}>
                    {formatarTempo(tempoDecorrido)}
                  </Text>
                  <Text style={styles.timeSubtitle}>
                    (cronômetro automático)
                  </Text>
                </View>
              </View>

              {/* Custo do Material */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Custo do material usado</Text>
                
                <View style={styles.inputWithIcon}>
                  <Ionicons name="pricetag-outline" size={20} color="#666666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.currencyInput}
                    placeholder="Quanto gastou com linha/fio"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={valorLinha}
                    onChangeText={setValorLinha}
                  />
                  <Text style={styles.currencySymbol}>R$</Text>
                </View>
                
                <View style={styles.inputWithIcon}>
                  <Ionicons name="cube-outline" size={20} color="#666666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.currencyInput}
                    placeholder="Outros materiais (agulha, enchimento, etc.)"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={valorOutrosMateriais}
                    onChangeText={setValorOutrosMateriais}
                  />
                  <Text style={styles.currencySymbol}>R$</Text>
                </View>
              </View>

              {/* Valor por Hora */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Valor da sua hora de trabalho</Text>
                <View style={styles.inputWithIcon}>
                  <Ionicons name="time-outline" size={20} color="#666666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.currencyInput}
                    placeholder="Quanto vale sua hora"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={valorHora}
                    onChangeText={setValorHora}
                  />
                  <Text style={styles.currencySymbol}>R$/h</Text>
                </View>
              </View>

              {/* RESULTADO */}
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>ORÇAMENTO DO PROJETO</Text>
                
                <View style={styles.totalPriceContainer}>
                  <Text style={styles.totalPriceLabel}>PREÇO FINAL</Text>
                  <Text style={styles.totalPrice}>
                    {formatarDinheiro(precoCalculado)}
                  </Text>
                </View>
                
                <View style={styles.breakdownContainer}>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Material:</Text>
                    <Text style={styles.breakdownValue}>
                      {formatarDinheiro(custoTotalMaterial)}
                    </Text>
                  </View>
                  
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Mão de obra:</Text>
                    <Text style={styles.breakdownValue}>
                      {formatarDinheiro((tempoDecorrido / 3600) * (parseFloat(valorHora) || 30))}
                    </Text>
                  </View>
                  
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Tempo:</Text>
                    <Text style={styles.breakdownValue}>
                      {formatarTempo(tempoDecorrido)}
                    </Text>
                  </View>
                  
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Valor/hora:</Text>
                    <Text style={styles.breakdownValue}>
                      R$ {(parseFloat(valorHora) || 30).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Botões */}
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={() => {
                    Alert.alert(
                      'Orçamento Gerado',
                      `Preço do projeto: ${formatarDinheiro(precoCalculado)}\n\n` +
                      `Material: ${formatarDinheiro(custoTotalMaterial)}\n` +
                      `Mão de obra: ${formatarDinheiro((tempoDecorrido / 3600) * (parseFloat(valorHora) || 30))}\n` +
                      `Tempo total: ${formatarTempo(tempoDecorrido)}`,
                      [
                        { text: 'OK', onPress: () => setModalPrecificacaoVisivel(false) }
                      ]
                    );
                  }}
                >
                  <Text style={styles.saveButtonText}>SALVAR ORÇAMENTO</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalPrecificacaoVisivel(false)}
                >
                  <Text style={styles.cancelButtonText}>CANCELAR</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  header: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  tit: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  placeholderText: {
    marginTop: 10,
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  careerContainer: {
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  careerBox: {
    marginTop: 8,
    backgroundColor: '#8B0000',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  careerNumber: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '800',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  timeBox: {
    marginTop: 8,
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  time: {
    fontSize: 20,
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
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#B22222',
  },
  notesContainer: {
    marginBottom: 24,
  },
  notesInput: {
    marginTop: 8,
    backgroundColor: '#fff',
    padding: 12,
    minHeight: 120,
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlignVertical: 'top',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#8B0000',
    paddingVertical: 16,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 8,
  },
  priceButton: {
    backgroundColor: '#2E8B57',
    marginBottom: 10,
  },
  finishButton: {
    backgroundColor: '#8B0000',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  // Estilos do Modal de Precificação SIMPLIFICADO
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  timeDisplay: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B0000',
  },
  timeSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  currencyInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  currencySymbol: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B0000',
    marginBottom: 16,
    textAlign: 'center',
  },
  totalPriceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  totalPriceLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2E8B57',
  },
  breakdownContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666666',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  modalButtons: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#8B0000',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButtonText: {
    color: '#8B0000',
    fontSize: 16,
    fontWeight: '700',
  },
});