/**
 * Scoring Service
 * Calculates confidence score based on behavioral analysis
 */

/**
 * Calculate confidence score from analysis results
 * Formula: base + quality bonuses - filler penalties - structural penalties
 * Score clamped to 0-100
 *
 * @param {Object} analysis - Output from analysisService.analyzeResponse
 * @returns {number} Confidence score (0-100)
 */
function calculateConfidenceScore(analysis) {
  const {
    wordCount,
    fillerWords,
    clarityScore,
    pausePenalty,
    indicators,
  } = analysis;

  let score = 100;

  // Filler word penalty (3 points each)
  score -= fillerWords * 3;

  // Pause penalty
  score -= pausePenalty;

  // Clarity bonus (up to +10)
  const clarityBonus = Math.round((clarityScore - 60) * 0.25);
  score += clarityBonus;

  // Word count adjustment
  if (wordCount < 10) score -= 25;
  else if (wordCount < 20) score -= 15;
  else if (wordCount < 30) score -= 5;
  else if (wordCount >= 60) score += 5;

  // Structure bonuses
  if (indicators.hasExamples) score += 5;
  if (indicators.hasStructure) score += 5;
  if (indicators.hasNumbers) score += 3;

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));

  return score;
}

/**
 * Get a descriptive grade for a score
 * @param {number} score
 * @returns {{ grade: string, label: string, color: string }}
 */
function getScoreGrade(score) {
  if (score >= 90) return { grade: 'A+', label: 'Exceptional', color: '#34d399' };
  if (score >= 80) return { grade: 'A', label: 'Excellent', color: '#34d399' };
  if (score >= 70) return { grade: 'B+', label: 'Good', color: '#818cf8' };
  if (score >= 60) return { grade: 'B', label: 'Fair', color: '#818cf8' };
  if (score >= 50) return { grade: 'C', label: 'Developing', color: '#fbbf24' };
  if (score >= 40) return { grade: 'D', label: 'Needs Work', color: '#fb923c' };
  return { grade: 'F', label: 'Significant Improvement Needed', color: '#f87171' };
}

/**
 * Calculate improvement from previous session
 * @param {number} currentScore
 * @param {number|null} previousScore
 * @returns {{ change: number, message: string, trend: string }}
 */
function calculateImprovement(currentScore, previousScore) {
  if (previousScore === null || previousScore === undefined) {
    return {
      change: 0,
      message: 'Welcome! This is your first session.',
      trend: 'neutral',
    };
  }

  const change = currentScore - previousScore;
  const percentChange = previousScore > 0
    ? Math.round((change / previousScore) * 100)
    : change;

  let message, trend;
  if (change > 10) {
    message = `Outstanding! You improved by ${change} points (${percentChange}%) from your last session!`;
    trend = 'up';
  } else if (change > 0) {
    message = `Nice progress! You improved by ${change} points from last session.`;
    trend = 'up';
  } else if (change === 0) {
    message = 'Consistent performance — now push for the next level!';
    trend = 'neutral';
  } else {
    message = `Your score dipped by ${Math.abs(change)} points. Don't worry — every practice session counts!`;
    trend = 'down';
  }

  return { change, percentChange, message, trend };
}

module.exports = { calculateConfidenceScore, getScoreGrade, calculateImprovement };
