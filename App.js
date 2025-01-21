import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/login'; 
import Cadastro from './src/screens/cadastro'; 
import Leitura from './src/screens/leitura'; 
import Configuracao from './src/screens/configuracao';
import Principal from './src/screens/principal';
import RecuperacaoSenha from './src/screens/RecuperacaoSenha';
import Listabens from './src/screens/listabens';
import Inventarios from './src/screens/inventarios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

const App = () => {
  const [isExpired, setIsExpired] = useState(false);

  const checkExpiration = async () => {
    try {
      const installDate = await AsyncStorage.getItem('installDate');
      const now = new Date().getTime();

      if (installDate) {
        const daysSinceInstall = (now - parseInt(installDate, 10)) / (1000 * 60 * 60 * 24);
        if (daysSinceInstall > 30) {
          setIsExpired(true);
        }
      } else {
        // Se não houver data de instalação, salva a data atual
        await AsyncStorage.setItem('installDate', now.toString());
      }
    } catch (error) {
      console.error('Erro ao verificar a expiração:', error);
    }
  };

  useEffect(() => {
    checkExpiration();
  }, []);

  return (
    <NavigationContainer>
      {isExpired ? (
        <View style={styles.expiredContainer}>
          <Text style={styles.expiredText}>Período de Testes Expirado!</Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text style={styles.contact}>Entre em contato pelo email: marcelosds@gmail.com</Text>
        </View>
      ) : (
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Principal" component={Principal} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="Configuracao" component={Configuracao} />
          <Stack.Screen name="Leitura" component={Leitura} />
          <Stack.Screen name="Recupera" component={RecuperacaoSenha} />
          <Stack.Screen name="Lista" component={Listabens} />
          <Stack.Screen name="Inventarios" component={Inventarios} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  expiredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredText: {
    fontSize: 20,
    color: 'red',
  },
  contact: {
    fontSize: 14,
    color: 'black',
  },
});


export default App;
