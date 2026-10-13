import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight } from 'lucide-react';

export default function SuggestionBox({
  title = 'AI Suggestions',
  icon: Icon = Lightbulb,
  items = [],
  color = 'primary',
  delay = 0,
}) {
  const colorMap = {
    primary: {
      accent: 'text-primary-400',
      bg: 'from-primary-500/15 to-primary-600/5',
      border: 'border-primary-500/15',
      dot: 'bg-primary-400',
      iconBg: 'from-primary-500/20 to-primary-600/10',
    },
    accent: {
      accent: 'text-accent-400',
      bg: 'from-accent-500/15 to-accent-600/5',
      border: 'border-accent-500/15',
      dot: 'bg-accent-400',
      iconBg: 'from-accent-500/20 to-accent-600/10',
    },
    emerald: {
      accent: 'text-emerald-400',
      bg: 'from-emerald-500/15 to-emerald-600/5',
      border: 'border-emerald-500/15',
      dot: 'bg-emerald-400',
      iconBg: 'from-emerald-500/20 to-emerald-600/10',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`
        rounded-2xl overflow-hidden
        bg-surface-900/50 backdrop-blur-xl
        border border-white/[0.06]
        shadow-xl shadow-black/20
      `}
    >
      {/* Header */}
      <div className={`px-6 py-4 bg-gradient-to-r ${c.bg} border-b ${c.border}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.iconBg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${c.accent}`} />
          </div>
          <h3 className={`text-sm font-semibold ${c.accent} tracking-wide`}>
            {title}
          </h3>
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.1 * (index + 1), duration: 0.4 }}
            className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors duration-300"
          >
            <div className="mt-1.5 flex-shrink-0">
              <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            </div>
            <p className="text-sm text-surface-200/70 leading-relaxed flex-1 group-hover:text-surface-200/90 transition-colors">
              {item}
            </p>
            <ChevronRight className="w-4 h-4 text-surface-200/20 group-hover:text-surface-200/40 mt-0.5 flex-shrink-0 transition-colors" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
