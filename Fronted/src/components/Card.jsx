import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  gradient = false,
  glowColor = 'primary',
  delay = 0,
  onClick,
}) {
  const glowMap = {
    primary: 'hover:shadow-primary-500/10 hover:border-primary-500/30',
    accent: 'hover:shadow-accent-500/10 hover:border-accent-500/30',
    emerald: 'hover:shadow-emerald-500/10 hover:border-emerald-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : {}}
      onClick={onClick}
      className={`
        relative rounded-2xl overflow-hidden
        ${gradient
          ? 'bg-gradient-to-br from-surface-900/80 via-surface-850/60 to-surface-900/80'
          : 'bg-surface-900/50'
        }
        backdrop-blur-xl
        border border-white/[0.06]
        shadow-xl shadow-black/20
        transition-all duration-500
        ${hover ? `cursor-pointer ${glowMap[glowColor] || glowMap.primary} hover:shadow-2xl` : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
