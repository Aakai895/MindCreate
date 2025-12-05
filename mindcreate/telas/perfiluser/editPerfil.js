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
import { useApp } from '../../context/AuthContext';

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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#8B0000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 28 }} />
      </View>

      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
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
        <View style={styles.editPhotoOverlay}>
          <Ionicons name="camera" size={24} color="#fff" />
        </View>
        <Text style={styles.editPhotoText}>Editar Foto</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#8B0000" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            value={nome} 
            onChangeText={setNome}
            placeholder="Nome"
            placeholderTextColor="#8B0000"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="at" size={20} color="#8B0000" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            value={username} 
            onChangeText={setUsername}
            placeholder="Usuário"
            placeholderTextColor="#8B0000"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="document-text-outline" size={20} color="#8B0000" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
            value={bio}
            onChangeText={setBio}
            placeholder="Bio"
            placeholderTextColor="#8B0000"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#8B0000',
    letterSpacing: 0.5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#8B0000',
  },
  editPhotoOverlay: {
    position: 'absolute',
    bottom: 10,
    right: '35%',
    backgroundColor: '#8B0000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editPhotoText: {
    textAlign: 'center',
    color: '#8B0000',
    marginTop: 12,
    fontWeight: '700',
    fontSize: 16,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  saveButton: {
    backgroundColor: '#8B0000',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    marginRight: 8,
    letterSpacing: 0.5,
  },
});