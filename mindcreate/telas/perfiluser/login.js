import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { loginUser } from "../../firebase/authfirebase";
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Preencha email e senha");
      return;
    }

    try {
      await loginUser(email, password);
      navigation.navigate("Rotas");
    } catch (error) {
      console.log("Erro ao logar:", error.message);
      Alert.alert("Erro no login", error.message);
    }
  }

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.message}>Entre para explorar a nossa comunidade!</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#8B0000" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8B0000"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#8B0000" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#8B0000"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.registerLink} 
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.registerText}>Não tem conta? Cadastre-se aqui.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff5e6',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#8B0000',
    marginBottom: 12,
    marginTop: 50,
    letterSpacing: 1,
    textShadowColor: 'rgba(139, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  message: {
    fontSize: 16,
    color: '#8B0000',
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    paddingVertical: 18,
    fontSize: 16,
    color: '#8B0000',
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 20,
    padding: 12,
  },
  registerText: {
    color: '#8B0000',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#8B0000',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    marginRight: 8,
    letterSpacing: 0.5,
  },
});