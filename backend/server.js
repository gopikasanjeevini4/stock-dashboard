const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/watchlist', require('./routes/watchlist'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Stock Dashboard API running' }));

// WebSocket
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  const interval = setInterval(() => {
    const mockPrices = {
      AAPL:  (210 + Math.random() * 10).toFixed(2),
      NVDA:  (940 + Math.random() * 20).toFixed(2),
      MSFT:  (415 + Math.random() * 10).toFixed(2),
      TSLA:  (180 + Math.random() * 10).toFixed(2),
      AMZN:  (190 + Math.random() * 10).toFixed(2),
      META:  (560 + Math.random() * 10).toFixed(2),
    };
    socket.emit('priceUpdate', mockPrices);
  }, 5000);
  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();