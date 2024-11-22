import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Picker,
  ScrollView,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'afb9de9fd7b39f6ed4de3719';
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

const App = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [conversionHistory, setConversionHistory] = useState([]);

  // Load saved data when app starts
  useEffect(() => {
    loadSavedData();
    fetchCurrencies();
  }, []);

  // Load saved data from AsyncStorage
  const loadSavedData = async () => {
    try {
      const savedData = await Promise.all([
        AsyncStorage.getItem('lastAmount'),
        AsyncStorage.getItem('lastFromCurrency'),
        AsyncStorage.getItem('lastToCurrency'),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('conversionHistory')
      ]);

      if (savedData[0]) setAmount(savedData[0]);
      if (savedData[1]) setFromCurrency(savedData[1]);
      if (savedData[2]) setToCurrency(savedData[2]);
      if (savedData[3]) setFavorites(JSON.parse(savedData[3]));
      if (savedData[4]) setConversionHistory(JSON.parse(savedData[4]));
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  // Save current session data
  const saveSessionData = async () => {
    try {
      await AsyncStorage.setItem('lastAmount', amount);
      await AsyncStorage.setItem('lastFromCurrency', fromCurrency);
      await AsyncStorage.setItem('lastToCurrency', toCurrency);
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  };

  // Fetch available currencies
  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`${BASE_URL}/${API_KEY}/latest/USD`);
      const data = await response.json();
      
      if (data.result === 'success') {
        const currencyCodes = Object.keys(data.conversion_rates).map(code => ({
          code,
          name: code
        }));
        setCurrencies(currencyCodes);
        setRates(data.conversion_rates);
      } else {
        Alert.alert('Error', 'Failed to fetch currencies');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error while fetching currencies');
    }
  };

  // Add to favorites
  const addToFavorites = async () => {
    const newFavorite = {
      id: Date.now().toString(),
      from: fromCurrency,
      to: toCurrency
    };
    
    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      Alert.alert('Success', 'Added to favorites!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save favorite');
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  // Use favorite pair
  const useFavoritePair = (favorite) => {
    setFromCurrency(favorite.from);
    setToCurrency(favorite.to);
  };

  // Convert currency
  const convertCurrency = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    setLoading(true);
    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        Alert.alert('Error', 'Please enter a valid number');
        return;
      }

      const rate = rates[toCurrency];
      if (!rate) {
        Alert.alert('Error', 'Exchange rate not available');
        return;
      }

      const result = numAmount * rate;
      const convertedAmount = result.toFixed(2);
      setConverted(convertedAmount);

      // Save conversion to history
      const historyItem = {
        id: Date.now().toString(),
        from: fromCurrency,
        to: toCurrency,
        amount: amount,
        result: convertedAmount,
        date: new Date().toLocaleString()
      };

      const updatedHistory = [historyItem, ...conversionHistory].slice(0, 10); // Keep last 10 conversions
      setConversionHistory(updatedHistory);
      await AsyncStorage.setItem('conversionHistory', JSON.stringify(updatedHistory));

      // Save session data
      saveSessionData();
    } catch (error) {
      Alert.alert('Error', 'Failed to convert currency');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Currency Converter</Text>
        
        {/* Main Converter */}
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={fromCurrency}
            style={styles.picker}
            onValueChange={setFromCurrency}>
            {currencies.map((currency) => (
              <Picker.Item 
                key={currency.code} 
                label={currency.code} 
                value={currency.code} 
              />
            ))}
          </Picker>

          <TouchableOpacity onPress={swapCurrencies} style={styles.swapButton}>
            <Text style={styles.swapButtonText}>⇄</Text>
          </TouchableOpacity>

          <Picker
            selectedValue={toCurrency}
            style={styles.picker}
            onValueChange={setToCurrency}>
            {currencies.map((currency) => (
              <Picker.Item 
                key={currency.code} 
                label={currency.code} 
                value={currency.code} 
              />
            ))}
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.convertButton, loading && styles.convertButtonDisabled]} 
            onPress={convertCurrency}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.convertButtonText}>Convert</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={addToFavorites}
          >
            <Text style={styles.favoriteButtonText}>★ Add to Favorites</Text>
          </TouchableOpacity>
        </View>

        {/* Conversion Result */}
        {converted && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>
              {amount} {fromCurrency} =
            </Text>
            <Text style={styles.result}>
              {converted} {toCurrency}
            </Text>
            <Text style={styles.rateText}>
              1 {fromCurrency} = {rates[toCurrency]?.toFixed(4)} {toCurrency}
            </Text>
          </View>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorites</Text>
            <FlatList
              data={favorites}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.favoriteItem}
                  onPress={() => useFavoritePair(item)}
                  onLongPress={() => removeFromFavorites(item.id)}
                >
                  <Text style={styles.favoriteText}>
                    {item.from} → {item.to}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Conversion History */}
        {conversionHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Conversions</Text>
            {conversionHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <Text style={styles.historyText}>
                  {item.amount} {item.from} = {item.result} {item.to}
                </Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  picker: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  swapButton: {
    padding: 8,
    marginHorizontal: 8,
  },
  swapButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  convertButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  favoriteButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  convertButtonDisabled: {
    backgroundColor: '#999',
  },
  convertButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  favoriteButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  rateText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  favoriteItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  favoriteText: {
    fontSize: 14,
    color: '#333',
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyText: {
    fontSize: 14,
    color: '#333',
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default App;