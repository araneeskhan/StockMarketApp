import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { MaterialIcons } from '@expo/vector-icons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import {
  getStockOverview,
  getHistoricalData,
  getNewsHeadlines,
} from "../api/stockApi";
import useWatchlist from "../hooks/useWatchList";

const StockDetailScreen = ({ route, navigation }) => {
  const { symbol } = route.params;
  const [overview, setOverview] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const fetchData = useCallback(async () => {
    try {
      const [overviewData, historicalData, newsData] = await Promise.all([
        getStockOverview(symbol),
        getHistoricalData(symbol),
        getNewsHeadlines(symbol),
      ]);
      setOverview(overviewData);
      setHistoricalData(historicalData);
      setNews(newsData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const isInWatchlist = watchlist.some((item) => item.symbol === symbol);

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      removeFromWatchlist(symbol);
    } else if (overview) {
      addToWatchlist({ symbol, name: overview.shortName });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
        <Text style={styles.loadingText}>Loading stock data...</Text>
      </View>
    );
  }

  if (!overview || !historicalData) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="red" />
        <Text style={styles.errorText}>Failed to load stock data. Please try again later.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const chartData = {
    labels: historicalData.timestamp?.slice(-30).map((ts) => {
      const date = new Date(ts * 1000);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }) || [],
    datasets: [
      {
        data: historicalData.indicators?.quote[0]?.close?.slice(-30) || [],
      },
    ],
  };

  const priceChange = overview.regularMarketChange || 0;
  const priceChangePercent = overview.regularMarketChangePercent || 0;
  const isPriceUp = priceChange >= 0;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.symbol}>{symbol}</Text>
        <Text style={styles.name}>{overview.shortName}</Text>
        <Text style={styles.price}>
          ${overview.regularMarketPrice?.toFixed(2) || "N/A"}
        </Text>
        <Text style={[styles.change, isPriceUp ? styles.priceUp : styles.priceDown]}>
          <MaterialIcons name={isPriceUp ? "arrow-drop-up" : "arrow-drop-down"} size={24} />
          {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
        </Text>
      </View>

      {chartData.datasets[0].data.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>30 Day Price Chart</Text>
          <LineChart
            data={chartData}
            width={responsiveWidth(90)}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.watchlistButton, isInWatchlist ? styles.removeButton : {}]}
        onPress={toggleWatchlist}
      >
        <MaterialIcons name={isInWatchlist ? "star" : "star-border"} size={24} color="white" />
        <Text style={styles.watchlistButtonText}>
          {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </Text>
      </TouchableOpacity>

      <View style={styles.newsContainer}>
        <Text style={styles.newsTitle}>Recent News</Text>
        {news.length > 0 ? (
          news.map((item, index) => (
            <View key={index} style={styles.newsItem}>
              <Text style={styles.newsHeadline}>{item.title}</Text>
              <Text style={styles.newsDate}>{new Date(item.pubDate).toLocaleDateString()}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noNewsText}>No recent news available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    marginTop:responsiveHeight(5),
    padding: responsiveWidth(5),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  symbol: {
    fontSize: responsiveFontSize(4),
    fontWeight: "bold",
  },
  name: {
    fontSize: responsiveFontSize(2),
    color: "gray",
    marginBottom: responsiveHeight(2),
  },
  price: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: "bold",
  },
  change: {
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceUp: {
    color: "green",
  },
  priceDown: {
    color: "red",
  },
  chartContainer: {
    backgroundColor: 'white',
    margin: responsiveWidth(5),
    padding: responsiveWidth(5),
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "bold",
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
  },
  chart: {
    marginVertical: responsiveHeight(2),
    borderRadius: 16,
  },
  watchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "green",
    padding: responsiveHeight(2),
    borderRadius: 25,
    margin: responsiveWidth(5),
  },
  removeButton: {
    backgroundColor: "#ff6b6b",
  },
  watchlistButtonText: {
    color: "white",
    fontSize: responsiveFontSize(2),
    marginLeft: responsiveWidth(2),
  },
  newsContainer: {
    backgroundColor: 'white',
    margin: responsiveWidth(5),
    padding: responsiveWidth(5),
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "bold",
    marginBottom: responsiveHeight(2),
  },
  newsItem: {
    marginBottom: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: responsiveHeight(1),
  },
  newsHeadline: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
  },
  newsDate: {
    fontSize: responsiveFontSize(1.5),
    color: 'gray',
    marginTop: responsiveHeight(0.5),
  },
  noNewsText: {
    fontSize: responsiveFontSize(2),
    color: 'gray',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(2),
    color: 'gray',
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: responsiveWidth(5),
  },
  errorText: {
    fontSize: responsiveFontSize(2),
    color: 'gray',
    textAlign: 'center',
    marginVertical: responsiveHeight(2),
  },
  retryButton: {
    backgroundColor: 'green',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
  },
});

export default StockDetailScreen;