/**
 * API Routes
 * All REST endpoints for the AI Behavioral Mirror backend
 */

const express = require('express');
const router = express.Router();
const { handleAnalyze } = require('../controllers/analyzeController');
const { getProgressData, getDashboardData } = require('../services/memoryService');

/**
 * POST /api/analyze
 * Analyze a user's response and return full behavioral feedback
 *
 * Body: { userId: string, answer: string, mode: "interview" | "stage" | "social" | "networking" }
 */
router.post('/analyze', handleAnalyze);

/**
 * GET /api/progress/:userId
 * Get progress data for charts and streak tracking
 */
router.get('/progress/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required' });
    }

    const progress = getProgressData(userId);
    res.json(progress);
  } catch (err) {
    console.error('Progress error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/dashboard/:userId
 * Get structured dashboard data for frontend rendering
 */
router.get('/dashboard/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required' });
    }

    const dashboard = getDashboardData(userId);
    res.json(dashboard);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Behavioral Mirror',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
