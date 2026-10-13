import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  BarChart3,
  MessageSquare,
  Target,
  ChevronRight,
  Star,
} from 'lucide-react';
import Card from '../components/Card';

const features = [
  {
    icon: Brain,
    title: 'AI Behavioral Analysis',
    description: 'Advanced NLP engine analyzes your speech patterns, filler words, and confidence indicators in real-time.',
    color: 'primary',
  },
  {
    icon: BarChart3,
    title: 'Real-time Metrics',
    description: 'Track speaking speed, clarity score, pause patterns, and filler word frequency with precision dashboards.',
    color: 'accent',
  },
  {
    icon: MessageSquare,
    title: 'Smart Coaching',
    description: 'Receive personalized, context-aware feedback that adapts its tone based on your confidence level.',
    color: 'emerald',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Visualize your improvement over time with detailed progress charts and practice streaks.',
    color: 'primary',
  },
];

const stats = [
  { value: '10K+', label: 'Practice Sessions' },
  { value: '94%', label: 'Improvement Rate' },
  { value: '4.9', label: 'User Rating', icon: Star },
  { value: '50+', label: 'Scenarios' },
];

const steps = [
  { step: '01', title: 'Choose Scenario', desc: 'Select from interviews, public speaking, social situations, or networking.' },
  { step: '02', title: 'Practice & Respond', desc: 'Answer realistic prompts while our AI monitors your communication patterns.' },
  { step: '03', title: 'Get AI Feedback', desc: 'Receive detailed behavioral analysis with actionable improvement suggestions.' },
  { step: '04', title: 'Track Growth', desc: 'Monitor your progress with data-driven dashboards and streak tracking.' },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary-500/15 blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent-500/15 blur-[120px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-600/5 blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-semibold text-primary-300 tracking-wide">
              AI-Powered Social Anxiety Coach
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 text-balance font-display"
          >
            Your AI{' '}
            <span className="gradient-text">Behavioral Mirror</span>
            <br />
            <span className="text-surface-200/80">for Confident Communication</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-surface-200/50 leading-relaxed mb-10"
          >
            Practice real-world social scenarios with AI-driven behavioral analysis.
            Get instant feedback on your confidence, clarity, and communication patterns.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/scenarios"
              className="btn-primary inline-flex items-center gap-2.5 text-base py-3.5 px-8 no-underline group"
            >
              <span>Start Practicing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dashboard"
              className="btn-secondary inline-flex items-center gap-2.5 text-base py-3.5 px-8 no-underline"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Dashboard</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</span>
                  {stat.icon && <stat.icon className="w-4 h-4 text-amber-400 fill-amber-400" />}
                </div>
                <span className="text-xs text-surface-200/40 font-medium tracking-wide mt-1 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-primary-400 tracking-widest uppercase block mb-3">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 font-display">
              Everything you need to{' '}
              <span className="gradient-text">build confidence</span>
            </h2>
            <p className="text-surface-200/50 max-w-lg mx-auto">
              Our AI engine goes beyond simple advice — it analyzes your behavioral patterns
              and provides data-driven coaching.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feat, i) => (
              <Card key={i} delay={i * 0.1} glowColor={feat.color}>
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-5">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                      bg-gradient-to-br
                      ${feat.color === 'primary' ? 'from-primary-500/20 to-primary-600/10' : ''}
                      ${feat.color === 'accent' ? 'from-accent-500/20 to-accent-600/10' : ''}
                      ${feat.color === 'emerald' ? 'from-emerald-500/20 to-emerald-600/10' : ''}
                    `}>
                      <feat.icon className={`w-6 h-6 ${
                        feat.color === 'primary' ? 'text-primary-400' :
                        feat.color === 'accent' ? 'text-accent-400' :
                        'text-emerald-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-surface-200/50 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase block mb-3">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 font-display">
              Four steps to{' '}
              <span className="gradient-text-emerald">confident you</span>
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Card key={i} delay={i * 0.12} glowColor={i % 2 === 0 ? 'primary' : 'emerald'}>
                <div className="p-6">
                  <span className="text-4xl font-bold text-primary-500/20 font-display block mb-4">
                    {step.step}
                  </span>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-surface-200/50 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden p-10 sm:p-16"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-surface-900 to-accent-600/20" />
            <div className="absolute inset-0 bg-grid opacity-50" />
            <div className="absolute inset-px rounded-3xl border border-white/[0.08]" />

            <div className="relative z-10">
              <Shield className="w-12 h-12 text-primary-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 font-display">
                Ready to transform your confidence?
              </h2>
              <p className="text-surface-200/50 max-w-lg mx-auto mb-8">
                Join thousands who've overcome social anxiety with AI-driven behavioral coaching.
              </p>
              <Link
                to="/scenarios"
                className="btn-primary inline-flex items-center gap-2.5 text-base py-3.5 px-8 no-underline group"
              >
                <span>Begin Your Journey</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-400" />
            <span className="text-sm font-semibold text-white">MindMirror</span>
          </div>
          <p className="text-xs text-surface-200/30">
            © 2026 AI Behavioral Mirror. Built with ❤️ for confident communication.
          </p>
        </div>
      </footer>
    </div>
  );
}
