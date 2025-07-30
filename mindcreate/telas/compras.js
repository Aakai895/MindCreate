import React from 'react';
import { Text, SafeAreaView, StyleSheet } from 'react-native';
import Menu from './menu';

export default function ComprasScreen(props) {

  return (
    <SafeAreaView style={styles.container}>
     <Menu />
   <Text> aa </Text>
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