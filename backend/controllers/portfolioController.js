const { pool } = require('../config/db');

const getPortfolio = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM portfolio WHERE user_id = $1 ORDER BY bought_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addStock = async (req, res) => {
  const { ticker, company_name, shares, buy_price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO portfolio (user_id, ticker, company_name, shares, buy_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, ticker, company_name, shares, buy_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeStock = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM portfolio WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    res.json({ message: 'Stock removed from portfolio' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPortfolio, addStock, removeStock };