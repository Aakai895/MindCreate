import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from "../firebase/authfirebase";

const CadastroScreen = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // Função para cadastro
  async function handleCadastro() {
    try {
      await registerUser(email, password, nome);  // Chama a função de registro
      console.log("Usuário registrado!");
      navigation.navigate("Login");  // Navega para tela de login após sucesso
    } catch (error) {
      console.log("Erro ao registrar:", error.message);  // Exibe erro, se houver
    }
  }

  // Função para ir para a tela de login
  const handleLoginPress = () => {
    navigation.navigate('Login');  // Navega para tela de login
  };

  return (
    <SafeAreaView style={styles.background}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Ajuste para iOS
      >
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>Criar Conta</Text>

          

          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
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
          <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.loginButtonText}>Já possui uma conta? Log in aqui.</Text>
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff5e6',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: 20,
    marginTop: 50,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(132, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    fontSize: 15,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: 'transparent',
  },
  loginButtonText: {
    color: '#000',
    paddingBottom: 20,
  },
});

export default CadastroScreen;
