import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Mic,
  MessageCircle,
  Users,
  ArrowRight,
  Clock,
  Star,
  BarChart3,
} from 'lucide-react';
import Card from '../components/Card';

const scenarios = [
  {
    id: 'interview',
    title: 'Job Interview',
    description: 'Practice answering tough interview questions with confidence. Get feedback on your articulation, structure, and persuasiveness.',
    icon: Briefcase,
    color: 'primary',
    gradient: 'from-primary-500 to-primary-700',
    bgGlow: 'bg-primary-500/10',
    difficulty: 'Intermediate',
    duration: '5-10 min',
    rating: 4.8,
    questions: 12,
  },
  {
    id: 'stage',
    title: 'Public Speaking',
    description: 'Overcome stage fright by practicing speeches and presentations. Build composure, pacing, and audience engagement skills.',
    icon: Mic,
    color: 'accent',
    gradient: 'from-accent-500 to-accent-700',
    bgGlow: 'bg-accent-500/10',
    difficulty: 'Advanced',
    duration: '10-15 min',
    rating: 4.9,
    questions: 8,
  },
  {
    id: 'social',
    title: 'Social Conversation',
    description: 'Practice everyday social interactions, small talk, and conversations. Build natural conversational flow and reduce awkwardness.',
    icon: MessageCircle,
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-700',
    bgGlow: 'bg-emerald-500/10',
    difficulty: 'Beginner',
    duration: '3-5 min',
    rating: 4.7,
    questions: 15,
  },
  {
    id: 'networking',
    title: 'Networking',
    description: 'Master professional networking situations. Practice introductions, elevator pitches, and professional relationship building.',
    icon: Users,
    color: 'primary',
    gradient: 'from-violet-500 to-purple-700',
    bgGlow: 'bg-violet-500/10',
    difficulty: 'Intermediate',
    duration: '5-8 min',
    rating: 4.6,
    questions: 10,
  },
];

const difficultyColors = {
  Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Advanced: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

export default function ScenariosPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-40 -right-40 w-80 h-80 rounded-full bg-primary-500/8 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-500/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-primary-400 tracking-widest uppercase block mb-3">
            Choose Your Challenge
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 font-display">
            Practice <span className="gradient-text">Scenarios</span>
          </h1>
          <p className="text-surface-200/50 max-w-lg mx-auto">
            Select a scenario that matches the social situation you want to improve.
            Each comes with curated questions and targeted AI feedback.
          </p>
        </motion.div>

        {/* Scenario Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {scenarios.map((scenario, i) => (
            <Card
              key={scenario.id}
              delay={i * 0.1}
              glowColor={scenario.color}
              onClick={() => navigate(`/practice?mode=${scenario.id}`)}
            >
              <div className="p-6 sm:p-8">
                {/* Top row: Icon + Difficulty */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scenario.gradient} flex items-center justify-center shadow-lg`}>
                    <scenario.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${difficultyColors[scenario.difficulty]}`}>
                    {scenario.difficulty}
                  </span>
                </div>

                {/* Title + Description */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {scenario.title}
                </h3>
                <p className="text-sm text-surface-200/50 leading-relaxed mb-6">
                  {scenario.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 mb-5 text-xs text-surface-200/40">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{scenario.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>{scenario.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-amber-400">{scenario.rating}</span>
                  </div>
                </div>

                {/* Action area */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <span className="text-sm font-medium text-primary-300/70">
                    Start practicing
                  </span>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-primary-600/20 transition-all">
                    <ArrowRight className="w-4 h-4 text-primary-400" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
