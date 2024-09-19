import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Alert, Image } from 'react-native';
import logo from '../../assets/logo.png';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função que lida com o login
  const handleLogin = () => {
    // Verifique se o email e a senha estão corretos
    const emailCorreto = 'marcelosds@gmail.com'; // Troque isso pelo seu email correto
    const senhaCorreta = '123456'; // Troque isso pela sua senha correta

    if (email === emailCorreto && senha === senhaCorreta) {
      // Se o email e a senha estão corretos, navegue para a tela de Configuracao
      navigation.navigate('Configuracao');

      // Limpar os campos após o login bem-sucedido
      setEmail('');
      setSenha('');

    } else {
      // Se o email ou a senha estiverem incorretos, exiba um alerta
      Alert.alert('Erro', 'Email ou senha incorretos!');

      // Limpar campos após uma tentativa de login, mesmo que tenha falhado
      setEmail('');
      setSenha('');

    }
  };

  return (

    <View style={styles.container}>
        <View style={styles.header}>
            <Image style={styles.logo} source={logo} />
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
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={true} // Isso garante que a senha apareça como asteriscos
      />
       
       <View style={styles.buttonContainer}>
            <View style={styles.btn}>   
                <Button title="Login" onPress={handleLogin} color="#5f9ea0" />
            </View>
            <View style={styles.btn}>
                <Button title="Criar Cadastro" onPress={() => {}} color="#5f9ea0" />
            </View>
      </View>

    </View>
  );
};

// Estilos para a tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 100,
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
  header: {
    width: "100%",
    alignItems: "center"
  },
  logo: {
    width: 170,
    height: 150,
  },
  buttonContainer: {
    marginTop: 50
  },
  btn: {
    marginVertical: 5
  }

});

export default Login;
