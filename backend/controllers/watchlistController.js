const { pool } = require('../config/db');

const getWatchlist = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM watchlist WHERE user_id = $1 ORDER BY added_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToWatchlist = async (req, res) => {
  const { ticker, company_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO watchlist (user_id, ticker, company_name) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, ticker, company_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromWatchlist = async (req, res) => {
  const { ticker } = req.params;
  try {
    await pool.query(
      'DELETE FROM watchlist WHERE user_id = $1 AND ticker = $2',
      [req.user.id, ticker]
    );
    res.json({ message: 'Stock removed from watchlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };