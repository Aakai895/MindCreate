import React, { useState } from 'react';
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
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../../context/authcontext'; 


export default function Projetoscreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [nomeP, setNomeP] = useState('');
  const [projetos, setProjetos] = useState([]);
  const [dataEntrega, setDataEntrega] = useState('');
  const [tipoProjeto, setTipoProjeto] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [dataFormatada, setDataFormatada] = useState('');
  const [mostrardataPicker, setmostrardataPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // data selecionada no filtro (yyyy-mm-dd) ou null para todos
  const { usuario } = useApp(); 
  
  const NUM_DIAS = 30;

  const getDiasFuturos = () => {
    const hoje = new Date();
    const dias = [];
    for (let i = 0; i < NUM_DIAS; i++) {
      const dia = new Date(hoje);
      dia.setDate(hoje.getDate() + i);
      dias.push(dia);
    }
    return dias;
  };

  const diasFuturos = getDiasFuturos();

  const onChangeDate = (event, selected) => {
    setmostrardataPicker(Platform.OS === 'ios');
    if (selected) {
      setDataSelecionada(selected);

      const day = selected.getDate().toString().padStart(2, '0');
      const month = (selected.getMonth() + 1).toString().padStart(2, '0');
      const year = selected.getFullYear();

      const dataFormatadaFinal = `${day}/${month}/${year}`;
      setDataFormatada(dataFormatadaFinal);
      setDataEntrega(dataFormatadaFinal);
    }
  };

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

  const addProjeto = () => {
    if (nomeP.trim() && dataEntrega.trim() && tipoProjeto.trim()) {
      const novoProjeto = {
        id: Date.now().toString(),
        nomeP,
        dataEntrega,
        tipoProjeto,
        imagem:
          image ||
          'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png',
      };

      setProjetos([...projetos, novoProjeto]);
      setNomeP('');
      setDataEntrega('');
      setTipoProjeto('');
      setImage(null);
      setModalVisivel(false);
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  };

  const excluirProj = (id) => {
    setProjetos(projetos.filter((p) => p.id !== id));
  };

  const renderProjeto = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Projeto')}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.imagem }}
          style={styles.listImage}
          defaultSource={require('../../assets/no-image.jpg')}
        />
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
        <Text style={styles.excluirTexto}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  // Função para calcular urgência do projeto (retorna 0 sem urgência, 1 médio, 2 urgente)
  const nivelUrgenciaDia = (dia) => {
    // Verifica se existe projeto com entrega nesse dia e calcula o nível de urgência máximo
    const hoje = new Date();
    const diaDate = new Date(dia);
    const diffTime = diaDate - hoje;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Filtra projetos com essa data
    const projetosNoDia = projetos.filter((p) => {
      // converter p.dataEntrega (dd/mm/yyyy) para yyyy-mm-dd
      const partes = p.dataEntrega.split('/');
      const dataIso = `${partes[2]}-${partes[1]}-${partes[0]}`;
      return dataIso === dia.toISOString().split('T')[0];
    });

    if (projetosNoDia.length === 0) return 0;

    if (diffDays <= 2 && diffDays >= 0) return 2; // urgente
    if (diffDays <= 5 && diffDays >= 0) return 1; // médio
    return 0;
  };

  // Filtra projetos para mostrar só os que têm data igual ao dia selecionado no filtro
  const projetosFiltrados = selectedDate
    ? projetos.filter((p) => {
        const partes = p.dataEntrega.split('/');
        const dataIso = `${partes[2]}-${partes[1]}-${partes[0]}`;
        return dataIso === selectedDate;
      })
    : projetos;

  return (
    <SafeAreaView style={styles.main}>
      {/* Barra horizontal de datas */}
      <View style={styles.semanaContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Botão Ver Todos */}
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

            let backgroundColor = '#eee'; // padrão
            if (nivelUrgencia === 2) backgroundColor = '#ff6b6b'; // vermelho urgente
            else if (nivelUrgencia === 1) backgroundColor = '#ffa500'; // laranja alerta

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

      {/* Botão para adicionar projeto */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.bntAdd} onPress={() => setModalVisivel(true)}>
          <Text style={styles.addProjeto}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de projetos filtrada */}
      <FlatList
        data={projetosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProjeto}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {selectedDate
              ? 'Nenhum projeto para esta data.'
              : 'Nenhum projeto criado ainda.'}
          </Text>
        }
      />

      {/* Modal de criação */}
      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Novo Projeto</Text>

          <TouchableOpacity onPress={pickImage}>
            <Image
              style={styles.image}
              source={
                image ? { uri: image } : require('../../assets/no-image.jpg')
              }
            />
          </TouchableOpacity>

          <TextInput
            placeholder="Nome do projeto"
            value={nomeP}
            onChangeText={setNomeP}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.input}
            onPress={() => setmostrardataPicker(true)}
          >
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

          <TextInput
            placeholder="Tipo do projeto (crochê ou desenho)"
            value={tipoProjeto}
            onChangeText={setTipoProjeto}
            style={styles.input}
          />

          <View style={styles.btnModal}>
            <TouchableOpacity style={styles.bntAddmodal} onPress={addProjeto}>
              <Text style={styles.btnaddText}>CRIAR PROJETO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bntAddmodal}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.btnaddText}>CANCELAR</Text>
            </TouchableOpacity>
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  diaSemana: {
    width: 70,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaSelecionado: {
    backgroundColor: '#8B0000',
  },
  textoDia: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textoSelecionado: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  header: {
    padding: 10,
    alignItems: 'flex-end',
  },
  bntAdd: {
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  addProjeto: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 160,
    height: 200,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  listImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  nomeProjeto: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  tipoProjeto: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#C14D34',
    marginTop: 2,
  },
  dataEntrega: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  btnExcluir: {
    marginTop: 10,
    backgroundColor: '#f8d7da',
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  excluirTexto: {
    color: '#721c24',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#A05645',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
  },
  bntAddmodal: {
    backgroundColor: '#964534',
    margin: 10,
    padding: 15,
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  btnModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    height: 200,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  btnaddText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateText: {
    color: '#666',
  },
  emptyText: {
    marginTop: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
});
