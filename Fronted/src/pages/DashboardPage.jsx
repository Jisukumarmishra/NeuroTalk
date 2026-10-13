import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import {
  Activity,
  Zap,
  MessageSquare,
  Eye,
  Timer,
  TrendingUp,
  Lightbulb,
  Target,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Award,
  BookOpen,
  Flame,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import ScoreCircle from '../components/ScoreCircle';
import MetricCard from '../components/MetricCard';
import SuggestionBox from '../components/SuggestionBox';
import Card from '../components/Card';

// ==================== MOCK DATA ====================
const progressData = [
  { week: 'Week 1', score: 42, sessions: 3 },
  { week: 'Week 2', score: 48, sessions: 5 },
  { week: 'Week 3', score: 55, sessions: 4 },
  { week: 'Week 4', score: 52, sessions: 2 },
  { week: 'Week 5', score: 63, sessions: 6 },
  { week: 'Week 6', score: 68, sessions: 5 },
  { week: 'Week 7', score: 72, sessions: 7 },
  { week: 'Week 8', score: 78, sessions: 6 },
];

const scenarioData = [
  { name: 'Interview', score: 82, fill: '#818cf8' },
  { name: 'Speaking', score: 65, fill: '#f472b6' },
  { name: 'Social', score: 74, fill: '#34d399' },
  { name: 'Networking', score: 70, fill: '#a78bfa' },
];

const radarData = [
  { skill: 'Clarity', A: 78, fullMark: 100 },
  { skill: 'Confidence', A: 72, fullMark: 100 },
  { skill: 'Fluency', A: 65, fullMark: 100 },
  { skill: 'Structure', A: 80, fullMark: 100 },
  { skill: 'Engagement', A: 70, fullMark: 100 },
  { skill: 'Vocabulary', A: 75, fullMark: 100 },
];

const strengths = [
  'Structured response with clear beginning, middle, and end',
  'Strong vocabulary with domain-specific terminology',
  'Good use of examples to support your points',
  'Maintained consistent pacing throughout',
];

const weaknesses = [
  'Occasional filler words ("um", "like") detected',
  'Some answers could benefit from more specificity',
  'Tendency to rush through conclusions',
];

const aiSuggestions = [
  'Practice the 3-point structure: State your point, support it, then summarize.',
  'Replace filler words with brief pauses — silence conveys confidence.',
  'Record yourself and listen back to identify unconscious verbal habits.',
  'Use the STAR method (Situation, Task, Action, Result) for interview scenarios.',
];

const nextSteps = [
  {
    step: 1,
    title: 'Filler Word Challenge',
    desc: 'Speak for 2 minutes on any topic without using any filler words.',
    status: 'current',
  },
  {
    step: 2,
    title: 'Structured Response Drill',
    desc: 'Practice answering 5 interview questions using the STAR method.',
    status: 'upcoming',
  },
  {
    step: 3,
    title: 'Impromptu Speaking',
    desc: 'Give a 1-minute speech on a random topic with zero preparation.',
    status: 'upcoming',
  },
  {
    step: 4,
    title: 'Mock Interview Session',
    desc: 'Complete a full 30-minute mock interview with AI feedback.',
    status: 'locked',
  },
];

const recentSessions = [
  { date: 'Today', scenario: 'Job Interview', score: 78, change: '+5' },
  { date: 'Yesterday', scenario: 'Public Speaking', score: 65, change: '+3' },
  { date: 'Mar 22', scenario: 'Social', score: 74, change: '+8' },
  { date: 'Mar 21', scenario: 'Networking', score: 70, change: '+2' },
];

const stepStatusStyles = {
  current: {
    dot: 'bg-primary-400 ring-4 ring-primary-400/20',
    line: 'bg-gradient-to-b from-primary-400 to-primary-400/0',
    bg: 'bg-primary-500/[0.06] border-primary-500/20',
    title: 'text-white',
    badge: 'bg-primary-500/15 text-primary-400 border-primary-500/25',
  },
  upcoming: {
    dot: 'bg-surface-200/30',
    line: 'bg-surface-200/10',
    bg: 'bg-transparent border-white/[0.04]',
    title: 'text-surface-200/70',
    badge: 'bg-white/5 text-surface-200/40 border-white/10',
  },
  locked: {
    dot: 'bg-surface-200/15',
    line: 'bg-transparent',
    bg: 'bg-transparent border-white/[0.03] opacity-60',
    title: 'text-surface-200/40',
    badge: 'bg-white/[0.03] text-surface-200/25 border-white/[0.06]',
  },
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-900/95 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-surface-200/50 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}{p.name === 'Score' || p.name === 'score' ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed top-20 -left-40 w-[500px] h-[500px] rounded-full bg-primary-600/8 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-20 -right-40 w-[400px] h-[400px] rounded-full bg-accent-600/6 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <span className="text-xs font-semibold text-primary-400 tracking-widest uppercase">
                Behavioral Dashboard
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
              Your Performance <span className="gradient-text">Overview</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">12 Day Streak</span>
          </div>
        </motion.div>

        {/* ==================== ROW 1: Score + Strengths/Weaknesses ==================== */}
        <div className="grid lg:grid-cols-[340px_1fr] gap-6 mb-6">
          {/* Big Score Card */}
          <Card hover={false} className="flex items-center justify-center">
            <div className="p-8 sm:p-10 text-center">
              <ScoreCircle score={78} size={210} label="Overall Score" />
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="mt-6 flex items-center justify-center gap-2 text-emerald-400"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-semibold">+12% from last week</span>
              </motion.div>
            </div>
          </Card>

          {/* Strengths & Weaknesses */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card hover={false} delay={0.1}>
              <div className="p-6 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-emerald-400 tracking-wide">
                    Strengths
                  </h3>
                </div>
                <ul className="space-y-3">
                  {strengths.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="flex items-start gap-2.5 text-sm text-surface-200/65 leading-relaxed"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Weaknesses */}
            <Card hover={false} delay={0.2}>
              <div className="p-6 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-amber-400 tracking-wide">
                    Areas to Improve
                  </h3>
                </div>
                <ul className="space-y-3">
                  {weaknesses.map((w, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="flex items-start gap-2.5 text-sm text-surface-200/65 leading-relaxed"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      {w}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* ==================== ROW 2: Metric Cards ==================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <MetricCard
            icon={Activity}
            label="Speaking Speed"
            value="142"
            unit="wpm"
            trend="up"
            trendValue="+8%"
            color="primary"
            delay={0}
          />
          <MetricCard
            icon={Timer}
            label="Pause Count"
            value="4"
            unit="avg"
            trend="down"
            trendValue="-2"
            color="emerald"
            delay={0.1}
          />
          <MetricCard
            icon={MessageSquare}
            label="Filler Words"
            value="3"
            unit="per min"
            trend="down"
            trendValue="-40%"
            color="amber"
            delay={0.2}
          />
          <MetricCard
            icon={Eye}
            label="Clarity Score"
            value="86"
            unit="%"
            trend="up"
            trendValue="+5"
            color="accent"
            delay={0.3}
          />
        </div>

        {/* ==================== ROW 3: Charts ==================== */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mb-6">
          {/* Progress Chart */}
          <Card hover={false} delay={0.1}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-white">Progress Over Time</h3>
                  <p className="text-xs text-surface-200/40 mt-1">Confidence score trend</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/15">
                  <TrendingUp className="w-3.5 h-3.5 text-primary-400" />
                  <span className="text-xs font-semibold text-primary-400">+36% overall</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(99,102,241,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <YAxis
                      domain={[30, 90]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      name="Score"
                      stroke="#818cf8"
                      strokeWidth={2.5}
                      fill="url(#scoreGradient)"
                      dot={{ fill: '#818cf8', r: 4, strokeWidth: 2, stroke: '#0f172a' }}
                      activeDot={{ fill: '#a5b4fc', r: 6, strokeWidth: 2, stroke: '#0f172a' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Radar Chart - Skills Breakdown */}
          <Card hover={false} delay={0.2}>
            <div className="p-6">
              <h3 className="text-base font-semibold text-white mb-2">Skills Breakdown</h3>
              <p className="text-xs text-surface-200/40 mb-4">Your communication competencies</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke="rgba(99,102,241,0.1)" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#818cf8"
                      fill="#818cf8"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* ==================== ROW 4: Scenario Performance + Recent Sessions ==================== */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 mb-6">
          {/* Scenario Performance */}
          <Card hover={false} delay={0.1}>
            <div className="p-6">
              <h3 className="text-base font-semibold text-white mb-2">Scenario Performance</h3>
              <p className="text-xs text-surface-200/40 mb-6">Score by practice type</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarioData} barSize={32}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(99,102,241,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="score"
                      name="Score"
                      radius={[6, 6, 0, 0]}
                    >
                      {scenarioData.map((entry, i) => (
                        <rect key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Recent Sessions */}
          <Card hover={false} delay={0.2}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-white">Recent Sessions</h3>
                  <p className="text-xs text-surface-200/40 mt-1">Your latest practice results</p>
                </div>
                <Calendar className="w-4 h-4 text-surface-200/30" />
              </div>
              <div className="space-y-3">
                {recentSessions.map((session, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{session.scenario}</p>
                        <p className="text-xs text-surface-200/40">{session.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white">{session.score}%</span>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        {session.change}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ==================== ROW 5: AI Suggestions + Next Steps ==================== */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* AI Suggestions */}
          <SuggestionBox
            title="AI Coaching Suggestions"
            icon={Lightbulb}
            items={aiSuggestions}
            color="primary"
            delay={0.1}
          />

          {/* Next Steps Roadmap */}
          <Card hover={false} delay={0.2}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500/20 to-accent-600/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-accent-400" />
                </div>
                <h3 className="text-sm font-semibold text-accent-400 tracking-wide">
                  Next Steps Plan
                </h3>
              </div>

              <div className="space-y-0">
                {nextSteps.map((item, i) => {
                  const style = stepStatusStyles[item.status];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="relative flex gap-4"
                    >
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${style.dot} flex-shrink-0 mt-1`} />
                        {i < nextSteps.length - 1 && (
                          <div className={`w-0.5 flex-1 my-1 ${style.line}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pb-5 p-3 rounded-xl border ${style.bg} mb-2`}>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-semibold ${style.title}`}>
                            {item.title}
                          </h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.badge}`}>
                            {item.status === 'current' ? 'In Progress' : item.status === 'upcoming' ? 'Up Next' : 'Locked'}
                          </span>
                        </div>
                        <p className="text-xs text-surface-200/45 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* ==================== ACHIEVEMENTS BAR ==================== */}
        <Card hover={false} delay={0.3}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-semibold text-white">Achievements</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { emoji: '🔥', title: 'Streak Master', desc: '12-day streak', unlocked: true },
                { emoji: '🎯', title: 'First Practice', desc: 'Completed first session', unlocked: true },
                { emoji: '🏆', title: 'Score 80+', desc: 'Hit 80% confidence', unlocked: false },
                { emoji: '💎', title: 'Perfect Week', desc: '7 sessions in a week', unlocked: false },
              ].map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    a.unlocked
                      ? 'bg-amber-500/[0.04] border-amber-500/15'
                      : 'bg-white/[0.02] border-white/[0.04] opacity-50'
                  }`}
                >
                  <span className="text-2xl block mb-2">{a.emoji}</span>
                  <p className="text-xs font-semibold text-white">{a.title}</p>
                  <p className="text-[10px] text-surface-200/40 mt-0.5">{a.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
