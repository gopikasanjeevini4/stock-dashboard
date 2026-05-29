const express = require('express');
const router = express.Router();
const { getPortfolio, addStock, removeStock } = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getPortfolio);
router.post('/', authMiddleware, addStock);
router.delete('/:id', authMiddleware, removeStock);

module.exports = router;