import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Image, TouchableOpacity } from 'react-native';
import { createUserTable, authenticateUser } from '../database/baseSqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logoUri, setLogoUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Configurar imagem do logo

  useEffect(() => {
    const loadLogo = async () => {
      const storedLogoUri = await AsyncStorage.getItem('logoUri');
      if (storedLogoUri) {
        setLogoUri(storedLogoUri);
      }
    };

    loadLogo();
  }, []);


  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Acesso à galeria', 'Permissão para acessar a galeria é necessária!');
    }
  };

  const pickImage = async () => {
    await requestPermission();
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setLogoUri(result.assets[0].uri); // Armazena a URI da imagem
      await AsyncStorage.setItem('logoUri', result.assets[0].uri); // Salva no AsyncStorage
      //console.log(result.assets[0].uri); // URI da imagem selecionada
    }
  };
 
  useEffect(() => {

    createUserTable(); // Criar a tabela ao iniciar o aplicativo

  }, []);

  const handleAuth = async () => {
      // Verifica as credenciais do usuário
      const user = await authenticateUser(email, password);
      if (user) {
        //Alert.alert('Sucesso', `Login realizado com sucesso! Bem-vindo, ${user.fullName}.`);
        navigation.navigate('Principal'); // Navegar para a tela de Principal
      } else {
        Alert.alert('Erro', 'E-mail ou senha incorretos.');
      }
      setEmail('');
      setPassword('');

    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      {!logoUri ? (
        <Button title="Selecionar Logo" onPress={pickImage} />
      ) : (
        <Image/>
      )}
      {logoUri && (
        <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: logoUri }}
          style={styles.logo}
        />
        </TouchableOpacity>
      )}
        <Text style={styles.title}>Coletor de Dados Patrimoniais</Text>
      </View> 
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // Isso garante que a senha apareça como asteriscos
      />

      <View style={styles.recuperaContainer}>
        <Text 
          style={styles.link1} 
          onPress={() => navigation.navigate('Recupera')} // Recuperar senha
        >
          Esqueci minha senha!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleAuth} color="#5f9ea0" />
        <Text 
          style={styles.link} 
          onPress={() => navigation.navigate('Cadastro')} // Navegar para Cadastro
        >
          Criar Cadastro
        </Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 20,
    color: '#5f9ea0',
    textAlign: 'center',
  },
  link1: {
    marginTop: 1,
    color: '#5f9ea0',
    textAlign: 'right',
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 60
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 50
  },
  recuperaContainer: {
    alignItems: "flex-end"
  },
 
});

export default Login;


