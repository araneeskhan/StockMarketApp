import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Keyboard,
  Switch,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { debounce } from "lodash";
import { searchStocks } from "../api/stockApi";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import StockComparison from "./StockComparison";

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSearch = useCallback(async (searchQuery) => {
    if (searchQuery.trim() === "") {
      setResults([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const searchResults = await searchStocks(searchQuery);
      if (searchResults.length === 0) {
        setError("No results found. Please try a different symbol.");
        setResults([]);
      } else {
        setResults(searchResults);
      }
    } catch (error) {
      setError("Error searching stocks. Please try again later.");
      console.error("Error searching stocks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(debounce(handleSearch, 300), [
    handleSearch,
  ]);

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError("");
    Keyboard.dismiss();
  };

  const handleStockPress = useCallback(
    (stock) => {
      if (compareMode) {
        if (selectedStocks.length < 2) {
          setSelectedStocks([...selectedStocks, stock]);
        }
        if (selectedStocks.length === 1) {
          setCompareMode(false);
        }
      } else {
        navigation.navigate("StockDetailScreen", { symbol: stock.symbol });
      }
    },
    [compareMode, selectedStocks, navigation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[styles.resultItem, isDarkMode && styles.darkResultItem]}
        onPress={() => handleStockPress(item)}
      >
        <View style={styles.resultContent}>
          <View>
            <Text style={[styles.symbolText, isDarkMode && styles.darkText]}>
              {item.symbol}
            </Text>
            <Text style={[styles.nameText, isDarkMode && styles.darkText]}>
              {item.shortname}
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={isDarkMode ? "white" : "gray"}
          />
        </View>
      </TouchableOpacity>
    ),
    [handleStockPress, isDarkMode]
  );

  const ListEmptyComponent = useCallback(
    () =>
      !loading &&
      query && (
        <Text style={[styles.emptyMessage, isDarkMode && styles.darkText]}>
          {error || "No results found. Try a different search term."}
        </Text>
      ),
    [loading, query, error, isDarkMode]
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>
        Stock Explorer
      </Text>

      <View style={styles.headerRow}>
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={24}
            color={isDarkMode ? "white" : "gray"}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Search stocks by symbol or name"
            placeholderTextColor={isDarkMode ? "#999" : "#666"}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCapitalize="characters"
          />
          {query !== "" && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <MaterialIcons
                name="close"
                size={24}
                color={isDarkMode ? "white" : "gray"}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.themeToggleContainer}>
          <Text style={styles.switchText}>Switch Light/Dark Mode </Text>
          <MaterialIcons
            name={isDarkMode ? "brightness-2" : "brightness-5"}
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
            style={styles.themeToggle}
          />
        </View>
      </View>

      <View style={styles.compareModeContainer}>
        <Text style={[styles.compareModeText, isDarkMode && styles.darkText]}>
          Compare Mode
        </Text>
        <Switch
          value={compareMode}
          onValueChange={(value) => {
            setCompareMode(value);
            setSelectedStocks([]);
          }}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={compareMode ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      {loading && (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={isDarkMode ? "white" : "green"}
        />
      )}

      {selectedStocks.length === 2 && (
        <StockComparison
          symbol1={selectedStocks[0].symbol}
          symbol2={selectedStocks[1].symbol}
        />
      )}

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.symbol}
        ListEmptyComponent={ListEmptyComponent}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.resultsList}
      />

      <TouchableOpacity
        style={[
          styles.watchlistButton,
          isDarkMode && styles.darkWatchlistButton,
        ]}
        onPress={() => navigation.navigate("Watchlist")}
      >
        <MaterialIcons name="star" size={24} color="white" />
        <Text style={styles.buttonText}>View Watchlist</Text>
      </TouchableOpacity>
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
    fontSize: responsiveFontSize(3.5),
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginVertical: responsiveHeight(3),
  },
  darkText: {
    color: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkSearchContainer: {
    backgroundColor: "#444",
  },
  searchIcon: {
    marginRight: responsiveWidth(2),
  },
  input: {
    flex: 1,
    height: responsiveHeight(6),
    fontSize: responsiveFontSize(2),
  },
  darkInput: {
    color: "white",
  },
  clearButton: {
    padding: responsiveWidth(2),
  },
  switchText: {
    fontSize: responsiveFontSize(2),
    color: "green",
    marginLeft: responsiveWidth(15),
    marginRight: responsiveWidth(10),
  },
  compareModeText: {
    fontSize: responsiveFontSize(2),
    color: "green",
    marginLeft: responsiveWidth(15),
    marginRight: responsiveWidth(31),
  },
  compareModeContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: responsiveHeight(2),
  },
  themeToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeToggle: {
    marginLeft: responsiveWidth(1),
  },
  loader: {
    marginVertical: responsiveHeight(2),
  },
  resultsList: {
    flexGrow: 1,
  },
  resultItem: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: responsiveHeight(1),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  darkResultItem: {
    backgroundColor: "#444",
  },
  resultContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: responsiveWidth(4),
  },
  symbolText: {
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.2),
    color: "#333",
  },
  nameText: {
    color: "gray",
    fontSize: responsiveFontSize(1.8),
    marginTop: responsiveHeight(0.5),
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: responsiveHeight(5),
    fontSize: responsiveFontSize(2),
    color: "gray",
  },
  watchlistButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 25,
    paddingVertical: responsiveHeight(1.5),
    marginTop: responsiveHeight(2),
  },
  darkWatchlistButton: {
    backgroundColor: "#006400",
  },
  buttonText: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    marginLeft: responsiveWidth(2),
  },
});

export default HomeScreen;
