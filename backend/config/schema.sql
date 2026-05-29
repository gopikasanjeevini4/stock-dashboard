-- Create database
CREATE DATABASE stockdashboard;

-- Connect to database
\c stockdashboard;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio table
CREATE TABLE portfolio (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ticker VARCHAR(20) NOT NULL,
  company_name VARCHAR(100),
  shares DECIMAL(10,2) NOT NULL,
  buy_price DECIMAL(10,2) NOT NULL,
  bought_at TIMESTAMP DEFAULT NOW()
);

-- Watchlist table
CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ticker VARCHAR(20) NOT NULL,
  company_name VARCHAR(100),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, ticker)
);

-- Price history table
CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  ticker VARCHAR(20) NOT NULL,
  open_price DECIMAL(10,2),
  high_price DECIMAL(10,2),
  low_price DECIMAL(10,2),
  close_price DECIMAL(10,2),
  volume BIGINT,
  recorded_at DATE NOT NULL,
  UNIQUE(ticker, recorded_at)
);