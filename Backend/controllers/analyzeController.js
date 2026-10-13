/**
 * Analyze Controller
 * Orchestrates the full analysis pipeline:
 * Input → Analysis → Scoring → AI Feedback → Store → Respond
 */

const { analyzeResponse, identifyStrengths, identifyWeaknesses } = require('../services/analysisService');
const { calculateConfidenceScore, getScoreGrade, calculateImprovement } = require('../services/scoringService');
const { generateAIFeedback } = require('../services/aiService');
const { storeSession, getPreviousScore } = require('../services/memoryService');
const { generateNextSteps } = require('../services/nextStepService');

/**
 * POST /api/analyze
 * Full behavioral analysis pipeline
 */
async function handleAnalyze(req, res) {
  try {
    const { userId, answer, mode } = req.body;

    // Validate input
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required and must be a string' });
    }
    if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
      return res.status(400).json({ error: 'answer is required and must be a non-empty string' });
    }
    const validModes = ['interview', 'stage', 'social', 'networking'];
    if (!mode || !validModes.includes(mode)) {
      return res.status(400).json({
        error: `mode must be one of: ${validModes.join(', ')}`,
      });
    }

    // Step 1: Behavioral Analysis
    const analysis = analyzeResponse(answer, mode);

    // Step 2: Score Calculation
    const confidenceScore = calculateConfidenceScore(analysis);
    const grade = getScoreGrade(confidenceScore);

    // Step 3: Identify Strengths & Weaknesses
    const strengths = identifyStrengths(analysis, mode);
    const weaknesses = identifyWeaknesses(analysis, mode);

    // Step 4: AI Feedback
    const aiFeedback = await generateAIFeedback(answer, analysis, confidenceScore, mode, strengths, weaknesses);

    // Step 5: Generate Next Steps
    const nextSteps = generateNextSteps(weaknesses, confidenceScore);

    // Step 6: Calculate Improvement
    const previousScore = getPreviousScore(userId);
    const improvement = calculateImprovement(confidenceScore, previousScore);

    // Step 7: Store Session
    const metrics = {
      fillerWords: analysis.fillerWords,
      wordCount: analysis.wordCount,
      clarityScore: analysis.clarityScore,
      estimatedWPM: analysis.estimatedWPM,
      sentenceCount: analysis.sentenceCount,
      pausePenalty: analysis.pausePenalty,
    };

    storeSession(userId, {
      confidenceScore,
      mode,
      metrics,
      strengths: aiFeedback.strengths || strengths,
      weaknesses: aiFeedback.weaknesses || weaknesses,
      suggestions: aiFeedback.suggestions,
      nextSteps,
      aiFeedback: aiFeedback.feedback,
    });

    // Step 8: Send Response
    res.json({
      confidenceScore,
      grade,
      strengths: aiFeedback.strengths || strengths,
      weaknesses: aiFeedback.weaknesses || weaknesses,
      metrics,
      aiFeedback: aiFeedback.feedback,
      suggestions: aiFeedback.suggestions,
      nextSteps,
      improvement: improvement.message,
      improvementTrend: improvement.trend,
      source: aiFeedback.source,
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: 'Internal server error during analysis' });
  }
}

module.exports = { handleAnalyze };
