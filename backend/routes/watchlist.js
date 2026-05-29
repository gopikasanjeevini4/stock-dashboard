const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getWatchlist);
router.post('/', authMiddleware, addToWatchlist);
router.delete('/:ticker', authMiddleware, removeFromWatchlist);

module.exports = router;