import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Clock,
  RotateCcw,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Mic,
  MicOff,
  ArrowRight,
  Briefcase,
  MessageCircle,
  Users,
  Volume2,
} from 'lucide-react';
import ScoreCircle from '../components/ScoreCircle';
import Card from '../components/Card';
import { analyzeResponse } from '../services/api';

// Mock questions by mode
const questionBank = {
  interview: [
    "Tell me about yourself and why you're a good fit for this role.",
    "Describe a challenging project you've worked on and how you overcame obstacles.",
    "Where do you see yourself in five years?",
    "Why should we hire you over other candidates?",
    "Tell me about a time you demonstrated leadership.",
  ],
  stage: [
    "Give a 2-minute introduction about a topic you're passionate about.",
    "Explain a complex concept to a general audience in simple terms.",
    "Deliver an impromptu speech about the importance of technology in education.",
    "Present your viewpoint on remote work vs. office work.",
  ],
  social: [
    "You just met someone at a coffee shop. Start a friendly conversation.",
    "Your neighbor invites you to a community event. How would you respond?",
    "You run into an old classmate. Catch up naturally.",
    "Someone at a party asks what you do for a living. Respond casually.",
  ],
  networking: [
    "Introduce yourself at a professional conference. Give your elevator pitch.",
    "You're at a tech meetup. Start a conversation with a potential mentor.",
    "Follow up on a conversation after exchanging business cards.",
    "Ask insightful questions to a speaker after their presentation.",
  ],
};

const modeConfig = {
  interview: { label: 'Job Interview', icon: Briefcase, color: 'primary' },
  stage: { label: 'Public Speaking', icon: Mic, color: 'accent' },
  social: { label: 'Social Conversation', icon: MessageCircle, color: 'emerald' },
  networking: { label: 'Networking', icon: Users, color: 'primary' },
};

// Mock AI feedback generator
function generateMockFeedback(answer, mode) {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const fillerWords = words.filter(w =>
    ['um', 'uh', 'like', 'you', 'know', 'basically', 'actually', 'literally', 'so', 'well'].includes(w.toLowerCase())
  ).length;

  const baseScore = Math.min(95, Math.max(25, 60 + (wordCount * 0.5) - (fillerWords * 5)));
  const score = Math.round(baseScore + (Math.random() * 10 - 5));

  const strengths = [];
  const weaknesses = [];

  if (wordCount > 40) strengths.push('Provided a detailed and thorough response');
  if (wordCount > 25) strengths.push('Good response length showing engagement');
  if (fillerWords < 3) strengths.push('Minimal use of filler words');
  if (answer.includes('?')) strengths.push('Shows curiosity by asking questions');
  if (answer.length > 100) strengths.push('Well-elaborated thoughts');

  if (wordCount < 20) weaknesses.push('Response is too brief — try to elaborate more');
  if (fillerWords > 3) weaknesses.push('Too many filler words detected — practice pausing instead');
  if (!answer.includes('.')) weaknesses.push('Consider using complete sentences for clarity');
  if (wordCount < 10) weaknesses.push('Very short answer suggests low confidence');

  if (strengths.length === 0) strengths.push('Showed willingness to engage with the prompt');
  if (weaknesses.length === 0) weaknesses.push('Could add more specific examples to strengthen your response');

  const suggestions = [
    'Use the STAR method (Situation, Task, Action, Result) to structure behavioral answers.',
    'Practice pausing briefly instead of using filler words.',
    'Include specific examples or metrics to make your points more impactful.',
    'Maintain a conversational yet professional tone.',
    'Take a breath before responding to collect your thoughts.',
  ];

  return {
    score: Math.max(0, Math.min(100, score)),
    strengths,
    weaknesses,
    suggestions: suggestions.slice(0, 3),
    metrics: {
      wordCount,
      fillerWords,
      clarityScore: Math.round(Math.min(100, 70 + wordCount * 0.3 - fillerWords * 4)),
      speakingSpeed: wordCount > 30 ? 'Moderate' : 'Slow',
    },
  };
}

export default function PracticePage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'interview';
  const config = modeConfig[mode] || modeConfig.interview;
  const questions = questionBank[mode] || questionBank.interview;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Timer
  useEffect(() => {
    if (!isTimerRunning || isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning, isSubmitted, timeLeft]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setIsLoading(true);
    try {
      const result = await analyzeResponse(answer, mode);
      // Map backend response to component format
      const fb = {
        score: result.confidenceScore || result.score || 0,
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        suggestions: result.suggestions || [],
        metrics: {
          wordCount: result.metrics?.wordCount || 0,
          fillerWords: result.metrics?.fillerWords || 0,
          clarityScore: result.metrics?.clarityScore || 0,
          speakingSpeed: typeof result.metrics?.estimatedWPM === 'number'
            ? `${result.metrics.estimatedWPM} wpm`
            : result.metrics?.speakingSpeed || result.metrics?.estimatedWPM || 'N/A',
        },
      };
      setFeedback(fb);
      setIsSubmitted(true);
      setIsTimerRunning(false);
    } catch (err) {
      // Fallback to mock
      const fb = generateMockFeedback(answer, mode);
      setFeedback(fb);
      setIsSubmitted(true);
      setIsTimerRunning(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
    setAnswer('');
    setIsSubmitted(false);
    setFeedback(null);
    setTimeLeft(120);
    setIsTimerRunning(true);
  };

  const handleReset = () => {
    setAnswer('');
    setIsSubmitted(false);
    setFeedback(null);
    setTimeLeft(120);
    setIsTimerRunning(true);
  };

  const timerColor = timeLeft > 60 ? 'text-emerald-400' : timeLeft > 30 ? 'text-amber-400' : 'text-rose-400';
  const timerBg = timeLeft > 60 ? 'bg-emerald-500/10 border-emerald-500/20' : timeLeft > 30 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20';

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <config.icon className="w-5 h-5 text-primary-400" />
              <span className="text-sm font-medium text-primary-300/70">
                {config.label} Practice
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
              Question {currentQuestion + 1}{' '}
              <span className="text-surface-200/30 font-normal">/ {questions.length}</span>
            </h1>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${timerBg}`}>
            <Clock className={`w-4 h-4 ${timerColor}`} />
            <span className={`text-lg font-mono font-bold ${timerColor}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 sm:p-8 mb-6"
        >
          <div className="flex items-start gap-3 mb-1">
            <div className="p-2 rounded-lg bg-primary-500/10">
              <Volume2 className="w-4 h-4 text-primary-400" />
            </div>
            <p className="text-lg sm:text-xl text-white font-medium leading-relaxed">
              {questions[currentQuestion]}
            </p>
          </div>
        </motion.div>

        {/* Answer Area */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
            >
              {/* Textarea */}
              <div className="relative mb-4">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your response here... Be detailed, natural, and confident."
                  className="w-full h-44 sm:h-52 rounded-2xl bg-surface-900/60 backdrop-blur-xl border border-white/[0.06] p-5 text-white placeholder:text-surface-200/30 text-sm sm:text-base leading-relaxed focus:border-primary-500/40 focus:outline-none focus:ring-0 transition-colors resize-none"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-3">
                  <span className="text-xs text-surface-200/30">
                    {answer.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-2 rounded-lg transition-all ${
                      isRecording
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-white/5 text-surface-200/40 hover:text-white hover:bg-white/10'
                    }`}
                    title={isRecording ? 'Stop recording' : 'Start recording'}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-surface-200/50 hover:text-white hover:bg-white/5 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || isLoading}
                  className={`btn-primary flex items-center gap-2 text-sm py-3 px-6 ${
                    !answer.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span>{isLoading ? 'Analyzing...' : 'Analyze Response'}</span>
                  {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          ) : (
            /* ==================== FEEDBACK SECTION ==================== */
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Score + Metrics Row */}
              <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
                {/* Score Circle */}
                <Card hover={false}>
                  <div className="p-6 sm:p-8 flex flex-col items-center justify-center">
                    <ScoreCircle score={feedback.score} size={180} />
                  </div>
                </Card>

                {/* Quick Metrics */}
                <Card hover={false}>
                  <div className="p-6 sm:p-8">
                    <h3 className="text-sm font-semibold text-surface-200/50 tracking-wide uppercase mb-5">
                      Response Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Word Count', value: feedback.metrics.wordCount, color: 'text-primary-400' },
                        { label: 'Filler Words', value: feedback.metrics.fillerWords, color: feedback.metrics.fillerWords > 3 ? 'text-rose-400' : 'text-emerald-400' },
                        { label: 'Clarity Score', value: `${feedback.metrics.clarityScore}%`, color: 'text-accent-400' },
                        { label: 'Pacing', value: feedback.metrics.speakingSpeed, color: 'text-amber-400' },
                      ].map((m, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]"
                        >
                          <span className={`text-xl font-bold ${m.color}`}>{m.value}</span>
                          <p className="text-xs text-surface-200/40 mt-1">{m.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card hover={false} delay={0.2}>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-sm font-semibold text-emerald-400">Strengths</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {feedback.strengths.map((s, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="flex items-start gap-2 text-sm text-surface-200/70"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                          {s}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </Card>

                <Card hover={false} delay={0.3}>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <h3 className="text-sm font-semibold text-amber-400">Areas to Improve</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {feedback.weaknesses.map((w, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-start gap-2 text-sm text-surface-200/70"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                          {w}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>

              {/* AI Suggestions */}
              <Card hover={false} delay={0.4}>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary-400" />
                    <h3 className="text-sm font-semibold text-primary-400">AI Coaching Tips</h3>
                  </div>
                  <div className="space-y-3">
                    {feedback.suggestions.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-primary-500/[0.04] border border-primary-500/10"
                      >
                        <TrendingUp className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-surface-200/70 leading-relaxed">{s}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              >
                <button
                  onClick={handleNextQuestion}
                  className="btn-primary flex items-center gap-2 text-sm py-3 px-6"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/dashboard"
                  className="btn-secondary flex items-center gap-2 text-sm py-3 px-6 no-underline"
                >
                  View Full Dashboard
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-10"
        >
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentQuestion(i);
                handleReset();
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentQuestion
                  ? 'w-6 bg-primary-400'
                  : 'bg-surface-200/20 hover:bg-surface-200/40'
              }`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
