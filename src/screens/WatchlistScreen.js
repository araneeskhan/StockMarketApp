import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import useWatchlist from "../hooks/useWatchList";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const WatchlistScreen = () => {
  const navigation = useNavigation();
  const { watchlist, removeFromWatchlist, isLoading } = useWatchlist();
  const [refreshing, setRefreshing] = useState(false);

  const handleRemove = useCallback((symbol) => {
    Alert.alert(
      "Remove from Watchlist",
      `Are you sure you want to remove ${symbol} from your watchlist?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          onPress: () => removeFromWatchlist(symbol),
          style: "destructive"
        },
      ]
    );
  }, [removeFromWatchlist]);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate("StockDetail", { symbol: item.symbol })}
    >
      <View style={styles.stockInfo}>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemove(item.symbol)}
      >
        <MaterialIcons name="remove-circle-outline" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [navigation, handleRemove]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Watchlist</Text>
      {watchlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="sentiment-dissatisfied" size={64} color="gray" />
          <Text style={styles.emptyMessage}>Your watchlist is empty.</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.addButtonText}>Add Stocks</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={watchlist}
          renderItem={renderItem}
          keyExtractor={(item) => item.symbol}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: "bold",
    textAlign: "center",
    color: "green",
    marginVertical: responsiveHeight(5),
  },
  listContainer: {
    paddingHorizontal: responsiveWidth(5),
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: responsiveHeight(1.5),
    padding: responsiveWidth(4),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  stockInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "bold",
    color: '#333',
  },
  name: {
    fontSize: responsiveFontSize(1.8),
    color: "gray",
    marginTop: responsiveHeight(0.5),
  },
  removeButton: {
    padding: responsiveWidth(2),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(10),
  },
  emptyMessage: {
    fontSize: responsiveFontSize(2),
    textAlign: "center",
    color: "gray",
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(3),
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 25,
  },
  addButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
});

export default WatchlistScreen;