import React from 'react';
import { Text, SafeAreaView, StyleSheet } from 'react-native';


export default function Chatscreen(props) {
    const excluirProj = (id) => {
    setProjetos(projetos.filter((p) => p.id !== id));
  };
  return (
    <SafeAreaView style={styles.container}>
   
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff5e6',
    padding: 8,
    
  },

});