import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import InicialScreen from './home';
import ComprasScreen from './compras';
import Chatscreen from './chat';
import Perfilscreen from './perfil';
import Projetosscreen from './projetos';
import CriarConta from './CreatCont';
import ProjetoScreen from './projeto';
import Login from './login';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="telainicial"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#964534' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="telachat"
        component={Chatscreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="chatbubble" size={30} color="white" />
            ) : (
              <Ionicons name="chatbubble-outline" size={30} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="telainicial"
        component={InicialScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="home" size={30} color="white" />
            ) : (
              <Ionicons name="home-outline" size={30} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="compras"
        component={ComprasScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="cart" size={30} color="white" />
            ) : (
              <Ionicons name="cart-outline" size={30} color="black" />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Rotas() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: { backgroundColor: '#c27464', width: 240 },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#bbb',
        drawerLabelStyle: { fontSize: 18 },
        headerStyle: { backgroundColor: '#fff5e6' },
        headerTintColor: '#8B2323',
        headerTitle: '',
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="Perfil" component={Perfilscreen} />
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Projetos" component={Projetosscreen} />
      <Drawer.Screen name="Projeto" component={ProjetoScreen} />
      <Drawer.Screen name="Criar Conta" component={CriarConta} />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
}
