import axios from 'axios';

const API_KEY = 'd6d9634144mshed1dfc641f6e8d4p1f2e97jsnec882916b1a7';
const BASE_URL = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
  }
});

export const searchStocks = async (query) => {
  try {
    const response = await api.get('/auto-complete', { params: { q: query } });
    return response.data.quotes || [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};

export const getStockOverview = async (symbol) => {
  try {
    const response = await api.get('/market/v2/get-quotes', { params: { symbols: symbol } });
    return response.data.quoteResponse.result[0] || null;
  } catch (error) {
    console.error('Error fetching stock overview:', error);
    return null;
  }
};

export const getHistoricalData = async (symbol) => {
  try {
    const response = await api.get('/stock/v3/get-chart', {
      params: {
        symbol: symbol,
        interval: '1d',
        range: '1mo'
      }
    });
    return response.data.chart.result[0] || null;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return null;
  }
};

export const getNewsHeadlines = async (symbol) => {
  try {
    const response = await api.post('/news/v2/list', {
      category: symbol,
      region: 'US'
    });
    
    if (Array.isArray(response.data?.items)) {
      return response.data.items.slice(0, 3);
    } else {
      console.warn('News items not found in API response');
      return [];
    }
  } catch (error) {
    console.error('Error fetching news headlines:', error);
    return [];
  }
};