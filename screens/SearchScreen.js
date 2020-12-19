import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  /* include other react native components here as needed */
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import { Ionicons } from "@expo/vector-icons";
import data from '../api_example/ExampleApi_all.json';

// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [state, setState] = useState([]);
  const [searchState, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);

  // can put more code here

  const filterSearch = text => {
    setSearch(text);

    const filteredResults = state.filter(
      stock =>
        stock.symbol.toLowerCase().includes(text.toLowerCase()) ||
        stock.name.toLowerCase().includes(text.toLowerCase())
    );

    setFiltered(filteredResults);
  };

  const addNavigate = symbol => {
    addToWatchlist(symbol);
    navigation.navigate('Stocks');
  };

  const renderStocks = filtered.map(stock => (
    <TouchableOpacity
      key={stock.symbol}
      onPress={() => addNavigate(stock.symbol)}
    >
      <View style={styles.stock}>
        <Text style={styles.searchNameTextContainer}>{stock.symbol}</Text>
        <Text style={styles.searchSymbolTextContainer}>{stock.name}</Text>
      </View>
    </TouchableOpacity>
  ));

  // useEffect(() => {
  //   // FixMe: fetch symbol names from the server and save in local SearchScreen state
  //   fetch(ServerURL + '/all')
  //     .then(response => response.json())
  //     .then(data => {
  //       setState(data);
  //     });
  // }, []);

  useEffect(() => {
    // FixMe: fetch symbol names from the server and save in local SearchScreen state
  
        setState(data);
     
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.infoTextContainer}>
          Type a company name or stock symbol:
        </Text>
        <View style={styles.searchContainer}>
          <Ionicons
            style={styles.icon}
            name="md-search"
            size={24}
            color="white"
          />
          <TextInput
            style={styles.input}
            placeholder="search"
            placeholderTextColor="white"
            value={searchState}
            onChangeText={text => filterSearch(text)}
          />
        </View>
        <SafeAreaView>
          <ScrollView>{renderStocks}</ScrollView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: 1,
  },

  stock: {
    height: scaleSize(60),
    marginLeft: scaleSize(5),
    justifyContent: "center",
  },

  infoTextContainer: {
    color: "#ffffff",
    textAlign: "center",
    paddingTop: scaleSize(10),
    paddingBottom: scaleSize(10),
  },

  searchContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#1F1F1F",
    borderRadius: 5,
    marginLeft: scaleSize(5),
    marginRight: scaleSize(5),
    height: scaleSize(40),
    alignItems: "center",
  },

  input: {
    color: "#ffffff",
    width: "100%",
    height: "100%",
    marginLeft: scaleSize(10),
    fontSize: scaleSize(20),
  },

  icon: {
    marginLeft: scaleSize(5),
  },

  searchNameTextContainer: {
    color: "#ffffff",
    fontSize: scaleSize(20),
  },
  searchSymbolTextContainer: {
    color: "#ffffff",
  },
});
