import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import Telainicial from './home';
import ComprasScreen from './compra/compras';
import Chatscreen from './perfiluser/chat';
import Perfilscreen from './perfiluser/perfil';
import Projetosscreen from './projetos/projetos';
import CriarConta from './perfiluser/CreatCont';
import ProjetoScreen from './projetos/projeto';
import Login from './perfiluser/login';
import Meusprod from './loja/meusprodutos';
import ProdutoStack from './loja/produto';
import Carrinho from './compra/carrinho';
import CriarProd from './loja/TelaCriarProd';
import Assinat from './ assinatura/Assinatura';
import Assinar from './ assinatura/Assinar';
import EditPerfil from './perfiluser/editPerfil';
import Produtos from './loja/Produtos';
import Pagamento from './compra/Pagamento';
import SplashScreen from './splash';
import Sel1 from './ assinatura/Selecao1';
import Sel2 from './ assinatura/Selecao2';
import Sel3 from './ assinatura/Selecao3';
import Cred from './compra/addCredito';
import Deb from './compra/addDebito';
import Pix from './compra/pixCod';
import Precif from './projetos/precificar';
import config from './perfiluser/config';
import PostDetailScreen from './perfiluser/post';
import ProjetoDesenhoScreen from './projetos/projetoD';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#8B0000' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="telachat"
        component={Projetosscreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="folder-open" size={30} color="white" />
            ) : (
              <Ionicons name="folder-open-outline" size={30} color="black" />
            ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Telainicial}
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
        drawerStyle: { backgroundColor: '#8B0000', width: 240 },
        drawerActiveTintColor: '#000000',
        drawerInactiveTintColor: '#fff',
        drawerLabelStyle: { fontSize: 18 },
        headerStyle: { backgroundColor: '#fff5e6' },
        headerTintColor: '#C4624E',
        headerTitle: '',
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
      }}>
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={Perfilscreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="edit"
        component={EditPerfil}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
       <Drawer.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Pagar"
        component={Pagamento}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="CriarProd"
        component={CriarProd}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="Assinatura"
        component={Assinat}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Assinar"
        component={Assinar}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="Produtos"
        component={Produtos}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="Projeto"
        component={ProjetoScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ProjetoD"
        component={ProjetoDesenhoScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Criar Conta"
        component={CriarConta}
        options={{
          drawerItemStyle: { display: 'none', headerShown: false },
        }}
      />
      <Drawer.Screen
        name="Login"
        component={Login}
        options={{
          drawerItemStyle: { display: 'none', headerShown: false },
        }}
      />
      <Drawer.Screen
        name="Minha loja"
        component={Meusprod}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Produto"
        component={ProdutoStack}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Carrinho"
        component={Carrinho}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Selecao1"
        component={Sel1}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Selecao2"
        component={Sel2}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Selecao3"
        component={Sel3}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AddCred"
        component={Cred}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="AddDeb"
        component={Deb}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Pix"
        component={Pix}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Precificar"
        component={Precif}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
          drawerItemStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Configuração"
        component={config}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
