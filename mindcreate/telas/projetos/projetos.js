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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addProjeto } from '../../firebase/firestore';
// Supondo que você tenha um contexto para usuário, importe aqui
import { useApp } from '../../context/authcontext'; 

export default function Projetoscreen({ navigation }) {
  const { usuario } = useApp(); // pegar usuário autenticado

  const [image, setImage] = useState(null);
  const [nomeP, setNomeP] = useState('');
  const [projetos, setProjetos] = useState([]);
  const [tipoProjeto, setTipoProjeto] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [dataFormatada, setDataFormatada] = useState('');
  const [mostrardataPicker, setmostrardataPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const NUM_DIAS = 30;

  const getDiasFuturos = () => {
    const hoje = new Date();
    return Array.from({ length: NUM_DIAS }, (_, i) => {
      const dia = new Date(hoje);
      dia.setDate(hoje.getDate() + i);
      return dia;
    });
  };

  const diasFuturos = getDiasFuturos();

  const onChangeDate = (_, selected) => {
    setmostrardataPicker(false);
    if (selected) {
      setDataSelecionada(selected);
      const day = selected.getDate().toString().padStart(2, '0');
      const month = (selected.getMonth() + 1).toString().padStart(2, '0');
      const year = selected.getFullYear();
      const dataFormatadaFinal = `${day}/${month}/${year}`;
      setDataFormatada(dataFormatadaFinal);
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
      alert('Usuário não autenticado!');
      return;
    }

    if (nomeP.trim() && dataFormatada && tipoProjeto.trim()) {
      try {
        const novoProjeto = {
          uid: usuario.uid,
          nomeP,
          dataEntrega: dataFormatada,
          tipoProjeto,
          image:
            image ||
            'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png',
        };

        // Salva no Firestore
        await addProjeto(novoProjeto);

        // Atualiza localmente a lista de projetos
        setProjetos((prev) => [...prev, { ...novoProjeto, id: Date.now().toString() }]);

        // Limpa campos e fecha modal
        setNomeP('');
        setDataFormatada('');
        setTipoProjeto('');
        setImage(null);
        setModalVisivel(false);

        console.log('Projeto salvo no Firestore!');
      } catch (error) {
        console.error('Erro ao salvar projeto:', error);
        alert('Erro ao salvar projeto, tente novamente.');
      }
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  };

  const excluirProj = (id) => {
    setProjetos((prev) => prev.filter((p) => p.id !== id));
  };

  const renderProjeto = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Projeto')}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.listImage}
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
            let backgroundColor = '#eee';
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
          <Text style={styles.addProjeto}>+</Text>
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
          <Text style={styles.emptyText}>
            {selectedDate
              ? 'Nenhum projeto para esta data.'
              : 'Nenhum projeto criado ainda.'}
          </Text>
        }
      />

      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
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
              <TouchableOpacity style={styles.bntAddmodal} onPress={criarProjeto}>
                <Text style={styles.btnaddText}>CRIAR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.bntAddmodal, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={[styles.btnaddText, { color: '#333' }]}>CANCELAR</Text>
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
    padding: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    marginBottom: 
 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  btnModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  bntAddmodal: {
    backgroundColor: '#8B0000',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  btnaddText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    height: 200,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 15,
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
