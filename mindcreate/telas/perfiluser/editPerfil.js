import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebase/firebase';
import { updateUserProfile } from '../../firebase/firestore';
import { useApp } from '../../context/authcontext';

export default function EditPerfil({ navigation }) {
  const { usuario } = useApp();

  const [nome, setNome] = useState(usuario?.nome || '');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState(usuario?.bio || '');
  const [profileImageBase64, setProfileImageBase64] = useState(usuario?.imagem || '');

  useEffect(() => {
    setNome(usuario?.nome || '');
    setBio(usuario?.bio || '');
  }, [usuario]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        setProfileImageBase64(base64);
      }
    } catch (error) {
      console.error('Erro ao escolher a imagem:', error);
    }
  };

  const handleSave = async () => {
    try {
      const uid = usuario?.uid;
      if (!uid) throw new Error('Usuário não autenticado');
  
      const updateData = {
        uid,
        nome,
        bio,
        username
      };
  
      if (profileImageBase64) {
        updateData.profileImageBase64 = profileImageBase64;
      }
  
      await updateUserProfile(updateData);
  
      console.log('Perfil salvo no Firestore!');
      navigation.navigate('Perfil');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#a33" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 28 }} />
      </View>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{
            uri: profileImageBase64
              ? `data:image/jpeg;base64,${profileImageBase64}`
              : usuario?.profileImageBase64
              ? `data:image/jpeg;base64,${usuario.profileImageBase64}`
              : 'https://via.placeholder.com/100',
          }}
          style={styles.avatar}
        />
        <Text style={styles.editPhotoText}>Editar Foto</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Usuário</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} />

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
