const axios = require('axios');
const { redisClient } = require('../config/redis');
const { pool } = require('../config/db');

const ALPHA_KEY = process.env.ALPHA_VANTAGE_KEY;

const getQuote = async (req, res) => {
  const { ticker } = req.params;
  try {
    const cached = await redisClient.get(`quote:${ticker}`);
    if (cached) return res.json(JSON.parse(cached));

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_KEY}`;
    const response = await axios.get(url);
    const data = response.data['Global Quote'];

    if (!data || !data['05. price']) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const quote = {
      ticker: data['01. symbol'],
      price: parseFloat(data['05. price']).toFixed(2),
      change: parseFloat(data['09. change']).toFixed(2),
      changePercent: data['10. change percent'],
      high: parseFloat(data['03. high']).toFixed(2),
      low: parseFloat(data['04. low']).toFixed(2),
      volume: data['06. volume'],
    };

    await redisClient.setEx(`quote:${ticker}`, 60, JSON.stringify(quote));
    res.json(quote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchStock = async (req, res) => {
  const { q } = req.query;
  try {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${q}&apikey=${ALPHA_KEY}`;
    const response = await axios.get(url);
    const results = response.data.bestMatches || [];
    const stocks = results.map(s => ({
      ticker: s['1. symbol'],
      name: s['2. name'],
      type: s['3. type'],
      region: s['4. region'],
    }));
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHistory = async (req, res) => {
  const { ticker } = req.params;
  try {
    const cached = await redisClient.get(`history:${ticker}`);
    if (cached) return res.json(JSON.parse(cached));

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=${ALPHA_KEY}`;
    const response = await axios.get(url);
    const timeSeries = response.data['Time Series (Daily)'] || {};

    const history = Object.entries(timeSeries).slice(0, 30).map(([date, values]) => ({
      date,
      open: parseFloat(values['1. open']).toFixed(2),
      high: parseFloat(values['2. high']).toFixed(2),
      low: parseFloat(values['3. low']).toFixed(2),
      close: parseFloat(values['4. close']).toFixed(2),
      volume: values['5. volume'],
    }));

    await redisClient.setEx(`history:${ticker}`, 3600, JSON.stringify(history));
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMarketIndices = async (req, res) => {
  const indices = [
    { name: 'S&P 500', ticker: 'SPY' },
    { name: 'Nasdaq', ticker: 'QQQ' },
    { name: 'Dow Jones', ticker: 'DIA' },
  ];
  try {
    const results = await Promise.all(indices.map(async (index) => {
      const cached = await redisClient.get(`quote:${index.ticker}`);
      if (cached) return { ...index, ...JSON.parse(cached) };
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${index.ticker}&apikey=${ALPHA_KEY}`;
      const response = await axios.get(url);
      const data = response.data['Global Quote'];
      return {
        name: index.name,
        ticker: index.ticker,
        price: parseFloat(data['05. price']).toFixed(2),
        change: parseFloat(data['09. change']).toFixed(2),
        changePercent: data['10. change percent'],
      };
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getQuote, searchStock, getHistory, getMarketIndices };