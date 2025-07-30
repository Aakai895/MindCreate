//O que atualizar aqui depois: conectar com os projetos quando a tela deles tiverem prontas, arrumar o css dos botões e do fundo do card colocar tipo de projeto
//só funciona em ios ou android



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
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
export default function Projetoscreen({ navigation }) {
  //declaracoes
  const [image, setImage] = useState(null);
  const [nomeP, setNomeP] = useState('');
  const [projetos, setProjetos] = useState([]);
  const [dataEntrega, setDataEntrega] = useState('');
  const [tipoProjeto, setTipoProjeto] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date()); 
  const [dataFormatada, setDataFormatada] = useState('');
  const [mostrardataPicker, setmostrardataPicker] = useState(false);

  //função dew seleção de data

  const onChangeDate = (event, selectedDate) => {
  setmostrardataPicker(Platform.OS === 'ios');
  if (selectedDate) {
    setDataSelecionada(selectedDate);

    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();

    const dataFormatadaFinal = `${day}/${month}/${year}`;
    setDataFormatada(dataFormatadaFinal);
    setDataEntrega(dataFormatadaFinal); 
  }
};



 //funcao pra escolher imagem
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
// fim da funçõa
// funcao add projeto e exclui
  const addProjeto = () => {
    if (nomeP.trim() && dataEntrega.trim() && tipoProjeto.trim()) {
      const novoProjeto = {
        id: Date.now().toString(),
        nomeP,
        dataEntrega,
        tipoProjeto,
        imagem: image || 'https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png',
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

  return (
    <SafeAreaView style={styles.main}>
      <FlatList
        data={projetos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image 
              source={{ uri: item.imagem }} 
              style={styles.listImage} 
              defaultSource={require('../assets/no-image.jpg')}
            />
            <Text>Nome: {item.nomeP}</Text>
            <Text>Entrega: {item.dataEntrega}</Text>
            <Text>Tipo: {item.tipoProjeto}</Text>
            <TouchableOpacity onPress={() => excluirProj(item.id)}>
              <Text style={styles.excluirTexto}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.bntAdd}
        onPress={() => setModalVisivel(true)}>
        <Text style={styles.btnaddText}>Adicionar Projeto</Text>
      </TouchableOpacity>

      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Novo Projeto</Text>
          
          <TouchableOpacity onPress={pickImage}>
            <Image 
              style={styles.image} 
              source={
                image ? { uri: image } : require('../assets/no-image.jpg')
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
    onPress={() => setmostrardataPicker(true)}>
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
              onPress={() => setModalVisivel(false)}>
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
    flexWrap: 'wrap',
    backgroundColor: '#fff5e6',
  },
  modalContent: {
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderRadius: 10,
  },
  bntAdd: {
    backgroundColor: '#8B0000',
    margin: 5 ,
    padding: 20 ,
    alignItems: 'center',
    
    borderRadius: 6,
  },
  bntAddmodal: {
    backgroundColor: '#8B0000',
    margin: 10,
    padding: 15,
    alignItems: 'center',
    borderRadius: 6,
  },
  input: {
    backgroundColor: 'white',
    padding: 5,
    margin: 10,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  btnModal: {
    flexDirection: 'row',
  },
  image: {
    height: 150,
    width: 150,
    alignSelf: 'center',
    margin: 10,
  },
  btnaddText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  listImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  excluirTexto: {
    color: 'red',
    textAlign: 'right',
    marginTop: 5,
  }
});