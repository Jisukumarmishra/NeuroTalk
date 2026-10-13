/**
 * Memory Service
 * In-memory session storage and history tracking
 * Stores user sessions and calculates improvement over time
 */

// In-memory store (replace with MongoDB for persistence)
const sessionStore = new Map();

/**
 * Store a session result for a user
 */
function storeSession(userId, sessionData) {
  if (!sessionStore.has(userId)) {
    sessionStore.set(userId, []);
  }

  const session = {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...sessionData,
  };

  sessionStore.get(userId).push(session);
  return session;
}

/**
 * Get all sessions for a user
 */
function getUserSessions(userId) {
  return sessionStore.get(userId) || [];
}

/**
 * Get the most recent session for a user
 */
function getLastSession(userId) {
  const sessions = getUserSessions(userId);
  return sessions.length > 0 ? sessions[sessions.length - 1] : null;
}

/**
 * Get the previous session's score (for improvement calculation)
 */
function getPreviousScore(userId) {
  const sessions = getUserSessions(userId);
  if (sessions.length < 2) return null;
  return sessions[sessions.length - 2].confidenceScore;
}

/**
 * Get progress data for a user
 */
function getProgressData(userId) {
  const sessions = getUserSessions(userId);

  if (sessions.length === 0) {
    return generateMockProgress();
  }

  // Calculate weekly averages
  const weeklyData = {};
  sessions.forEach(session => {
    const date = new Date(session.timestamp);
    const weekKey = getWeekKey(date);
    if (!weeklyData[weekKey]) weeklyData[weekKey] = [];
    weeklyData[weekKey].push(session.confidenceScore);
  });

  const weeklyScores = Object.entries(weeklyData).map(([week, scores]) => ({
    week,
    score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    sessions: scores.length,
  }));

  // Calculate scenario-wise performance
  const scenarioPerf = {};
  sessions.forEach(session => {
    const mode = session.mode || 'unknown';
    if (!scenarioPerf[mode]) scenarioPerf[mode] = [];
    scenarioPerf[mode].push(session.confidenceScore);
  });

  const scenarioScores = Object.entries(scenarioPerf).map(([scenario, scores]) => ({
    scenario,
    avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    sessions: scores.length,
    bestScore: Math.max(...scores),
  }));

  // Calculate streak
  const streak = calculateStreak(sessions);

  // Calculate improvement trend
  const trend = sessions.length >= 2
    ? sessions[sessions.length - 1].confidenceScore - sessions[0].confidenceScore
    : 0;

  return {
    weeklyScores,
    scenarioScores,
    streak,
    totalSessions: sessions.length,
    overallTrend: trend,
    averageScore: Math.round(sessions.reduce((a, b) => a + b.confidenceScore, 0) / sessions.length),
    bestScore: Math.max(...sessions.map(s => s.confidenceScore)),
  };
}

/**
 * Get dashboard data for a user
 */
function getDashboardData(userId) {
  const sessions = getUserSessions(userId);

  if (sessions.length === 0) {
    return generateMockDashboard();
  }

  const latestSession = sessions[sessions.length - 1];
  const previousSession = sessions.length >= 2 ? sessions[sessions.length - 2] : null;

  return {
    score: latestSession.confidenceScore,
    strengths: latestSession.strengths || [],
    weaknesses: latestSession.weaknesses || [],
    metrics: latestSession.metrics || {},
    suggestions: latestSession.suggestions || [],
    nextSteps: latestSession.nextSteps || [],
    progress: sessions.slice(-8).map(s => ({
      score: s.confidenceScore,
      timestamp: s.timestamp,
      mode: s.mode,
    })),
    improvement: previousSession
      ? latestSession.confidenceScore - previousSession.confidenceScore
      : 0,
  };
}

/**
 * Calculate practice streak (consecutive days)
 */
function calculateStreak(sessions) {
  if (sessions.length === 0) return 0;

  const uniqueDays = new Set(
    sessions.map(s => new Date(s.timestamp).toISOString().split('T')[0])
  );

  const sortedDays = [...uniqueDays].sort().reverse();
  let streak = 1;
  const today = new Date().toISOString().split('T')[0];

  // If the most recent day isn't today or yesterday, streak is 0
  const lastDay = sortedDays[0];
  const daysDiff = Math.floor(
    (new Date(today) - new Date(lastDay)) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff > 1) return 0;

  for (let i = 1; i < sortedDays.length; i++) {
    const diff = Math.floor(
      (new Date(sortedDays[i - 1]) - new Date(sortedDays[i])) / (1000 * 60 * 60 * 24)
    );
    if (diff === 1) streak++;
    else break;
  }

  return streak;
}

function getWeekKey(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((date - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `Week ${weekNo}`;
}

/**
 * Generate mock progress data for demo purposes
 */
function generateMockProgress() {
  return {
    weeklyScores: [
      { week: 'Week 1', score: 42, sessions: 3 },
      { week: 'Week 2', score: 48, sessions: 5 },
      { week: 'Week 3', score: 55, sessions: 4 },
      { week: 'Week 4', score: 52, sessions: 2 },
      { week: 'Week 5', score: 63, sessions: 6 },
      { week: 'Week 6', score: 68, sessions: 5 },
      { week: 'Week 7', score: 72, sessions: 7 },
      { week: 'Week 8', score: 78, sessions: 6 },
    ],
    scenarioScores: [
      { scenario: 'interview', avgScore: 82, sessions: 24, bestScore: 92 },
      { scenario: 'stage', avgScore: 65, sessions: 18, bestScore: 78 },
      { scenario: 'social', avgScore: 74, sessions: 20, bestScore: 85 },
      { scenario: 'networking', avgScore: 70, sessions: 15, bestScore: 80 },
    ],
    streak: 12,
    totalSessions: 77,
    overallTrend: 36,
    averageScore: 74,
    bestScore: 92,
  };
}

/**
 * Generate mock dashboard data for demo purposes
 */
function generateMockDashboard() {
  return {
    score: 78,
    strengths: [
      'Structured response with clear beginning, middle, and end',
      'Strong vocabulary with domain-specific terminology',
      'Good use of examples to support your points',
      'Maintained consistent pacing throughout',
    ],
    weaknesses: [
      'Occasional filler words ("um", "like") detected',
      'Some answers could benefit from more specificity',
      'Tendency to rush through conclusions',
    ],
    metrics: {
      wordCount: 142,
      fillerWords: 3,
      clarityScore: 86,
      estimatedWPM: 145,
      pauseCount: 4,
    },
    suggestions: [
      'Practice the 3-point structure: State your point, support it, then summarize.',
      'Replace filler words with brief pauses — silence conveys confidence.',
      'Record yourself and listen back to identify unconscious verbal habits.',
      'Use the STAR method for interview scenarios.',
    ],
    nextSteps: [
      { step: 1, title: 'Filler Word Challenge', desc: 'Speak for 2 minutes without fillers', status: 'current' },
      { step: 2, title: 'Structured Response Drill', desc: 'Practice 5 STAR-method answers', status: 'upcoming' },
      { step: 3, title: 'Impromptu Speaking', desc: '1-minute speech on random topic', status: 'upcoming' },
      { step: 4, title: 'Mock Interview Session', desc: 'Full 30-minute mock interview', status: 'locked' },
    ],
    progress: [
      { score: 42, timestamp: '2026-02-01', mode: 'interview' },
      { score: 55, timestamp: '2026-02-08', mode: 'social' },
      { score: 63, timestamp: '2026-02-15', mode: 'stage' },
      { score: 68, timestamp: '2026-02-22', mode: 'networking' },
      { score: 72, timestamp: '2026-03-01', mode: 'interview' },
      { score: 78, timestamp: '2026-03-08', mode: 'interview' },
    ],
    improvement: 12,
  };
}

module.exports = {
  storeSession,
  getUserSessions,
  getLastSession,
  getPreviousScore,
  getProgressData,
  getDashboardData,
};
