import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import app from '../../firebase/firebase'; 

export default function ConfigScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro ao sair', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: 'rgba(132, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    fontSize: 15,
  },
  logoutText: {
    color: '#a33',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});