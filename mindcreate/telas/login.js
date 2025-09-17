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
import { loginUser } from "../firebase/authfirebase";

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

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text>Não tem conta? Cadastre-se aqui.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 2,
    marginTop: 50,
  },
  message: {
    fontSize: 15,
    color: '#000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(132, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    fontSize: 15,
  },
  button: {
    width: '75%',
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
