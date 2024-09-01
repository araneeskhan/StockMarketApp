import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = '@watchlist';

const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const storedWatchlist = await AsyncStorage.getItem(WATCHLIST_KEY);
      if (storedWatchlist !== null) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  const addToWatchlist = async (stock) => {
    try {
      const updatedWatchlist = [...watchlist, stock];
      setWatchlist(updatedWatchlist);
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    try {
      const updatedWatchlist = watchlist.filter(item => item.symbol !== symbol);
      setWatchlist(updatedWatchlist);
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  return { watchlist, addToWatchlist, removeFromWatchlist };
};

export default useWatchlist;