import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getStockOverview } from '../api/stockApi';
import { useTheme } from '../contexts/ThemeContext';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const StockComparison = ({ symbol1, symbol2 }) => {
  const [stock1, setStock1] = useState(null);
  const [stock2, setStock2] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const [data1, data2] = await Promise.all([
          getStockOverview(symbol1),
          getStockOverview(symbol2),
        ]);
        setStock1(data1);
        setStock2(data2);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, [symbol1, symbol2]);

  if (isLoading) {
    return <ActivityIndicator size="large" color={isDarkMode ? 'white' : 'green'} />;
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Stock Comparison</Text>
      <View style={styles.comparisonRow}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Symbol</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{stock1.symbol}</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{stock2.symbol}</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Price</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>${stock1.regularMarketPrice.toFixed(2)}</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>${stock2.regularMarketPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>Market Cap</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>${(stock1.marketCap / 1e9).toFixed(2)}B</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>${(stock2.marketCap / 1e9).toFixed(2)}B</Text>
      </View>
      <View style={styles.comparisonRow}>
        <Text style={[styles.label, isDarkMode && styles.darkText]}>P/E Ratio</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{stock1.trailingPE?.toFixed(2) || 'N/A'}</Text>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{stock2.trailingPE?.toFixed(2) || 'N/A'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: responsiveWidth(5),
    borderRadius: 10,
    marginVertical: responsiveHeight(2),
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
  },
  darkText: {
    color: 'white',
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1),
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
});

export default StockComparison;