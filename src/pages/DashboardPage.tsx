import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { getStockPrice } from '../lib/api';

export function DashboardPage() {
  const [symbol, setSymbol] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: stockData, error, isLoading } = useQuery({
    queryKey: ['stock', searchTerm],
    queryFn: () => getStockPrice(searchTerm),
    enabled: !!searchTerm,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(symbol.toUpperCase());
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Stock Lookup</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          Failed to fetch stock data. Please try again.
        </div>
      )}

      {stockData && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{stockData.symbol}</h3>
            <div className="flex items-center gap-2">
              {stockData.change >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
              <span
                className={`font-semibold ${
                  stockData.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stockData.changePercent}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Opening Price</div>
              <div className="text-2xl font-bold">${stockData.price.toFixed(2)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Change</div>
              <div
                className={`text-2xl font-bold ${
                  stockData.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                ${Math.abs(stockData.change).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}