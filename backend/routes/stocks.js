const express = require('express');
const router = express.Router();
const { getQuote, searchStock, getHistory, getMarketIndices } = require('../controllers/stockController');
const authMiddleware = require('../middleware/auth');

router.get('/search', authMiddleware, searchStock);
router.get('/indices', authMiddleware, getMarketIndices);
router.get('/history/:ticker', authMiddleware, getHistory);
router.get('/:ticker', authMiddleware, getQuote);

module.exports = router;