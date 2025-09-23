import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './telas/perfiluser/login';
import Cad from './telas/perfiluser/CreatCont';
import Rotas from './telas/rotas';
import { AppProvider, useApp } from './context/authcontext';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }, 1800);

    return () => clearTimeout(timer);
  }, [fadeAnim]);

  if (showSplash) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <StatusBar barStyle="light-content" />
        <Image source={require('./assets/logoMC.png')} style={styles.logo} />
        <Text style={styles.header}>MindCreate</Text>
        <Text style={styles.text}>Crochê e Desenho</Text>
      </Animated.View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <AppWithNavigation />
      </NavigationContainer>
    </AppProvider>
  );
}

function AppWithNavigation() {
  const { usuario, loading } = useApp(); // 🔄 contexto

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#964534" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuario ? (
        <>
          <Stack.Screen name="Rotas" component={Rotas} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cad} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#964534',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
    color: '#fff',
  },
  header: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
