import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View /* include other react-native components here as needed */,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import historyData from '../api_example/ExampleApi_history.json.json';

// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)

export default function StocksScreen({ route }) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState([]);
  const [selected, setSelected] = useState(null);

  // can put more code here

  const percentageGain = (stock) =>
    (((stock.close - stock.open) / stock.open) * 100).toFixed(2);

  const renderSummary = state.map((stock, index) => {
    const percentage = percentageGain(stock);
    return (
      <TouchableOpacity
        key={stock.symbol + "" + index}
        onPress={() => setSelected(stock)}
      >
        <View style={styles.stockContainer}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbolTextContainer}>{stock.symbol}</Text>
          </View>
          <View style={styles.closeContainer}>
            <Text style={styles.closeTextContainer}>{stock.close}</Text>
          </View>
          <View
            style={
              percentage > 0 ? styles.gainContainerP : styles.gainContainerN
            }
          >
            <Text style={styles.gainTextContainer}>{percentage}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const renderDetail = () => {
    if (selected) {
      return (
        <View style={styles.detailContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameTextContainer}>{selected.name}</Text>
          </View>
          <View style={styles.priceContainer}>
            <View style={styles.priceSecContainer}>
              <Text style={[styles.priceTextContainer, styles.priceTextKey]}>
                OPEN
              </Text>
              <Text style={styles.priceTextContainer}>{selected.open}</Text>
            </View>
            <View style={styles.priceSecContainer}>
              <Text style={[styles.priceTextContainer, styles.priceTextKey]}>
                LOW
              </Text>
              <Text style={styles.priceTextContainer}>{selected.low}</Text>
            </View>
            <View style={styles.priceSecContainer}>
              <Text style={[styles.priceTextContainer, styles.priceTextKey]}>
                CLOSE
              </Text>
              <Text style={styles.priceTextContainer}>{selected.close}</Text>
            </View>
            <View style={styles.priceSecContainer}>
              <Text style={[styles.priceTextContainer, styles.priceTextKey]}>
                HIGH
              </Text>
              <Text style={styles.priceTextContainer}>{selected.high}</Text>
            </View>
            <View style={styles.priceSecContainer}>
              <Text style={[styles.priceTextContainer, styles.priceTextKey]}>
                VOLUME
              </Text>
              <Text style={styles.priceTextContainer}>{selected.volumes}</Text>
            </View>
            <View style={styles.priceSecContainer}>
              <Text
                style={[styles.priceTextContainer, styles.priceTextKey]}
              ></Text>
              <Text style={styles.priceTextContainer}></Text>
            </View>
          </View>
        </View>
      );
    }
  };

  useEffect(() => {
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state

    async function getAllData(watchList) {
      if (watchList.length > 0) {
        try {
          console.log("watchList");
          let arr = [];
          await Promise.all(
            watchList.map(async (item) => {
              // let url = ServerURL + "/history?symbol=" + item;
              let url = `https://sandbox.iexapis.com/stable/stock/${item}/intraday-prices?token=${API_KEY}`;
              await fetch(url)
                .then(response => response.json())
                .then(data => {
                  arr.push(data[0]);
                });
            })
          ).then(async () => {
            setState(arr);
          });

          console.log(arr);
        } catch (exception) {
          console.log(exception);
        }
      }
    }

    getAllData(watchList);
  }, [watchList]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.scrollContainer}>
        <ScrollView>
          <View style={styles.topContainer}>{renderSummary}</View>
        </ScrollView>
      </SafeAreaView>
      <View style={styles.bottomContainer}>{renderDetail()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: 1,
  },

  topContainer: {
    flex: 3,
  },

  scrollContainer: {
    flex: 3,
  },

  bottomContainer: {
    flex: 1,
    backgroundColor: "#222222",
  },

  stockContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#393939",
    height: scaleSize(60),
  },

  symbolContainer: {
    width: scaleSize(140),
    marginTop: scaleSize(10),
    marginBottom: scaleSize(10),
    paddingLeft: scaleSize(10),
  },

  closeContainer: {
    width: scaleSize(100),
    marginTop: scaleSize(10),
    marginBottom: scaleSize(10),
  },

  gainContainerP: {
    width: scaleSize(110),
    backgroundColor: "#4DD964",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: scaleSize(10),
    marginBottom: scaleSize(10),
    marginLeft: scaleSize(15),
    marginRight: scaleSize(5),
  },

  gainContainerN: {
    width: scaleSize(110),
    backgroundColor: "#FF3930",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: scaleSize(10),
    marginBottom: scaleSize(10),
    marginLeft: scaleSize(15),
    marginRight: scaleSize(5),
  },

  symbolTextContainer: {
    color: "#ffffff",
    textAlign: "left",
    fontSize: scaleSize(25),
    margin: scaleSize(3),
  },

  closeTextContainer: {
    color: "#ffffff",
    textAlign: "right",
    fontSize: scaleSize(25),
    margin: scaleSize(3),
  },

  gainTextContainer: {
    color: "#ffffff",
    textAlign: "right",
    fontSize: scaleSize(25),
    margin: scaleSize(3),
    paddingRight: scaleSize(5),
  },

  detailContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  nameContainer: {
    flex: 2,
    borderBottomWidth: 1,
    borderColor: "#393939",
  },

  nameTextContainer: {
    fontSize: scaleSize(25),
    color: "#ffffff",
    paddingTop: scaleSize(5),
    paddingBottom: scaleSize(5),
    textAlign: "center",
  },

  priceContainer: {
    flex: 4,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  priceSecContainer: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    // flexWrap: "wrap",
    borderBottomWidth: 1,
    borderColor: "#393939",
  },

  priceTextContainer: {
    color: "#ffffff",
    fontSize: scaleSize(15),
    paddingTop: scaleSize(6),
    paddingBottom: scaleSize(6),
  },

  priceTextKey: {
    color: "#515151",
    paddingLeft: scaleSize(3),
  },
});
