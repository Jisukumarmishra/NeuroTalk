import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricCard({
  icon: Icon,
  label,
  value,
  unit = '',
  trend = null, // 'up' | 'down' | 'neutral'
  trendValue = '',
  color = 'primary',
  delay = 0,
}) {
  const colorMap = {
    primary: {
      iconBg: 'from-primary-500/20 to-primary-600/10',
      iconColor: 'text-primary-400',
      border: 'border-primary-500/10',
      glow: 'group-hover:shadow-primary-500/10',
    },
    accent: {
      iconBg: 'from-accent-500/20 to-accent-600/10',
      iconColor: 'text-accent-400',
      border: 'border-accent-500/10',
      glow: 'group-hover:shadow-accent-500/10',
    },
    emerald: {
      iconBg: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
      border: 'border-emerald-500/10',
      glow: 'group-hover:shadow-emerald-500/10',
    },
    amber: {
      iconBg: 'from-amber-500/20 to-amber-600/10',
      iconColor: 'text-amber-400',
      border: 'border-amber-500/10',
      glow: 'group-hover:shadow-amber-500/10',
    },
    rose: {
      iconBg: 'from-rose-500/20 to-rose-600/10',
      iconColor: 'text-rose-400',
      border: 'border-rose-500/10',
      glow: 'group-hover:shadow-rose-500/10',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  const trendConfig = {
    up: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    down: { icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    neutral: { icon: Minus, color: 'text-surface-200/40', bg: 'bg-white/5' },
  };

  const trendInfo = trend ? trendConfig[trend] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`
        group relative rounded-2xl overflow-hidden p-5
        bg-surface-900/50 backdrop-blur-xl
        border ${c.border} border-white/[0.04]
        shadow-lg shadow-black/10
        hover:border-white/[0.1]
        transition-all duration-500
        hover:-translate-y-1 hover:shadow-xl ${c.glow}
      `}
    >
      {/* Highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.iconColor}`} />
        </div>

        {/* Trend */}
        {trendInfo && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trendInfo.bg}`}>
            <trendInfo.icon className={`w-3 h-3 ${trendInfo.color}`} />
            {trendValue && (
              <span className={`text-xs font-semibold ${trendInfo.color}`}>
                {trendValue}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-white tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-sm text-surface-200/40 font-medium">
              {unit}
            </span>
          )}
        </div>
        <p className="text-xs text-surface-200/50 font-medium mt-1 tracking-wide">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
