import React, { useEffect, useState } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addProjeto, getProjetosByUsuario, excluirProjeto } from '../../firebase/firestore';
import { useApp } from '../../context/AuthContext';
import { gerarId } from '../../funções/gerarId';
import { Ionicons } from '@expo/vector-icons';

export default function Projetoscreen({ navigation }) {
  const { usuario } = useApp();

  const [image, setImage] = useState(null);
  const [nomeP, setNomeP] = useState('');
  const [projetos, setProjetos] = useState([]);
  const [tipoProjeto, setTipoProjeto] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [dataFormatada, setDataFormatada] = useState('');
  const [mostrardataPicker, setmostrardataPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selecionandoTipo, setSelecionandoTipo] = useState(false);
  const [filtroUrgencia, setFiltroUrgencia] = useState('todos');
  const projetoId = gerarId();

  // Função para buscar os projetos do usuário no Firestore
  const fetchProjetos = async () => {
    if (!usuario?.uid) return;

    try {
      console.log('🔍 Buscando projetos para usuário:', usuario.uid);
      const projetosData = await getProjetosByUsuario(usuario.uid);
      
      // DEBUG: Mostra todos os projetos e seus tipos
      projetosData.forEach((p, i) => {
        console.log(`📦 Projeto ${i}: ${p.nomeP} | Tipo: ${p.tipoProjeto || 'SEM TIPO'} | ID: ${p.id}`);
      });
      
      console.log('📋 Projetos encontrados:', projetosData.length);
      setProjetos(projetosData);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os projetos');
    }
  };

  useEffect(() => {
    fetchProjetos();
  }, [usuario]);

  const getDiasFuturos = () => {
    const NUM_DIAS = 30;
    const hoje = new Date();
    return Array.from({ length: NUM_DIAS }, (_, i) => {
      const dia = new Date(hoje);
      dia.setDate(hoje.getDate() + i);
      return dia;
    });
  };

  const diasFuturos = getDiasFuturos();

  const onChangeDate = (event, selected) => {
    setmostrardataPicker(false);
    if (selected) {
      setDataSelecionada(selected);
      const day = selected.getDate().toString().padStart(2, '0');
      const month = (selected.getMonth() + 1).toString().padStart(2, '0');
      const year = selected.getFullYear();
      setDataFormatada(`${day}/${month}/${year}`);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImage(base64Image);
    }
  };

  const criarProjeto = async () => {
    if (!usuario?.uid) {
      Alert.alert('Erro', 'Usuário não autenticado!');
      return;
    }

    if (nomeP.trim() && dataFormatada && tipoProjeto.trim()) {
      try {
        const novoProjeto = {
          uid: usuario.uid,
          nomeP,
          projetoId,
          dataEntrega: dataFormatada,
          tipoProjeto: tipoProjeto,
          image: image || 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png',
        };

        console.log('➕ Criando novo projeto:', novoProjeto);
        console.log('📝 Tipo de projeto sendo enviado:', tipoProjeto);
        
        await addProjeto(novoProjeto);
        await fetchProjetos();

        // Fechar modal primeiro
        setNomeP('');
        setDataFormatada('');
        setTipoProjeto('');
        setImage(null);
        setModalVisivel(false);
        
        // Navegar para a tela correta baseada no tipo de projeto
        const tipo = tipoProjeto.toLowerCase();
        console.log('📍 Tipo processado para navegação:', tipo);
        
        if (tipo.includes('crochê') || tipo.includes('croche')) {
          navigation.navigate('Projeto', { projeto: novoProjeto });
        } else if (tipo.includes('desenho')) {
          navigation.navigate('ProjetoD', { projeto: novoProjeto });
        } else {
          // Caso padrão se não for nenhum dos dois
          Alert.alert('Sucesso', 'Projeto criado com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao salvar projeto:', error);
        Alert.alert('Erro', 'Erro ao salvar projeto, tente novamente.');
      }
    } else {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos!');
    }
  };

  const excluirProj = (id) => {
    Alert.alert(
      'Excluir Projeto',
      'Tem certeza que deseja excluir este projeto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirProjeto(id);
              setProjetos((prev) => prev.filter((p) => p.id !== id));
              Alert.alert('Sucesso', 'Projeto excluído com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir projeto:', error);
              Alert.alert('Erro', 'Erro ao excluir projeto. Tente novamente.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const abrirProjeto = (item) => {
    console.log('🚀 Abrindo projeto COMPLETO:', item);
    console.log('📌 Tipo de projeto:', item.tipoProjeto);
    console.log('📌 ID do projeto:', item.id);
    
    // Garantir que tipoProjeto existe
    const tipo = item.tipoProjeto ? item.tipoProjeto.toLowerCase() : '';
    console.log('📍 Tipo processado:', tipo);
    
    if (tipo.includes('crochê') || tipo.includes('croche')) {
      console.log('➡️ Indo para tela de Crochê (Projeto)');
      navigation.navigate('Projeto', { projeto: item });
    } else if (tipo.includes('desenho')) {
      console.log('➡️ Indo para tela de Desenho (ProjetoD)');
      navigation.navigate('ProjetoD', { projeto: item });
    } else {
      console.log('⚠️ Tipo desconhecido:', tipo);
      Alert.alert('Atenção', `Tipo de projeto não reconhecido: ${item.tipoProjeto || 'Não definido'}`);
    }
  };

  // Função para calcular nível de urgência de um projeto individual
  const calcularUrgenciaProjeto = (dataEntrega) => {
    if (!dataEntrega) return 0;
    
    const hoje = new Date();
    const [day, month, year] = dataEntrega.split('/').map(Number);
    const dataProjeto = new Date(year, month - 1, day);
    
    const diffTime = dataProjeto - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2 && diffDays >= 0) return 3; // Urgente (vermelho)
    if (diffDays <= 5 && diffDays >= 0) return 2; // Médio (laranja)
    if (diffDays <= 10 && diffDays >= 0) return 1; // Normal (amarelo)
    return 0; // Sem urgência (verde)
  };

  // Função para calcular nível de urgência de um dia (para os botões de datas)
  const nivelUrgenciaDia = (dia) => {
    const hoje = new Date();
    const diffDays = Math.ceil((dia - hoje) / (1000 * 60 * 60 * 24));
    const dataIsoDia = dia.toISOString().split('T')[0];

    const projetosNoDia = projetos.filter((p) => {
      if (!p.dataEntrega) return false;
      const [d, m, y] = p.dataEntrega.split('/');
      const dataIso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      return dataIso === dataIsoDia;
    });

    if (projetosNoDia.length === 0) return 0;
    
    // Verifica se há algum projeto urgente no dia
    const temUrgente = projetosNoDia.some(projeto => {
      const urgencia = calcularUrgenciaProjeto(projeto.dataEntrega);
      return urgencia === 3;
    });
    
    const temMedio = projetosNoDia.some(projeto => {
      const urgencia = calcularUrgenciaProjeto(projeto.dataEntrega);
      return urgencia === 2;
    });
    
    if (temUrgente) return 3;
    if (temMedio) return 2;
    if (diffDays <= 10 && diffDays >= 0) return 1;
    return 0;
  };

  // Filtrar projetos por data selecionada e nível de urgência
  const projetosFiltrados = projetos.filter((p) => {
    // Filtro por data
    const filterByDate = !selectedDate || (() => {
      if (!p.dataEntrega) return false;
      const [d, m, y] = p.dataEntrega.split('/');
      const dataIso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      return dataIso === selectedDate;
    })();

    // Filtro por nível de urgência
    const filterByUrgencia = filtroUrgencia === 'todos' || (() => {
      const urgencia = calcularUrgenciaProjeto(p.dataEntrega);
      switch(filtroUrgencia) {
        case 'urgente': return urgencia === 3;
        case 'medio': return urgencia === 2;
        case 'normal': return urgencia === 1;
        default: return true;
      }
    })();

    return filterByDate && filterByUrgencia;
  });

  const selecionarTipoProjeto = (tipo) => {
    setTipoProjeto(tipo);
    setSelecionandoTipo(false);
  };

  // Função para obter cor baseada no nível de urgência
  const getCorUrgencia = (nivel) => {
    switch(nivel) {
      case 3: return '#ff4444'; // Vermelho - Urgente
      case 2: return '#ff9800'; // Laranja - Médio
      case 1: return '#ffd600'; // Amarelo - Normal
      default: return '#4caf50'; // Verde - Sem urgência
    }
  };

  const renderProjeto = ({ item }) => {
    const urgencia = calcularUrgenciaProjeto(item.dataEntrega);
    const corBorda = getCorUrgencia(urgencia);
    
    // Verificar tipo de projeto de forma segura
    const tipo = item.tipoProjeto ? item.tipoProjeto.toLowerCase() : '';
    const isCroche = tipo.includes('crochê') || tipo.includes('croche');
    const iconName = isCroche ? 'grid-outline' : 'color-palette-outline';

    return (
      <View style={[styles.card, { borderColor: corBorda, borderWidth: 2 }]}>
        <TouchableOpacity
          onPress={() => {
            console.log('📱 Card clicado:', item.id, item.nomeP);
            abrirProjeto(item);
          }}
          activeOpacity={0.7}
        >
          <Image source={{ uri: item.image }} style={styles.listImage} />
          <Text style={styles.nomeProjeto} numberOfLines={1}>
            {item.nomeP}
          </Text>
          <View style={styles.tipoContainer}>
            <Ionicons 
              name={iconName} 
              size={14} 
              color="#8B0000" 
            />
            <Text style={styles.tipoProjeto}>{item.tipoProjeto || 'Não definido'}</Text>
          </View>
          <Text style={styles.dataEntrega}>Entrega: {item.dataEntrega || 'Não definida'}</Text>
          
          {/* Indicador de urgência */}
          <View style={[styles.indicadorUrgencia, { backgroundColor: corBorda }]}>
            <Text style={styles.indicadorTexto}>
              {urgencia === 3 ? 'URGENTE' : urgencia === 2 ? 'MÉDIO' : urgencia === 1 ? 'NORMAL' : 'LONGO PRAZO'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnExcluir}
          onPress={() => excluirProj(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.excluirTexto}>Excluir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.main}>
      {/* Filtros de urgência */}
      <View style={styles.filtroContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filtroBtn, filtroUrgencia === 'todos' && styles.filtroBtnAtivo]}
            onPress={() => setFiltroUrgencia('todos')}
          >
            <Text style={[styles.filtroTexto, filtroUrgencia === 'todos' && styles.filtroTextoAtivo]}>
              Todos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filtroBtn, filtroUrgencia === 'urgente' && styles.filtroBtnUrgente]}
            onPress={() => setFiltroUrgencia('urgente')}
          >
            <Ionicons name="warning-outline" size={16} color={filtroUrgencia === 'urgente' ? '#fff' : '#ff4444'} />
            <Text style={[styles.filtroTexto, filtroUrgencia === 'urgente' && styles.filtroTextoAtivo]}>
              Urgentes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filtroBtn, filtroUrgencia === 'medio' && styles.filtroBtnMedio]}
            onPress={() => setFiltroUrgencia('medio')}
          >
            <Ionicons name="alert-outline" size={16} color={filtroUrgencia === 'medio' ? '#fff' : '#ff9800'} />
            <Text style={[styles.filtroTexto, filtroUrgencia === 'medio' && styles.filtroTextoAtivo]}>
              Médios
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filtroBtn, filtroUrgencia === 'normal' && styles.filtroBtnNormal]}
            onPress={() => setFiltroUrgencia('normal')}
          >
            <Ionicons name="time-outline" size={16} color={filtroUrgencia === 'normal' ? '#fff' : '#ffd600'} />
            <Text style={[styles.filtroTexto, filtroUrgencia === 'normal' && styles.filtroTextoAtivo]}>
              Normais
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.semanaContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.diaSemana, selectedDate === null && styles.diaSelecionado]}
            onPress={() => setSelectedDate(null)}
          >
            <Text style={selectedDate === null ? styles.textoSelecionado : styles.textoDia}>
              Ver todos
            </Text>
          </TouchableOpacity>

          {diasFuturos.map((dia, index) => {
            const isoDate = dia.toISOString().split('T')[0];
            const label = dia.toLocaleDateString('pt-BR', {
              weekday: 'short',
              day: '2-digit',
            });

            const nivelUrgencia = nivelUrgenciaDia(dia);
            let backgroundColor = '#fff';
            if (nivelUrgencia === 3) backgroundColor = '#ff4444';
            else if (nivelUrgencia === 2) backgroundColor = '#ff9800';
            else if (nivelUrgencia === 1) backgroundColor = '#ffd600';

            const selecionado = selectedDate === isoDate;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.diaSemana, { backgroundColor }, selecionado && styles.diaSelecionado]}
                onPress={() => setSelectedDate(isoDate)}
              >
                <Text style={selecionado ? styles.textoSelecionado : styles.textoDia}>
                  {label}
                </Text>
                {nivelUrgencia > 0 && (
                  <View style={styles.pontoUrgencia} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.header}>
        <TouchableOpacity style={styles.bntAdd} onPress={() => setModalVisivel(true)}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={projetosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProjeto}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color="#8B0000" />
            <Text style={styles.emptyText}>
              {selectedDate
                ? 'Nenhum projeto para esta data.'
                : filtroUrgencia !== 'todos'
                ? `Nenhum projeto ${filtroUrgencia} encontrado.`
                : 'Nenhum projeto criado ainda.'}
            </Text>
          </View>
        }
      />

      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Projeto</Text>

            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={
                  image ? { uri: image } : require('../../assets/no-image.jpg')
                }
              />
              <View style={styles.imageOverlay}>
                <Ionicons name="camera" size={32} color="#fff" />
                <Text style={styles.imageOverlayText}>Adicionar Imagem</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Ionicons name="create-outline" size={20} color="#8B0000" style={styles.inputIcon} />
              <TextInput
                placeholder="Nome do projeto"
                placeholderTextColor="#8B0000"
                value={nomeP}
                onChangeText={setNomeP}
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setmostrardataPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#8B0000" style={styles.inputIcon} />
              <Text style={styles.dateText}>
                {dataFormatada || 'Selecione a data de entrega'}
              </Text>
            </TouchableOpacity>

            {mostrardataPicker && (
              <DateTimePicker
                value={dataSelecionada}
                mode="date"
                display="default"
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="pricetags-outline" size={20} color="#8B0000" style={styles.inputIcon} />
              <TouchableOpacity
                style={styles.tipoSelector}
                onPress={() => setSelecionandoTipo(true)}
              >
                <Text style={tipoProjeto ? styles.tipoSelecionado : styles.tipoPlaceholder}>
                  {tipoProjeto || 'Selecione o tipo de projeto'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#8B0000" />
              </TouchableOpacity>
            </View>

            {/* Modal de seleção de tipo */}
            <Modal
              visible={selecionandoTipo}
              animationType="fade"
              transparent={true}
              onRequestClose={() => setSelecionandoTipo(false)}
            >
              <TouchableOpacity 
                style={styles.tipoModalOverlay}
                activeOpacity={1}
                onPress={() => setSelecionandoTipo(false)}
              >
                <View style={styles.tipoModalContent}>
                  <TouchableOpacity 
                    style={styles.tipoOption}
                    onPress={() => selecionarTipoProjeto('Crochê')}
                  >
                    <Ionicons name="grid-outline" size={24} color="#8B0000" />
                    <Text style={styles.tipoOptionText}>Crochê</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity 
                    style={styles.tipoOption}
                    onPress={() => selecionarTipoProjeto('Desenho')}
                  >
                    <Ionicons name="color-palette-outline" size={24} color="#8B0000" />
                    <Text style={styles.tipoOptionText}>Desenho</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>

            <View style={styles.btnModal}>
              <TouchableOpacity 
                style={[styles.bntAddmodal, (!nomeP || !dataFormatada || !tipoProjeto) && styles.disabledButton]} 
                onPress={criarProjeto}
                disabled={!nomeP || !dataFormatada || !tipoProjeto}
              >
                <Text style={styles.btnaddText}>CRIAR PROJETO</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.bntAddmodal, styles.cancelButton]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={[styles.btnaddText, styles.cancelText]}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  filtroContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  filtroBtnAtivo: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  filtroBtnUrgente: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
  },
  filtroBtnMedio: {
    backgroundColor: '#ff9800',
    borderColor: '#ff9800',
  },
  filtroBtnNormal: {
    backgroundColor: '#ffd600',
    borderColor: '#ffd600',
  },
  filtroTexto: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#666666',
  },
  filtroTextoAtivo: {
    color: '#FFFFFF',
  },
  semanaContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  diaSemana: {
    width: 70,
    height: 60,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    position: 'relative',
  },
  diaSelecionado: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  textoDia: {
    color: '#8B0000',
    fontWeight: '600',
    fontSize: 13,
  },
  textoSelecionado: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  pontoUrgencia: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },
  bntAdd: {
    backgroundColor: '#8B0000',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 0,
  },
  flatListContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: 170,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listImage: {
    width: '100%',
    height: 100,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: '#F8F8F8',
  },
  nomeProjeto: {
    fontWeight: '700',
    fontSize: 15,
    color: '#333333',
    marginBottom: 6,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipoProjeto: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
    fontWeight: '500',
  },
  dataEntrega: {
    fontSize: 11,
    color: '#8B0000',
    fontWeight: '600',
    marginBottom: 8,
  },
  indicadorUrgencia: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  indicadorTexto: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  btnExcluir: {
    marginTop: 10,
    backgroundColor: '#8B0000',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0,
  },
  excluirTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 20,
    color: '#333333',
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F8F8',
  },
  image: {
    width: '100%',
    height: 150,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlayText: {
    color: '#FFFFFF',
    marginTop: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  tipoSelector: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  tipoSelecionado: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '500',
  },
  tipoPlaceholder: {
    color: '#8B0000',
    fontSize: 15,
    opacity: 0.7,
  },
  tipoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  tipoModalContent: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tipoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  tipoOptionText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dateText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 14,
  },
  btnModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  bntAddmodal: {
    flex: 1,
    backgroundColor: '#8B0000',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  btnaddText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginRight: 6,
  },
  cancelText: {
    color: '#8B0000',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
});