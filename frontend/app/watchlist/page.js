'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import { logout, isAuthenticated } from '../../utils/auth';
import toast from 'react-hot-toast';

export default function Watchlist() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ticker: '', company_name: '' });

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const res = await api.get('/watchlist');
      setWatchlist(res.data);
    } catch (err) {
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const addStock = async () => {
    if (!form.ticker) { toast.error('Enter a ticker'); return; }
    try {
      await api.post('/watchlist', form);
      toast.success(`${form.ticker} added to watchlist!`);
      setForm({ ticker: '', company_name: '' });
      fetchWatchlist();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };

  const removeStock = async (ticker) => {
    try {
      await api.delete(`/watchlist/${ticker}`);
      toast.success('Removed from watchlist');
      fetchWatchlist();
    } catch (err) {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Watchlist</h1>
          <p className="text-gray-400 text-sm">{watchlist.length} stocks tracked</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/dashboard')} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">Dashboard</button>
          <button onClick={() => router.push('/portfolio')} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">Portfolio</button>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">Logout</button>
        </div>
      </div>

      {/* Add Stock */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Add to Watchlist</h2>
        <div className="flex gap-4">
          <input
            value={form.ticker}
            onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 w-32"
            placeholder="AAPL"
          />
          <input
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 flex-1"
            placeholder="Company name (optional)"
          />
          <button onClick={addStock} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm">Add</button>
        </div>
      </div>

      {/* Watchlist Grid */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : watchlist.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-400">No stocks in watchlist yet.</p>
          <p className="text-gray-500 text-sm mt-1">Add a ticker above to start tracking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {watchlist.map(stock => (
            <div key={stock.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition">
              <div className="flex justify-between items-start mb-2">
                <p className="text-white font-bold text-lg">{stock.ticker}</p>
                <button onClick={() => removeStock(stock.ticker)} className="text-gray-500 hover:text-red-400 text-xs">✕</button>
              </div>
              <p className="text-gray-400 text-sm">{stock.company_name || 'N/A'}</p>
              <p className="text-gray-500 text-xs mt-2">{new Date(stock.added_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}