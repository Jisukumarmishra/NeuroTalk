/**
 * Analysis Service
 * Performs behavioral analysis on user responses
 */

// Common filler words to detect
const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'basically', 'actually',
  'literally', 'honestly', 'right', 'so', 'well', 'kind of',
  'sort of', 'i mean', 'you see', 'okay so',
];

/**
 * Analyze a user's text response for behavioral indicators
 * @param {string} answer - The user's text response
 * @param {string} mode - The practice mode (interview, stage, social, networking)
 * @returns {Object} Analysis results
 */
function analyzeResponse(answer, mode) {
  const lowerAnswer = answer.toLowerCase().trim();
  const words = lowerAnswer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Count filler words
  let fillerWordCount = 0;
  const fillerWordsFound = [];
  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerAnswer.match(regex);
    if (matches) {
      fillerWordCount += matches.length;
      fillerWordsFound.push({ word: filler, count: matches.length });
    }
  }

  // Calculate average sentence length
  const avgSentenceLength = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : wordCount;

  // Detect structural elements
  const hasStructure = sentenceCount >= 3;
  const hasExamples = /for example|for instance|such as|like when/i.test(answer);
  const hasNumbers = /\d+/.test(answer);
  const hasQuestions = /\?/.test(answer);
  const usesFirstPerson = /\bI\b/.test(answer);

  // Calculate clarity score (0-100)
  let clarityScore = 60;
  if (avgSentenceLength >= 8 && avgSentenceLength <= 20) clarityScore += 15;
  else if (avgSentenceLength > 20) clarityScore -= 10;
  if (hasStructure) clarityScore += 10;
  if (hasExamples) clarityScore += 10;
  if (fillerWordCount <= 2) clarityScore += 5;
  else if (fillerWordCount > 5) clarityScore -= 15;

  clarityScore = Math.max(0, Math.min(100, clarityScore));

  // Calculate pause penalty (simulated based on short sentences and fillers)
  const pausePenalty = Math.min(15, Math.max(0, (fillerWordCount - 2) * 2));

  // Speaking speed estimation (words per minute simulation)
  const estimatedWPM = wordCount < 20 ? 100 : wordCount < 50 ? 130 : wordCount < 100 ? 145 : 160;

  return {
    wordCount,
    sentenceCount,
    fillerWords: fillerWordCount,
    fillerWordsFound,
    avgSentenceLength,
    clarityScore,
    pausePenalty,
    estimatedWPM,
    indicators: {
      hasStructure,
      hasExamples,
      hasNumbers,
      hasQuestions,
      usesFirstPerson,
    },
  };
}

/**
 * Identify strengths based on analysis
 */
function identifyStrengths(analysis, mode) {
  const strengths = [];
  const { wordCount, fillerWords, clarityScore, indicators } = analysis;

  if (wordCount >= 50) {
    strengths.push('Provided a detailed and comprehensive response');
  } else if (wordCount >= 30) {
    strengths.push('Good response length showing engagement with the topic');
  }

  if (fillerWords <= 1) {
    strengths.push('Excellent fluency — minimal use of filler words');
  } else if (fillerWords <= 3) {
    strengths.push('Good control over filler words');
  }

  if (clarityScore >= 80) {
    strengths.push('High clarity — well-structured and easy to follow');
  }

  if (indicators.hasExamples) {
    strengths.push('Effective use of examples to support your points');
  }

  if (indicators.hasStructure) {
    strengths.push('Well-organized response with multiple distinct points');
  }

  if (indicators.hasNumbers) {
    strengths.push('Used specific data/metrics to add credibility');
  }

  if (indicators.usesFirstPerson && (mode === 'interview' || mode === 'networking')) {
    strengths.push('Appropriate use of first-person perspective for personal branding');
  }

  if (indicators.hasQuestions && (mode === 'social' || mode === 'networking')) {
    strengths.push('Shows curiosity and engagement by asking questions');
  }

  // Ensure at least one strength
  if (strengths.length === 0) {
    strengths.push('Showed willingness to engage with the prompt');
  }

  return strengths;
}

/**
 * Identify weaknesses based on analysis
 */
function identifyWeaknesses(analysis, mode) {
  const weaknesses = [];
  const { wordCount, fillerWords, clarityScore, avgSentenceLength, indicators } = analysis;

  if (wordCount < 15) {
    weaknesses.push('Response is very brief — try to elaborate with detail and examples');
  } else if (wordCount < 25) {
    weaknesses.push('Response could be longer — aim for more depth and specifics');
  }

  if (fillerWords > 5) {
    weaknesses.push('Too many filler words detected — practice pausing instead of using fillers');
  } else if (fillerWords > 3) {
    weaknesses.push('Some filler words detected — work on replacing them with brief pauses');
  }

  if (clarityScore < 50) {
    weaknesses.push('Clarity needs improvement — try structuring your answer with clear points');
  }

  if (avgSentenceLength > 25) {
    weaknesses.push('Sentences are too long — break them into shorter, punchier statements');
  }

  if (!indicators.hasExamples && (mode === 'interview' || mode === 'stage')) {
    weaknesses.push('Consider adding specific examples to strengthen your response');
  }

  if (!indicators.hasStructure) {
    weaknesses.push('Try organizing your response into distinct sections or points');
  }

  // Ensure at least one weakness (constructive)
  if (weaknesses.length === 0) {
    weaknesses.push('Push yourself to add even more specific details and examples');
  }

  return weaknesses;
}

module.exports = { analyzeResponse, identifyStrengths, identifyWeaknesses };
