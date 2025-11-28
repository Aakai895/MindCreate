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
import { useApp } from '../../context/authcontext';
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
  const projetoId = gerarId();

  // Função para buscar os projetos do usuário no Firestore
  const fetchProjetos = async () => {
    if (!usuario?.uid) return;

    try {
      console.log('🔍 Buscando projetos para usuário:', usuario.uid);
      const projetosData = await getProjetosByUsuario(usuario.uid);
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
          tipoProjeto,
          image: image || 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png',
        };

        console.log('➕ Criando novo projeto:', novoProjeto);
        await addProjeto(novoProjeto);
        await fetchProjetos();

        setNomeP('');
        setDataFormatada('');
        setTipoProjeto('');
        setImage(null);
        setModalVisivel(false);
        Alert.alert('Sucesso', 'Projeto criado com sucesso!');
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

  const nivelUrgenciaDia = (dia) => {
    const hoje = new Date();
    const diffDays = Math.ceil((dia - hoje) / (1000 * 60 * 60 * 24));
    const dataIsoDia = dia.toISOString().split('T')[0];

    const projetosNoDia = projetos.filter((p) => {
      const [d, m, y] = p.dataEntrega.split('/');
      const dataIso = `${y}-${m}-${d}`;
      return dataIso === dataIsoDia;
    });

    if (projetosNoDia.length === 0) return 0;
    if (diffDays <= 2 && diffDays >= 0) return 2;
    if (diffDays <= 5 && diffDays >= 0) return 1;
    return 0;
  };

  const projetosFiltrados = selectedDate
    ? projetos.filter((p) => {
        const [d, m, y] = p.dataEntrega.split('/');
        const dataIso = `${y}-${m}-${d}`;
        return dataIso === selectedDate;
      })
    : projetos;

  const renderProjeto = ({ item }) => {
    console.log('🔍 Renderizando projeto:', item.id, item.nomeP);
    
    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => {
            console.log('🚀 Navegando para projeto ID:', item.id);
            navigation.navigate('Projeto', { projetoId: item.id });
          }}
          activeOpacity={0.7}
        >
          <Image source={{ uri: item.image }} style={styles.listImage} />
          <Text style={styles.nomeProjeto} numberOfLines={1}>
            {item.nomeP}
          </Text>
          <Text style={styles.tipoProjeto}>{item.tipoProjeto}</Text>
          <Text style={styles.dataEntrega}>Entrega: {item.dataEntrega}</Text>
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
            if (nivelUrgencia === 2) backgroundColor = '#ff6b6b';
            else if (nivelUrgencia === 1) backgroundColor = '#ffa500';

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
              <TextInput
                placeholder="Tipo do projeto (crochê ou desenho)"
                placeholderTextColor="#8B0000"
                value={tipoProjeto}
                onChangeText={setTipoProjeto}
                style={styles.input}
              />
            </View>

            <View style={styles.btnModal}>
              <TouchableOpacity style={styles.bntAddmodal} onPress={criarProjeto}>
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
    backgroundColor: '#fff5e6',
  },
  semanaContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#8B0000',
  },
  diaSemana: {
    width: 70,
    height: 60,
    marginRight: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  diaSelecionado: {
    backgroundColor: '#8B0000',
  },
  textoDia: {
    color: '#8B0000',
    fontWeight: '800',
    fontSize: 14,
  },
  textoSelecionado: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  header: {
    padding: 20,
    alignItems: 'flex-end',
  },
  bntAdd: {
    backgroundColor: '#8B0000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 180,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#8B0000',
  },
  listImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  nomeProjeto: {
    fontWeight: '800',
    fontSize: 16,
    color: '#8B0000',
    marginBottom: 4,
  },
  tipoProjeto: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#8B0000',
    marginBottom: 4,
    fontWeight: '600',
  },
  dataEntrega: {
    fontSize: 12,
    color: '#8B0000',
    fontWeight: '600',
  },
  btnExcluir: {
    marginTop: 12,
    backgroundColor: '#8B0000',
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  excluirTexto: {
    color: '#fff',
    fontWeight: '800',
    marginLeft: 6,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontWeight: '800',
    fontSize: 24,
    marginBottom: 20,
    color: '#8B0000',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 0, 0, 0.7)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlayText: {
    color: '#fff',
    marginTop: 8,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#8B0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#8B0000',
    fontWeight: '600',
  },
  dateText: {
    color: '#8B0000',
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 16,
  },
  btnModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  bntAddmodal: {
    flex: 1,
    backgroundColor: '#8B0000',
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8B0000',
  },
  btnaddText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginRight: 8,
    letterSpacing: 0.5,
  },
  cancelText: {
    color: '#8B0000',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 18,
    color: '#8B0000',
    fontWeight: '600',
  },
});