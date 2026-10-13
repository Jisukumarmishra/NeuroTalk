/**
 * API Service for Frontend
 * Handles all communication with the backend
 * Falls back to mock data if backend is unreachable
 */

const API_BASE = '/api';
const DEFAULT_USER_ID = 'user_001';

/**
 * Submit a response for analysis
 */
export async function analyzeResponse(answer, mode) {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: DEFAULT_USER_ID,
        answer,
        mode,
      }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unreachable, using mock data:', err.message);
    return generateMockAnalysis(answer, mode);
  }
}

/**
 * Fetch dashboard data
 */
export async function fetchDashboard() {
  try {
    const res = await fetch(`${API_BASE}/dashboard/${DEFAULT_USER_ID}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unreachable, using mock dashboard:', err.message);
    return null; // fallback to component's built-in mock data
  }
}

/**
 * Fetch progress data
 */
export async function fetchProgress() {
  try {
    const res = await fetch(`${API_BASE}/progress/${DEFAULT_USER_ID}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unreachable, using mock progress:', err.message);
    return null; // fallback to component's built-in mock data
  }
}

/**
 * Mock analysis fallback
 */
function generateMockAnalysis(answer, mode) {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const fillerWords = words.filter(w =>
    ['um', 'uh', 'like', 'you', 'know', 'basically', 'actually'].includes(w.toLowerCase())
  ).length;

  const score = Math.max(20, Math.min(95, 60 + wordCount * 0.5 - fillerWords * 5 + (Math.random() * 10 - 5)));

  return {
    confidenceScore: Math.round(score),
    strengths: [
      wordCount > 30 ? 'Good response length showing engagement' : 'Showed willingness to engage',
      fillerWords < 3 ? 'Minimal filler words' : 'Attempted to articulate thoughts',
    ],
    weaknesses: [
      wordCount < 25 ? 'Response could use more detail' : 'Could add more specific examples',
      fillerWords > 3 ? 'Too many filler words — practice pausing instead' : 'Continue expanding depth of answers',
    ],
    metrics: {
      fillerWords,
      wordCount,
      clarityScore: Math.round(Math.min(100, 70 + wordCount * 0.3 - fillerWords * 4)),
      estimatedWPM: wordCount > 30 ? 142 : 110,
    },
    aiFeedback: score >= 70
      ? 'Great effort! Your response shows clear thinking and good structure.'
      : 'Keep practicing — focus on being more specific and reducing filler words.',
    suggestions: [
      'Use the STAR method for structured answers.',
      'Practice pausing instead of using filler words.',
      'Include specific examples to strengthen your points.',
    ],
    nextSteps: [
      { step: 1, title: 'Filler Word Challenge', desc: 'Speak for 2 minutes without fillers', status: 'current' },
      { step: 2, title: 'Structured Response Drill', desc: 'Practice 5 STAR-method answers', status: 'upcoming' },
    ],
    improvement: 'Keep practicing to track improvement!',
    source: 'mock',
  };
}
