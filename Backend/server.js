/**
 * AI Behavioral Mirror – Backend Server
 * Express.js REST API for behavioral analysis and AI coaching
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware
// ============================================
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ============================================
// Routes
// ============================================
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'AI Behavioral Mirror – Social Anxiety Coach',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /api/analyze',
      progress: 'GET /api/progress/:userId',
      dashboard: 'GET /api/dashboard/:userId',
      health: 'GET /api/health',
    },
  });
});

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} does not exist`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║  AI Behavioral Mirror – Backend Server       ║
  ║  Running on http://localhost:${PORT}            ║
  ║  OpenAI:  ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Not set (using rule-based)'}       ║
  ╚══════════════════════════════════════════════╝
  `);
});

module.exports = app;
