/**
 * Next Step Generator Service
 * Generates personalized practice tasks based on detected weaknesses
 */

// Map weaknesses to actionable tasks
const WEAKNESS_TASK_MAP = [
  {
    pattern: /filler/i,
    tasks: [
      {
        title: 'Filler Word Elimination',
        desc: 'Practice speaking for 2 minutes on any topic without using any filler words (um, uh, like, you know). Record yourself and count any slips.',
        difficulty: 'medium',
      },
      {
        title: 'Pause Practice',
        desc: 'Replace every urge to say a filler word with a deliberate 1-second pause. This actually makes you sound more confident.',
        difficulty: 'easy',
      },
    ],
  },
  {
    pattern: /brief|short|elaborate|depth/i,
    tasks: [
      {
        title: 'Expand & Elaborate Drill',
        desc: 'Take any simple prompt and practice the Point-Reason-Example-Point (PREP) framework. Aim for at least 60 words per response.',
        difficulty: 'medium',
      },
      {
        title: 'Story Method Practice',
        desc: 'For each question, prepare a 30-second story that illustrates your point. Stories are memorable and naturally extend your response length.',
        difficulty: 'medium',
      },
    ],
  },
  {
    pattern: /clarity|structure|organize/i,
    tasks: [
      {
        title: 'STAR Method Drill',
        desc: 'Answer 5 interview questions using the STAR method: Situation, Task, Action, Result. Time each response to 60-90 seconds.',
        difficulty: 'medium',
      },
      {
        title: '3-Point Structure',
        desc: 'Practice the "I have 3 points" framework: State your position, give 3 supporting arguments, then summarize. Clear structure = clear thinking.',
        difficulty: 'easy',
      },
    ],
  },
  {
    pattern: /example|specific/i,
    tasks: [
      {
        title: 'Example Bank Builder',
        desc: 'Write down 5 specific stories from your life/career that demonstrate key skills (leadership, problem-solving, teamwork). Have these ready for any prompt.',
        difficulty: 'easy',
      },
    ],
  },
  {
    pattern: /rush|conclusion|ending/i,
    tasks: [
      {
        title: 'Strong Closing Practice',
        desc: 'Practice ending responses with a confident summary statement. Use phrases like "In summary," or "The key takeaway is..." to signal a deliberate close.',
        difficulty: 'easy',
      },
    ],
  },
  {
    pattern: /confidence|low/i,
    tasks: [
      {
        title: 'Power Posture & Breathing',
        desc: 'Before each practice session, do a 2-minute power pose and 3 deep breaths. Physical confidence translates to vocal confidence.',
        difficulty: 'easy',
      },
      {
        title: 'Gradual Exposure',
        desc: 'Start with social conversation prompts (lowest pressure), then progress to interviews and public speaking as you build confidence.',
        difficulty: 'medium',
      },
    ],
  },
  {
    pattern: /sentence|long/i,
    tasks: [
      {
        title: 'Conciseness Challenge',
        desc: 'Practice explaining complex ideas in under 30 seconds. Short, punchy sentences are more impactful and easier to follow.',
        difficulty: 'medium',
      },
    ],
  },
];

// Default fallback tasks
const DEFAULT_TASKS = [
  {
    title: 'Daily Impromptu Speaking',
    desc: 'Pick a random topic each day and speak about it for exactly 1 minute. No preparation — this builds adaptability and reduces anxiety.',
    difficulty: 'easy',
  },
  {
    title: 'Mirror Practice Session',
    desc: 'Practice your responses while looking in a mirror. Focus on maintaining eye contact (with yourself), facial expressions, and natural gestures.',
    difficulty: 'easy',
  },
  {
    title: 'Record & Review',
    desc: 'Record a 3-minute practice session, then listen back. Note 2 things you did well and 1 thing to improve. Self-awareness accelerates growth.',
    difficulty: 'medium',
  },
];

/**
 * Generate personalized next steps based on weaknesses
 * @param {string[]} weaknesses - List of identified weaknesses
 * @param {number} score - Current confidence score
 * @returns {Object[]} Next steps with title, desc, difficulty, and status
 */
function generateNextSteps(weaknesses, score) {
  const steps = [];
  const usedTitles = new Set();

  // Match weaknesses to tasks
  for (const weakness of weaknesses) {
    for (const mapping of WEAKNESS_TASK_MAP) {
      if (mapping.pattern.test(weakness)) {
        for (const task of mapping.tasks) {
          if (!usedTitles.has(task.title)) {
            usedTitles.add(task.title);
            steps.push({ ...task });
            if (steps.length >= 4) break;
          }
        }
      }
      if (steps.length >= 4) break;
    }
    if (steps.length >= 4) break;
  }

  // Fill remaining with defaults
  for (const task of DEFAULT_TASKS) {
    if (steps.length >= 4) break;
    if (!usedTitles.has(task.title)) {
      steps.push({ ...task });
    }
  }

  // Assign status: first = current, rest = upcoming, last = locked
  return steps.map((step, i) => ({
    step: i + 1,
    title: step.title,
    desc: step.desc,
    difficulty: step.difficulty,
    status: i === 0 ? 'current' : i < steps.length - 1 ? 'upcoming' : 'locked',
  }));
}

module.exports = { generateNextSteps };
