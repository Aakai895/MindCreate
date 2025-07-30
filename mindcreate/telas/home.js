import React from 'react';
import { Text,SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Menu from './menu';
import Projetos from './projetos'

export default function InicialScreen( {navigation} ) {

  const handlePress = () => {
      navigation.navigate('Projetos');  // Navega para a tela 'Projetos'
    };
  return (
    <SafeAreaView style={styles.main}>
     
      <View style={styles.containerverproj}>
      <TouchableOpacity style={styles.card} onPress={handlePress} >
        <Text style={styles.textVerProjeto}>Ver projetos</Text>
        <Text style={styles.textprogresso}> Acompanhe seu progresso de </Text>
        <Text style={styles.textVerProjeto}>%</Text>
      </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff5e6',
    padding: 8,
  },
  containerverproj: {

    margin: 30 ,
    borderRadius: 5 ,
    padding: 15 ,
    backgroundColor: '#840000',
    justifyContent: 'center' ,
  },
  textVerProjeto: {

    color: 'white',
    fontWeight: 'bold',
  },
  textprogresso: {

    color: 'white',
    fontSize: 12 , 
    
  }

});