'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { io } from 'socket.io-client';
import api from '../../utils/api';
import { getUser, logout, isAuthenticated } from '../../utils/auth';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [prices, setPrices] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    setUser(getUser());
    fetchData();

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    socket.on('priceUpdate', (data) => setPrices(data));
    return () => socket.disconnect();
  }, []);

  const fetchData = async () => {
    try {
      const watchRes = await api.get('/watchlist');
      setWatchlist(watchRes.data);

      const mockHistory = Array.from({ length: 30 }, (_, i) => ({
        date: `${String(i + 1).padStart(2, '0')}/05`,
        price: parseFloat((200 + Math.sin(i / 3) * 10 + i * 0.5).toFixed(2))
      }));
      setHistory(mockHistory);

      const mockIndices = [
        { name: 'S&P 500', price: '5,842', change: '+0.9%', up: true },
        { name: 'Nasdaq', price: '18,920', change: '+1.3%', up: true },
        { name: 'Dow Jones', price: '42,105', change: '-0.2%', up: false },
      ];
      setIndices(mockIndices);

    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  const tickers = ['AAPL', 'NVDA', 'MSFT', 'TSLA', 'AMZN', 'META'];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Stock Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/portfolio')} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">Portfolio</button>
          <button onClick={() => router.push('/watchlist')} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">Watchlist</button>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">Logout</button>
        </div>
      </div>

      {/* Live Prices */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {tickers.map(ticker => (
          <div key={ticker} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">{ticker}</p>
            <p className="text-white font-semibold">${prices[ticker] || '---'}</p>
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">AAPL Price History</h2>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-gray-400">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={history}>
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Market Indices */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Market Indices</h2>
          <div className="space-y-4">
            {indices.map(index => (
              <div key={index.name} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{index.name}</span>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">{index.price}</p>
                  <p className={`text-xs ${index.up ? 'text-green-400' : 'text-red-400'}`}>{index.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Watchlist preview */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-semibold">Your Watchlist</h2>
          <button onClick={() => router.push('/watchlist')} className="text-blue-400 text-sm hover:underline">View all</button>
        </div>
        {watchlist.length === 0 ? (
          <p className="text-gray-400 text-sm">No stocks in watchlist. <button onClick={() => router.push('/watchlist')} className="text-blue-400 hover:underline">Add some →</button></p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {watchlist.slice(0, 4).map(stock => (
              <div key={stock.id} className="bg-gray-800 rounded-lg p-3">
                <p className="text-white font-medium">{stock.ticker}</p>
                <p className="text-gray-400 text-xs">{stock.company_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}