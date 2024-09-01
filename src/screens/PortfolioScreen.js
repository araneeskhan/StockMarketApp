import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const PortfolioScreen = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const savedPortfolio = await AsyncStorage.getItem("portfolio");
      if (savedPortfolio) {
        setPortfolio(JSON.parse(savedPortfolio));
      }
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  const savePortfolio = async (newPortfolio) => {
    try {
      await AsyncStorage.setItem("portfolio", JSON.stringify(newPortfolio));
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  };

  const addHolding = () => {
    if (symbol && quantity) {
      const newHolding = {
        symbol: symbol.toUpperCase(),
        quantity: parseInt(quantity),
      };
      const newPortfolio = [...portfolio, newHolding];
      setPortfolio(newPortfolio);
      savePortfolio(newPortfolio);
      setSymbol("");
      setQuantity("");
    }
  };

  const removeHolding = (index) => {
    const newPortfolio = portfolio.filter((_, i) => i !== index);
    setPortfolio(newPortfolio);
    savePortfolio(newPortfolio);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.holdingItem}>
      <Text style={[styles.holdingText, isDarkMode && styles.darkText]}>
        {item.symbol}
      </Text>
      <Text style={[styles.holdingText, isDarkMode && styles.darkText]}>
        {item.quantity}
      </Text>
      <TouchableOpacity onPress={() => removeHolding(index)}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        My Portfolio
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Symbol"
          value={symbol}
          onChangeText={setSymbol}
          placeholderTextColor={isDarkMode ? "#999" : "#666"}
        />
        <TextInput
          style={[styles.input, isDarkMode && styles.darkInput]}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholderTextColor={isDarkMode ? "#999" : "#666"}
        />
        <TouchableOpacity style={styles.addButton} onPress={addHolding}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={portfolio}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>
            Your portfolio is empty
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveWidth(5),
    backgroundColor: "#f5f5f5",
  },
  darkContainer: {
    backgroundColor: "#222",
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    marginTop: responsiveHeight(4),
    textAlign: "center",
    marginBottom: responsiveHeight(4),
  },
  darkText: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: responsiveHeight(2),
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: responsiveHeight(6),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: responsiveWidth(3),
    marginRight: responsiveWidth(2),
    backgroundColor: "#fff",
  },
  darkInput: {
    borderColor: "#555",
    color: "white",
    backgroundColor: "#333",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(3),
    borderRadius: 8,
    height: responsiveHeight(6),
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: responsiveFontSize(2),
  },
  holdingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(2),
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: responsiveHeight(1),
  },
  holdingText: {
    fontSize: responsiveFontSize(2),
    color: "#333",
  },
  removeButton: {
    color: "#FF3B30",
    fontSize: responsiveFontSize(1.8),
  },
  emptyText: {
    textAlign: "center",
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(2),
    color: "#666",
  },
});

export default PortfolioScreen;
