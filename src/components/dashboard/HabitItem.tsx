import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import type { TimeThemeConfig } from '../../types/theme';

export interface HabitItemProps {
  /** Unique habit identifier */
  id: string;
  /** Primary habit title (e.g. "Morning Hydration") */
  title: string;
  /** Subtitle or description (e.g. "Drink a tall glass of fresh water") */
  subtitle?: string;
  /** Icon component to render on the habit badge */
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  /** Custom accent color for the habit icon badge */
  iconColor?: string;
  /** Completion status */
  completed: boolean;
  /** Callback triggered when user toggles completion status */
  onToggle: (id: string, nextCompleted: boolean) => void;
  /** Active time theme for contextual dynamic colors */
  theme?: TimeThemeConfig;
  /** Optional streak count in days (displays fire badge) */
  streak?: number;
  /** Category or ritual phase badge (e.g. "Morning Ritual", "Focus") */
  category?: string;
  /** Target duration or time hint (e.g. "5 min", "07:30 AM") */
  timeLabel?: string;
  /** Whether the item is disabled from interaction */
  disabled?: boolean;
  /** Additional custom class names for the container */
  className?: string;
}

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  shape: 'circle' | 'sparkle' | 'rect';
  size: number;
}

/**
 * HabitItem
 *
 * An interactive, touch-friendly habit toggle component built with Fabulous design principles.
 * Features:
 * - Haptic-style spring checkmark with SVG path tracing and squircle bounce
 * - Micro-confetti and spark burst emanating from the checkbox upon completion
 * - Contextual theming mapped to the active time-of-day theme (primary & accent colors)
 * - Accessible keyboard navigation and mobile haptic vibration feedback
 */
export function HabitItem({
  id,
  title,
  subtitle,
  icon: IconComponent,
  iconColor = '#10B981',
  completed,
  onToggle,
  theme,
  streak,
  category,
  timeLabel,
  disabled = false,
  className = '',
}: HabitItemProps) {
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const burstTimerRef = useRef<number | null>(null);

  // Clean up any pending burst timers on unmount
  useEffect(() => {
    return () => {
      if (burstTimerRef.current !== null) {
        window.clearTimeout(burstTimerRef.current);
      }
    };
  }, []);

  // Determine active dynamic theme colors
  const primaryAccent = theme?.colors.primary ?? '#10B981';
  const palette = useMemo(() => {
    return theme
      ? [
          theme.colors.primary,
          theme.colors.accent,
          theme.colors.secondary,
          '#10B981',
          '#F59E0B',
        ]
      : ['#10B981', '#34D399', '#F59E0B', '#3B82F6', '#EC4899'];
  }, [theme]);

  // Spawn radial micro-confetti / spark burst
  const triggerSparkBurst = useCallback(() => {
    // Generate 14 dynamic particles bursting outward in a radial circle
    const count = 14;
    const now = Date.now();
    const shapes: ('circle' | 'sparkle' | 'rect')[] = ['sparkle', 'circle', 'rect'];

    const newParticles: BurstParticle[] = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360 + (Math.random() * 24 - 12);
      const rad = (angle * Math.PI) / 180;
      const distance = 28 + Math.random() * 26; // 28px - 54px spread
      const shape = shapes[i % shapes.length];

      return {
        id: now + i,
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance,
        rotation: (Math.random() - 0.5) * 360,
        scale: 0.85 + Math.random() * 0.45,
        color: palette[i % palette.length],
        shape,
        size: shape === 'sparkle' ? 9 : shape === 'rect' ? 6 : 5,
      };
    });

    setBurstParticles(newParticles);

    // Light mobile haptic vibration if supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(14);
      } catch {
        // Ignore if restricted by browser security policies
      }
    }

    if (burstTimerRef.current !== null) {
      window.clearTimeout(burstTimerRef.current);
    }
    burstTimerRef.current = window.setTimeout(() => {
      setBurstParticles([]);
      burstTimerRef.current = null;
    }, 700);
  }, [palette]);

  // Handle interaction toggle
  const handleToggle = useCallback(() => {
    if (disabled) return;
    const nextCompleted = !completed;

    if (nextCompleted) {
      triggerSparkBurst();
    }

    onToggle(id, nextCompleted);
  }, [disabled, completed, triggerSparkBurst, onToggle, id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <motion.div
      role="checkbox"
      aria-checked={completed}
      aria-label={`${title}${completed ? ' (Completed)' : ''}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      whileHover={disabled ? undefined : { scale: 1.01, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className={`relative w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 cursor-pointer select-none overflow-visible focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        completed
          ? 'bg-stone-100/75 border-stone-200/60 opacity-85 shadow-none'
          : 'bg-white hover:bg-white/95 border-stone-200/90 shadow-xs hover:border-stone-300/90 hover:shadow-sm'
      } ${className}`}
      style={{
        // Subtle outline focus ring using primary theme accent
        outlineColor: primaryAccent,
      }}
    >
      {/* Spring Checkbox Hit Target with Spark Burst Overlay */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Checkbox squircle */}
        <motion.div
          whileTap={disabled ? undefined : { scale: 0.82 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 border ${
            completed
              ? 'border-transparent text-white shadow-xs'
              : 'border-2 border-stone-300 hover:border-stone-400 bg-stone-50/50'
          }`}
          style={{
            backgroundColor: completed ? primaryAccent : undefined,
            boxShadow: completed
              ? `0 4px 14px ${primaryAccent}45`
              : undefined,
          }}
        >
          <AnimatePresence mode="wait">
            {completed && (
              <motion.div
                key="check-icon"
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 20 }}
                transition={{
                  type: 'spring',
                  stiffness: 550,
                  damping: 24,
                  mass: 0.6,
                }}
                className="flex items-center justify-center"
              >
                {/* Custom animated path SVG checkmark */}
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M3.5 8.5L6.5 11.5L12.5 4.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.22,
                      ease: 'easeOut',
                    }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Micro-Confetti & Spark Burst Overlay */}
        <AnimatePresence>
          {burstParticles.length > 0 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-30">
              {/* Expanding Shockwave Ring */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0.95 }}
                animate={{ scale: 2.3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.48, ease: 'easeOut' }}
                className="absolute w-7 h-7 rounded-full border-2"
                style={{ borderColor: primaryAccent }}
              />

              {/* Burst Particles */}
              {burstParticles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    scale: [0, p.scale, 0],
                    opacity: [1, 1, 0],
                    rotate: p.rotation,
                  }}
                  transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute"
                  style={{ color: p.color }}
                >
                  {p.shape === 'sparkle' ? (
                    <svg
                      width={p.size}
                      height={p.size}
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z" />
                    </svg>
                  ) : p.shape === 'rect' ? (
                    <div
                      style={{
                        width: p.size,
                        height: p.size * 0.6,
                        backgroundColor: p.color,
                        borderRadius: 1.5,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: '50%',
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Habit Details (Title, Subtitle, Tags) */}
      <div className="flex-1 min-w-0 pr-1">
        {/* Optional Category & Time Hint Row */}
        {(category || timeLabel) && (
          <div className="flex items-center gap-2 mb-0.5">
            {category && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                {category}
              </span>
            )}
            {category && timeLabel && (
              <span className="text-[10px] text-stone-300">•</span>
            )}
            {timeLabel && (
              <span className="text-[10px] font-mono text-stone-400">
                {timeLabel}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-bold transition-all leading-snug truncate ${
              completed
                ? 'line-through text-stone-400 font-medium'
                : 'text-stone-850'
            }`}
          >
            {title}
          </p>

          {/* Streak Flame Badge */}
          {typeof streak === 'number' && streak > 0 && (
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold transition-opacity shrink-0 ${
                completed
                  ? 'bg-amber-100/60 text-amber-700 opacity-60'
                  : 'bg-amber-100 text-amber-800'
              }`}
              title={`${streak}-day completion streak`}
            >
              <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              <span>{streak}d</span>
            </span>
          )}
        </div>

        {subtitle && (
          <p
            className={`text-xs truncate transition-colors leading-relaxed ${
              completed ? 'text-stone-400/80' : 'text-stone-500'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Habit Category / Custom Icon Pill */}
      {IconComponent && (
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
            completed ? 'opacity-50 grayscale-20 scale-95' : 'opacity-90'
          }`}
          style={{
            backgroundColor: `${iconColor}15`,
          }}
        >
          <IconComponent
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors"
            style={{ color: iconColor }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default HabitItem;
