import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/login'; 
import Leitura from './src/screens/leitura'; 
import Configuracao from './src/screens/configuracao';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{ headerShown: false }} /> 
          
        <Stack.Screen 
          name="Configuracao" 
          component={Configuracao}
          options={{ headerShown: true, title: 'Configurações' }} />

        <Stack.Screen 
          name="Leitura" 
          component={Leitura}
          options={{ headerShown: true, title: 'Leitura das Placas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
