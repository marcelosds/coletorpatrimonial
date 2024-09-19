import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { BarCodeScanner } from 'expo-barcode-scanner';
import RNPickerSelect from 'react-native-picker-select';

const Leitura = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localizacoes, setLocalizacoes] = useState([]);
  const [situacoes, setSituacoes] = useState([]);
    const [fields, setFields] = useState({
    placa: '',
    descricao: '',
    localizacao: '',
    estado: '',
    situacao: '',
  });

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setLoading(true);
    fetchBemData(data.trim());
  };

  const fetchBemData = async (placa) => {
    try {

      const invent = 1 // definir um local para escolher o inventário a ler

      const response = await axios.get(`http://192.168.15.10:3000/api/bens/${placa}/${invent}`);
      const bem = response.data; // A resposta já vem em JSON, então direto 'data'.
      setFields({
        placa: bem.nrPlaca.trim() || '', // Guardar como string ou vazio
        descricao: bem.dsReduzida || '',
        localizacao: bem.dsLocalizacao || '',
        estado: bem.dsEstadoConser || '',
        situacao: bem.dsSituacao || '',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os dados do bem. Verifique se o código está correto e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLocalizacoes = async () => {
      try {

        const ug = 1 // definir um local para escolher a UG a ler

        const response = await axios.get(`http://192.168.15.10:3000/api/locais/${ug}`);
        // Supondo que a resposta é um array de objetos com `label` e `value`
        const formattedData = response.data.map((item) => ({
          label: item.dsLocalizacao, // ajuste conforme o formato do seu objeto
          value: item.dsLocalizacao,
        }));
        setLocalizacoes(formattedData);

      } catch (error) {
        console.error('Erro ao buscar localizações:', error);
      }
    };

    fetchLocalizacoes();
  }, []);

  useEffect(() => {
    const fetchSituacoes = async () => {
      try {

        const response = await axios.get(`http://192.168.15.10:3000/api/situacao`);
        // Supondo que a resposta é um array de objetos com `label` e `value`
        const formattedData = response.data.map((item) => ({
          label: item.dsSituacao, // ajuste conforme o formato do seu objeto
          value: item.dsSituacao,
        }));
        setSituacoes(formattedData);

      } catch (error) {
        console.error('Erro ao buscar situaçoes:', error);
      }
    };

    fetchSituacoes();
  }, []);

  const handleInputChange = (field, value) => {
    setFields({
      ...fields,
      [field]: value,
    });
  };

  const saveData = async (placa) => {
    try {
      await axios.put(`http://192.168.15.10:3000/api/bens/${placa}`, fields);
      Alert.alert('Sucesso', 'Dados do bem salvos com sucesso.');
      
      // Limpar os campos após salvar
      setFields({
        placa: '',
        descricao: '',
        localizacao: '',
        estado: '',
        situacao: ''
      });

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados do bem.');
    }
  };

  if (hasPermission === null) {
    return <Text>Câmera requer permissão!</Text>;
  }

  if (hasPermission === false) {
    return <Text>Sem acesso a câmera!</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      
        
      </View>
      <ScrollView style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Placa"
          value={fields.placa}
          onChangeText={(value) => handleInputChange('placa', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={fields.descricao}
          onChangeText={(value) => handleInputChange('descricao', value)}
        />
        <RNPickerSelect
          style={pickerSelectStyles.inputAndroid}
          placeholder={{
            label: 'Localização',
            value: null,
          }}
          onValueChange={(value) => handleInputChange('localizacao', value)}
          items={localizacoes}
          value={fields.localizacao}
        />
        <RNPickerSelect
            style={pickerSelectStyles.inputAndroid}
            placeholder={{
              label: 'Estado de Conservação',
              value: null,
            }}
            onValueChange={(value) => handleInputChange('estado', value)}
            items={[
              { label: 'Excelente', value: 'Excelente' },
              { label: 'Bom', value: 'Bom' },
              { label: 'Regular', value: 'Regular' },
              { label: 'Péssimo', value: 'Péssimo' },
            ]}
            value={fields.estado}
        />
        <RNPickerSelect
            style={pickerSelectStyles.inputAndroid}
            placeholder={{
              label: 'Situação',
              value: null,
            }}
            onValueChange={(value) => handleInputChange('situacao', value)}
            items={situacoes}
            value={fields.situacao}
        />
        <View style={styles.buttonContainer}>
     
            <Button
              title={'Limpar e Ativar Leitura'}
              onPress={() => {
                setScanned(false);
                setFields({
                  placa: '',
                  descricao: '',
                  localizacao: '',
                  estado: '',
                  situacao: ''
                });
              }}
              color="#5f9ea0"
            />
         
        </View>
        <Button title="Salvar Dados" onPress={saveData}  color="#5f9ea0" />
        {loading && <Text>Carregando...</Text>}
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  scannerContainer: {
    flex: 1,         // Para ocupar espaço disponível
    maxHeight: 300,  // Limitar a altura máxima
    minHeight: 10,  // Limitar a altura mínima
    padding: 20,
    marginBottom: 10,
  },
  formContainer: {
    flex: 1,
    marginTop: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    fontSize: 16
  },
  scannedDataContainer: {
    marginTop: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  scannedDataTitle: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  buttonContainer: {
    flex: 1,
    marginBottom: 10,
    marginTop: 10
  },
  
});


const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
  },
});

export default Leitura;
