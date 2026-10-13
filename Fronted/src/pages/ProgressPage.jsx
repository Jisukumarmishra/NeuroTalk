import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend,
} from 'recharts';
import {
  TrendingUp,
  Flame,
  Calendar,
  Target,
  Award,
  Clock,
  ArrowUpRight,
  BarChart3,
  Zap,
  CheckCircle2,
  Star,
} from 'lucide-react';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';

// ==================== MOCK DATA ====================
const weeklyData = [
  { day: 'Mon', score: 62, sessions: 2 },
  { day: 'Tue', score: 68, sessions: 3 },
  { day: 'Wed', score: 65, sessions: 1 },
  { day: 'Thu', score: 72, sessions: 4 },
  { day: 'Fri', score: 78, sessions: 3 },
  { day: 'Sat', score: 75, sessions: 2 },
  { day: 'Sun', score: 82, sessions: 5 },
];

const monthlyData = [
  { month: 'Oct', interview: 50, speaking: 35, social: 45, networking: 40 },
  { month: 'Nov', interview: 55, speaking: 42, social: 52, networking: 48 },
  { month: 'Dec', interview: 62, speaking: 50, social: 58, networking: 52 },
  { month: 'Jan', interview: 68, speaking: 55, social: 65, networking: 60 },
  { month: 'Feb', interview: 75, speaking: 62, social: 70, networking: 65 },
  { month: 'Mar', interview: 82, speaking: 68, social: 76, networking: 72 },
];

const scenarioBreakdown = [
  { name: 'Interview', score: 82, sessions: 24, best: 92, color: '#818cf8', icon: '💼' },
  { name: 'Speaking', score: 68, sessions: 18, best: 78, color: '#f472b6', icon: '🎤' },
  { name: 'Social', score: 76, sessions: 20, best: 85, color: '#34d399', icon: '💬' },
  { name: 'Networking', score: 72, sessions: 15, best: 80, color: '#a78bfa', icon: '🤝' },
];

const milestones = [
  { label: 'First Session', date: 'Oct 5', done: true },
  { label: 'Score 50+', date: 'Oct 18', done: true },
  { label: 'Score 60+', date: 'Nov 12', done: true },
  { label: 'Score 70+', date: 'Jan 8', done: true },
  { label: 'Score 80+', date: 'Mar 20', done: true },
  { label: 'Score 90+', date: '—', done: false },
];

const streakWeeks = [
  [1,1,0,1,1,0,0],
  [1,1,1,0,1,1,0],
  [1,1,1,1,0,1,1],
  [1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1],
];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-900/95 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-surface-200/50 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold flex items-center gap-2" style={{ color: p.color || p.stroke }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.stroke }} />
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
};

export default function ProgressPage() {
  const totalSessions = scenarioBreakdown.reduce((a, b) => a + b.sessions, 0);
  const avgScore = Math.round(scenarioBreakdown.reduce((a, b) => a + b.score, 0) / scenarioBreakdown.length);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 bg-dots opacity-20 pointer-events-none" />
      <div className="fixed top-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/6 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-40 -left-40 w-80 h-80 rounded-full bg-primary-500/6 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase block mb-2">
            Your Journey
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display mb-2">
            Progress <span className="gradient-text-emerald">Tracker</span>
          </h1>
          <p className="text-surface-200/50 text-sm">
            Track your growth, maintain your streak, and celebrate milestones.
          </p>
        </motion.div>

        {/* ==================== ROW 1: Summary Metrics ==================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <MetricCard
            icon={BarChart3}
            label="Total Sessions"
            value={totalSessions}
            trend="up"
            trendValue="+12"
            color="primary"
            delay={0}
          />
          <MetricCard
            icon={TrendingUp}
            label="Average Score"
            value={avgScore}
            unit="%"
            trend="up"
            trendValue="+8%"
            color="emerald"
            delay={0.1}
          />
          <MetricCard
            icon={Flame}
            label="Current Streak"
            value="12"
            unit="days"
            trend="up"
            trendValue="Best!"
            color="amber"
            delay={0.2}
          />
          <MetricCard
            icon={Award}
            label="Best Score"
            value="92"
            unit="%"
            trend="up"
            trendValue="Interview"
            color="accent"
            delay={0.3}
          />
        </div>

        {/* ==================== ROW 2: Weekly Chart + Streak Heatmap ==================== */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mb-6">
          {/* Weekly Chart */}
          <Card hover={false} delay={0.1}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-white">This Week</h3>
                  <p className="text-xs text-surface-200/40 mt-1">Daily confidence scores</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">+20 pts this week</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="weekGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis domain={[50, 90]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      name="Score"
                      stroke="#34d399"
                      strokeWidth={2.5}
                      fill="url(#weekGradient)"
                      dot={{ fill: '#34d399', r: 4, strokeWidth: 2, stroke: '#0f172a' }}
                      activeDot={{ fill: '#6ee7b7', r: 6, strokeWidth: 2, stroke: '#0f172a' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Practice Streak Heatmap */}
          <Card hover={false} delay={0.2}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-semibold text-white">Practice Streak</h3>
              </div>
              <p className="text-xs text-surface-200/40 mb-5">Last 5 weeks activity</p>

              {/* Heatmap Grid */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-[10px] text-surface-200/30 mb-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} className="w-8 h-4 flex items-center justify-center">{d}</div>
                  ))}
                </div>
                {streakWeeks.map((week, wi) => (
                  <motion.div
                    key={wi}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + wi * 0.05 }}
                    className="flex items-center gap-1"
                  >
                    {week.map((day, di) => (
                      <div
                        key={di}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          day
                            ? 'bg-emerald-500/30 border border-emerald-500/20 hover:bg-emerald-500/50'
                            : 'bg-white/[0.03] border border-white/[0.04]'
                        }`}
                      />
                    ))}
                  </motion.div>
                ))}
              </div>

              {/* Streak stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">
                  <span className="text-lg font-bold text-amber-400">12</span>
                  <p className="text-[10px] text-surface-200/40">Current Streak</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
                  <span className="text-lg font-bold text-emerald-400">18</span>
                  <p className="text-[10px] text-surface-200/40">Best Streak</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ==================== ROW 3: Scenario Performance + Multi-Line ==================== */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Scenario Breakdown Cards */}
          <Card hover={false} delay={0.1}>
            <div className="p-6">
              <h3 className="text-base font-semibold text-white mb-2">Scenario Performance</h3>
              <p className="text-xs text-surface-200/40 mb-5">Breakdown by practice type</p>

              <div className="space-y-4">
                {scenarioBreakdown.map((scenario, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{scenario.icon}</span>
                        <span className="text-sm font-medium text-white">{scenario.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-surface-200/40">{scenario.sessions} sessions</span>
                        <span className="font-bold" style={{ color: scenario.color }}>{scenario.score}%</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${scenario.score}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: scenario.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>

          {/* Monthly Trend Multi-Line */}
          <Card hover={false} delay={0.2}>
            <div className="p-6">
              <h3 className="text-base font-semibold text-white mb-2">Monthly Trends</h3>
              <p className="text-xs text-surface-200/40 mb-5">Scenario scores over 6 months</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis domain={[30, 90]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span className="text-xs text-surface-200/60">{value}</span>}
                    />
                    <Line type="monotone" dataKey="interview" name="Interview" stroke="#818cf8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="speaking" name="Speaking" stroke="#f472b6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="social" name="Social" stroke="#34d399" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="networking" name="Networking" stroke="#a78bfa" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* ==================== ROW 4: Milestones ==================== */}
        <Card hover={false} delay={0.3}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-primary-400" />
              <h3 className="text-base font-semibold text-white">Milestone Timeline</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-0 sm:justify-between">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Connector line (except first) */}
                  {i > 0 && (
                    <div className={`hidden sm:block absolute top-3 -left-full w-full h-0.5 ${
                      m.done ? 'bg-primary-400/30' : 'bg-white/[0.06]'
                    }`} />
                  )}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
                    m.done
                      ? 'bg-primary-500/20 border border-primary-400/30'
                      : 'bg-white/[0.04] border border-white/[0.08]'
                  }`}>
                    {m.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-surface-200/20" />
                    )}
                  </div>
                  <p className={`text-xs font-medium ${m.done ? 'text-white' : 'text-surface-200/30'}`}>
                    {m.label}
                  </p>
                  <p className="text-[10px] text-surface-200/30 mt-0.5">{m.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
