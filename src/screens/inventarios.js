// Inventarios.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getInventarios } from '../database/baseSqlite';


const Inventarios = () => {
  const [inventariosAtivos, setInventariosAtivos] = useState([]);
  const [loadingAPI, setLoading] = useState(true);
  const [apiLink, setApiLink] = useState('');
  const [senhaLink, setSenhaLink] = useState('');
  const [codigoInventario, setCodigoInventario] = useState('');
  const [isRefresh, setIsRefresh] = useState(false);
  const [error, setError] = useState(null); // Estado para erro


  // Carrega os dados da configuração para o AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
        const loadData = async () => {

        const json = await AsyncStorage.getItem('inventario');
        const inventario = JSON.parse(json);

        if (inventario) {
            setApiLink(inventario.apiLink);
            setSenhaLink(inventario.senhaLink);
            setCodigoInventario(inventario.codigoInventario.toString());
        }    
    }
    loadData(); // Chama a função para carregar os dados
    }, [])); // Executa uma vez na montagem do componente

  // Função para buscar inventários da API
  const fetchInventariosAPI = async () => {
    setIsRefresh(true);
    setLoading(true); // Define o carregamento como verdadeiro
    setError(null); // Reseta o erro antes da nova requisição
      try {

        const json = await AsyncStorage.getItem('inventario');
        const inventario = JSON.parse(json);

        
        // Verifica se está habilitado para carregar da API ou do SQLite
        if (inventario.isEnabled) {
          // Carrega os inventários da tabela INVENTARIOITEM do SQLite
          const inventarios = await getInventarios(); // função para obter itens inventários do SQLite
          setInventariosAtivos(inventarios);
            
          
        } else if (apiLink && senhaLink && codigoInventario) {

                            
          const token = await AsyncStorage.getItem('userToken');

          const response = await axios.get(`${apiLink}/inventarios/`, {
            headers: { Authorization: token },
          }); 
          setInventariosAtivos(response.data); // Supondo que a resposta seja um array de inventários
      
      }
  
      } catch (error) {
      setError(error.message); // Armazena a mensagem de erro no estado
      } finally {
      setLoading(false); // Define o carregamento como concluído
      }
      setIsRefresh(false);
  };


  useFocusEffect(
    React.useCallback(() => {
        fetchInventariosAPI(); // Chama a função ao montar o componente ou ao atualizar
  }, [apiLink, senhaLink, codigoInventario]));


// Renderização da tela
const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>Número: {item.cdInventario.toString()}</Text>
      <Text style={styles.text}>Nome: {item.dsInventario.toString()}</Text>
      <Text style={styles.text}>Data de Abertura: {item.dtInicio.toString()}</Text>
      <Text style={styles.text}>Comissão de Inventário: {item.cdComissao.toString()}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      {loadingAPI ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error fetching from API: {error}</Text>
      ) : (
        <>
          <Text style={styles.title}>Lista de Inventários - Ativos</Text>
          <FlatList
            data={inventariosAtivos}
            keyExtractor={(item) => item.cdInventario.toString()} // Ajuste conforme a estrutura do seu inventário
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={fetchInventariosAPI}/>}
          />
          
        </>
        
      )}

   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    color:'#484d50'
  },
  itemContainer: {
    padding: 15,
    marginVertical: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#4682b4',
  },
});

export default Inventarios;
