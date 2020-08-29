import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // can put more code here

  async function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage

    try {
      let originalList = [];
      let stringList = await AsyncStorage.getItem("watchlistItems");
      let flag = false;
      if (stringList != null && stringList != "") {
        originalList = JSON.parse(stringList);
        originalList.map((listItem) => {
          if (listItem === newSymbol) {
            flag = true;
          }
        });
      }
      if (!flag) {
        originalList.push(newSymbol);
      }
      // console.log(originalList);
      AsyncStorage.setItem("watchlistItems", JSON.stringify(originalList));
      setState(originalList);
    } catch (exception) {
      console.log(exception);
    }
  }

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    async function getWatchList() {
      try {
        let originalList = [];
        let stringList = await AsyncStorage.getItem("watchlistItems");
        if (stringList !== null && stringList !== "") {
          originalList = JSON.parse(stringList);
        }
        // console.log(originalList);
        setState(originalList);
      } catch (exception) {
        console.log(exception);
      }
    }
    getWatchList();
  }, []);

  return {
    ServerURL: "http://131.181.190.87:3001",
    watchList: state,
    addToWatchlist,
  };
};
