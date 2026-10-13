/**
 * AI Service
 * Handles LLM integration for generating personalized feedback
 * Falls back to rule-based feedback if no API key is configured
 */

/**
 * Generate feedback prompt for the AI
 */
function buildPrompt(answer, analysis, score, mode) {
  const modeLabels = {
    interview: 'Job Interview',
    stage: 'Public Speaking',
    social: 'Social Conversation',
    networking: 'Professional Networking',
  };

  const toneInstructions = score < 40
    ? 'Use a warm, supportive, and encouraging tone. Focus on positive aspects first and frame improvements gently.'
    : score < 70
    ? 'Use a balanced, constructive tone. Acknowledge progress while clearly identifying areas for growth.'
    : 'Use a professional, concise tone. Provide advanced-level tips for refinement.';

  return `You are an expert communication coach specializing in social anxiety support.

Context:
- Mode: ${modeLabels[mode] || mode}
- Confidence Score: ${score}/100
- Word Count: ${analysis.wordCount}
- Filler Words: ${analysis.fillerWords}
- Clarity Score: ${analysis.clarityScore}/100

The user's response to a ${modeLabels[mode] || mode} prompt:
"${answer}"

${toneInstructions}

Provide feedback in this JSON format:
{
  "feedback": "A 2-3 sentence overall feedback paragraph",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["area to improve 1", "area to improve 2"],
  "suggestions": ["actionable tip 1", "actionable tip 2", "actionable tip 3"]
}

Only return valid JSON, no other text.`;
}

/**
 * Try to call OpenAI API if key is available
 */
async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content);
  } catch (err) {
    console.error('OpenAI API call failed:', err.message);
    return null;
  }
}

/**
 * Rule-based fallback when no AI API is available
 */
function generateRuleFeedback(analysis, score, mode, strengths, weaknesses) {
  let feedback;

  if (score >= 80) {
    feedback = `Excellent performance! Your response demonstrates strong communication skills with clear structure and minimal hesitation. You're showing real confidence in ${mode === 'interview' ? 'interview settings' : 'this scenario'}.`;
  } else if (score >= 60) {
    feedback = `Good effort! You're building solid communication habits. Your response shows understanding of the topic, though there's room to strengthen your delivery with more specific examples and fewer filler words.`;
  } else if (score >= 40) {
    feedback = `You're making progress! The key areas to focus on are reducing filler words, adding more depth to your responses, and structuring your thoughts before speaking. Keep practicing — consistency is what matters most.`;
  } else {
    feedback = `Every practice session is a step forward. Try taking a moment to organize your thoughts before responding. Focus on delivering just 2-3 clear points rather than trying to cover everything at once. You've got this!`;
  }

  const suggestions = [];

  if (analysis.fillerWords > 3) {
    suggestions.push('Practice replacing filler words with brief pauses — silence sounds more confident than "um".');
  }
  if (analysis.wordCount < 25) {
    suggestions.push('Try the "expand and elaborate" technique: state your point, then add a why, then add an example.');
  }
  if (!analysis.indicators.hasExamples) {
    suggestions.push('Add specific examples from your experience to make your responses more compelling.');
  }
  if (!analysis.indicators.hasStructure) {
    suggestions.push('Use the 3-part structure: Introduction → Main Point → Conclusion to organize your thoughts.');
  }
  if (analysis.clarityScore < 60) {
    suggestions.push('Focus on shorter, clearer sentences. Aim for 10-15 words per sentence for maximum impact.');
  }

  // Ensure at least 3 suggestions
  const defaultSuggestions = [
    'Record yourself practicing and listen back to identify patterns you might miss.',
    'Before responding, take 3 seconds to mentally outline your key points.',
    'Practice with a timer to build comfort with real-time communication pressure.',
    'Use the STAR method (Situation, Task, Action, Result) for structured answers.',
  ];

  while (suggestions.length < 3 && defaultSuggestions.length > 0) {
    suggestions.push(defaultSuggestions.shift());
  }

  return {
    feedback,
    strengths,
    weaknesses,
    suggestions: suggestions.slice(0, 4),
  };
}

/**
 * Generate AI feedback (tries API first, falls back to rules)
 */
async function generateAIFeedback(answer, analysis, score, mode, strengths, weaknesses) {
  // Try OpenAI first
  const prompt = buildPrompt(answer, analysis, score, mode);
  const aiResult = await callOpenAI(prompt);

  if (aiResult) {
    return {
      feedback: aiResult.feedback || '',
      strengths: aiResult.strengths || strengths,
      weaknesses: aiResult.weaknesses || weaknesses,
      suggestions: aiResult.suggestions || [],
      source: 'openai',
    };
  }

  // Fallback to rule-based feedback
  const ruleResult = generateRuleFeedback(analysis, score, mode, strengths, weaknesses);
  return { ...ruleResult, source: 'rule-based' };
}

module.exports = { generateAIFeedback };
