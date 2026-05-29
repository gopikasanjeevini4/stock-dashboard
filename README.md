# 📈 Stock Market Dashboard

A full-stack real-time stock market dashboard built with Next.js, Node.js, PostgreSQL, and WebSockets.

![Stock Dashboard](https://img.shields.io/badge/Stock-Dashboard-blue) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)

## 🚀 Features

- 🔐 **User Authentication** — Signup, Login with JWT tokens
- 📊 **Live Stock Prices** — Real-time price updates via WebSocket
- 📈 **Price Charts** — Interactive charts with 30-day history
- 💼 **Portfolio Tracker** — Add/remove stocks, track total value
- 👀 **Watchlist** — Track your favourite stocks
- 📉 **Market Indices** — S&P 500, Nasdaq, Dow Jones
- 🌙 **Dark UI** — Beautiful dark theme with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (App Router)
- Tailwind CSS v4
- Recharts (charts)
- Socket.io Client (live prices)
- Axios (API calls)

### Backend
- Node.js + Express
- PostgreSQL (database)
- Redis (caching)
- Socket.io (WebSocket)
- JWT + bcryptjs (auth)

### External API
- Alpha Vantage (stock data)

## 📁 Project Structure

​```
stock-dashboard/
├── backend/
│   ├── config/          # DB and Redis config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   ├── package.json
│   └── server.js        # Entry point
├── frontend/
│   ├── app/             # Next.js pages
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── portfolio/
│   │   ├── watchlist/
│   │   ├── layout.js
│   │   └── page.js
│   ├── utils/           # API and auth helpers
│   ├── package.json
│   └── next.config.mjs
├── .gitignore
└── README.md
​```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL 17
- Redis (Memurai for Windows)
- Alpha Vantage API key (free at alphavantage.co)

### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/stock-dashboard.git
cd stock-dashboard
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stockdashboard
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_secret_key
REDIS_URL=redis://localhost:6379
ALPHA_VANTAGE_KEY=your_api_key
```

Create the database:
```bash
psql -U postgres -c "CREATE DATABASE stockdashboard;"
psql -U postgres -d stockdashboard -f config/schema.sql
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

## 📸 Screenshots

### Dashboard
- Live stock prices with WebSocket updates
- Interactive AAPL price history chart
- Market indices (S&P 500, Nasdaq, Dow Jones)

### Portfolio
- Add stocks with ticker, shares, and buy price
- View total portfolio value
- Remove stocks anytime

### Watchlist
- Add stocks by ticker symbol
- Track multiple stocks at once

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| GET | /api/stocks/:ticker | Get stock quote |
| GET | /api/stocks/history/:ticker | Get price history |
| GET | /api/portfolio | Get user portfolio |
| POST | /api/portfolio | Add stock to portfolio |
| DELETE | /api/portfolio/:id | Remove from portfolio |
| GET | /api/watchlist | Get watchlist |
| POST | /api/watchlist | Add to watchlist |
| DELETE | /api/watchlist/:ticker | Remove from watchlist |

## 👩‍💻 Author

**Munagala Gopika Sanjeevini**

## 📄 License

MIT License
