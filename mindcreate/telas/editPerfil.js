import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation }) {
  const [profileImage, setProfileImage] = useState(
    'https://st2.depositphotos.com/1177254/8066/i/950/depositphotos_80665370-stock-photo-old-woman-crocheting-at-home.jpg'
  );
  const [name, setName] = useState('Dalva Figueira');
  const [username, setUsername] = useState('@dalva.figueira');
  const [bio, setBio] = useState('Apaixonada por crochê e receitas únicas!');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Aqui salvar no banco ou contexto
    console.log('Perfil salvo:', { name, username, bio });
    navigation.navigate('Perfil');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#a33" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 28 }} /> {/* Placeholder para centralizar */}
      </View>

      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profileImage }} style={styles.avatar} />
        <Text style={styles.editPhotoText}>Editar Foto</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          value={bio}
          onChangeText={setBio}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5e8da',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a33',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  editPhotoText: {
    textAlign: 'center',
    color: '#a33',
    marginBottom: 30,
    fontWeight: '600',
  },
  form: {
    marginBottom: 30,
  },
  label: {
    color: '#444',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#a33',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
