import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

if (!ALPHA_VANTAGE_API_KEY) {
  throw new Error('Missing Alpha Vantage API key');
}

export async function getStockPrice(symbol: string) {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    const data = response.data['Global Quote'];
    if (!data) {
      throw new Error('No data found for this symbol');
    }

    return {
      symbol: data['01. symbol'],
      price: parseFloat(data['02. open']),
      change: parseFloat(data['09. change']),
      changePercent: data['10. change percent'],
    };
  } catch (error) {
    throw new Error('Failed to fetch stock data');
  }
}