const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/healthz', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get('/legal/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'legal', 'privacy.html'));
});

app.get('/legal/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'legal', 'terms.html'));
});

// Basic CORS for development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Example API route
app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello from backend API' });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
