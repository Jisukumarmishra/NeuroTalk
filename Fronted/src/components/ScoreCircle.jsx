import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ScoreCircle({
  score = 0,
  size = 200,
  strokeWidth = 12,
  label = 'Confidence',
  showGrade = true,
  animated = true,
}) {
  const [displayScore, setDisplayScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Animate number counting
  useEffect(() => {
    if (!animated || hasAnimated) {
      setDisplayScore(score);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * score);
            setDisplayScore(current);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [score, animated, hasAnimated]);

  // Color based on score
  const getColor = (s) => {
    if (s >= 80) return { stroke: '#34d399', glow: 'rgba(52, 211, 153, 0.3)', grade: 'Excellent', bg: 'rgba(52, 211, 153, 0.08)' };
    if (s >= 60) return { stroke: '#818cf8', glow: 'rgba(129, 140, 248, 0.3)', grade: 'Good', bg: 'rgba(129, 140, 248, 0.08)' };
    if (s >= 40) return { stroke: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)', grade: 'Fair', bg: 'rgba(251, 191, 36, 0.08)' };
    return { stroke: '#f87171', glow: 'rgba(248, 113, 113, 0.3)', grade: 'Needs Work', bg: 'rgba(248, 113, 113, 0.08)' };
  };

  const color = getColor(displayScore);
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div
          className="absolute inset-4 rounded-full blur-2xl transition-all duration-1000"
          style={{ backgroundColor: color.glow, opacity: 0.4 }}
        />

        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-full animate-[pulse-ring_3s_ease-in-out_infinite]"
          style={{ border: `2px solid ${color.stroke}`, opacity: 0.15 }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 relative z-10"
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: animated ? 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.5s ease' : 'none',
              filter: `drop-shadow(0 0 8px ${color.glow})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: color.stroke }}
          >
            {displayScore}
          </span>
          <span className="text-xs text-surface-200/50 font-medium tracking-wider uppercase mt-1">
            {label}
          </span>
        </div>
      </div>

      {/* Grade badge */}
      {showGrade && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
          style={{
            backgroundColor: color.bg,
            color: color.stroke,
            border: `1px solid ${color.stroke}33`,
          }}
        >
          {color.grade}
        </motion.div>
      )}
    </motion.div>
  );
}
