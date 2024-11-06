import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Image, Text } from 'react-native';
import { recuperarSenha } from '../database/baseSqlite'; // Importe a função criada
import logo from '../../assets/logo.png';

const RecuperarSenha = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  const handleRecuperarSenha = async () => {
    try {
      const mensagem = await recuperarSenha(email, novaSenha);
      Alert.alert('Sucesso', mensagem);
      navigation.navigate('Login'); // Navegue para a tela de login
    } catch (error) {
      Alert.alert('Erro', error);
    }
    setEmail('');
    setNovaSenha('');
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
            <Image style={styles.logo} source={logo} />
            <Text style={styles.title}>Coletor de Dados Patrimoniais</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
      />
      <Button title="GRAVAR NOVA SENHA" onPress={handleRecuperarSenha} color="#5f9ea0" />
    </View>
  );
};

// Estilo para o componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 60
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default RecuperarSenha;
