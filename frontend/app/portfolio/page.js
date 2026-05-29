'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import { getUser, logout, isAuthenticated } from '../../utils/auth';
import toast from 'react-hot-toast';

export default function Portfolio() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ticker: '', company_name: '', shares: '', buy_price: '' });

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await api.get('/portfolio');
      setPortfolio(res.data);
    } catch (err) {
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const addStock = async () => {
    if (!form.ticker || !form.shares || !form.buy_price) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await api.post('/portfolio', form);
      toast.success('Stock added!');
      setForm({ ticker: '', company_name: '', shares: '', buy_price: '' });
      setShowForm(false);
      fetchPortfolio();
    } catch (err) {
      toast.error('Failed to add stock');
    }
  };

  const removeStock = async (id) => {
    try {
      await api.delete(`/portfolio/${id}`);
      toast.success('Stock removed');
      fetchPortfolio();
    } catch (err) {
      toast.error('Failed to remove stock');
    }
  };

  const totalValue = portfolio.reduce((sum, s) => sum + (s.shares * s.buy_price), 0);

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-gray-400 text-sm">Total value: ${totalValue.toFixed(2)}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/dashboard')} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">Dashboard</button>
          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">+ Add Stock</button>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">Logout</button>
        </div>
      </div>

      {/* Add Stock Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Add Stock to Portfolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Ticker</label>
              <input
                value={form.ticker}
                onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="AAPL"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Company Name</label>
              <input
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Apple Inc."
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Shares</label>
              <input
                type="number"
                value={form.shares}
                onChange={(e) => setForm({ ...form, shares: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="10"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Buy Price ($)</label>
              <input
                type="number"
                value={form.buy_price}
                onChange={(e) => setForm({ ...form, buy_price: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="150.00"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addStock} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm">Add Stock</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Portfolio Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm px-6 py-4">Stock</th>
              <th className="text-right text-gray-400 text-sm px-6 py-4">Shares</th>
              <th className="text-right text-gray-400 text-sm px-6 py-4">Buy Price</th>
              <th className="text-right text-gray-400 text-sm px-6 py-4">Total Value</th>
              <th className="text-right text-gray-400 text-sm px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center text-gray-400 py-8">Loading...</td></tr>
            ) : portfolio.length === 0 ? (
              <tr><td colSpan="5" className="text-center text-gray-400 py-8">No stocks yet. Add your first stock!</td></tr>
            ) : (
              portfolio.map(stock => (
                <tr key={stock.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{stock.ticker}</p>
                    <p className="text-gray-400 text-xs">{stock.company_name}</p>
                  </td>
                  <td className="text-right text-white px-6 py-4">{stock.shares}</td>
                  <td className="text-right text-white px-6 py-4">${parseFloat(stock.buy_price).toFixed(2)}</td>
                  <td className="text-right text-white px-6 py-4">${(stock.shares * stock.buy_price).toFixed(2)}</td>
                  <td className="text-right px-6 py-4">
                    <button onClick={() => removeStock(stock.id)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}