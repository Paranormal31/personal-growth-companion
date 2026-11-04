import { motion, AnimatePresence } from 'framer-motion';
import type { MoodPhase } from '../types/mood';
import { MOOD_THEMES } from '../constants/moods';

export interface MoodLabelProps {
  /** Active mood phase */
  phase: MoodPhase;
  /** Tone-on-tone ink color */
  inkColor: string;
  /** Optional container class */
  className?: string;
}

/**
 * MoodLabel — Single, bold animated text displaying the active mood name.
 * Smoothly fades and springs up on mood phase change.
 */
export function MoodLabel({ phase, inkColor, className = '' }: MoodLabelProps) {
  const label = MOOD_THEMES[phase]?.label ?? 'Not Bad';

  return (
    <div
      className={`h-16 sm:h-20 flex items-center justify-center overflow-hidden select-none relative ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.h1
          key={phase}
          initial={{ opacity: 0, y: 22, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.92 }}
          transition={{
            type: 'spring',
            stiffness: 440,
            damping: 28,
            mass: 0.7,
          }}
          className="text-4xl sm:text-5xl font-black tracking-tight text-center"
          style={{ color: inkColor }}
        >
          {label}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

export default MoodLabel;
