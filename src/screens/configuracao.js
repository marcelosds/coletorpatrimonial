import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const Configuracao = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Button 
        title="Leitura" 
        onPress={() => navigation.navigate('Leitura')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Configuracao;
