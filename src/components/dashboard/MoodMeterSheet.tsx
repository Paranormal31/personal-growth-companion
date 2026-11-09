import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import type { MoodPhase } from '../../types/mood';
import {
  MOOD_THEMES,
  getMoodPhaseFromValue,
  interpolateMoodColor,
  interpolateInkColor,
} from '../../constants/moods';
import { MoodFace } from '../MoodFace';
import { MoodLabel } from '../MoodLabel';
import { StepSlider } from '../StepSlider';

export interface MoodMeterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhase: MoodPhase;
  onPhaseChange: (phase: MoodPhase) => void;
  continuousValue?: number;
  onContinuousChange?: (val: number | undefined) => void;
}

/**
 * MoodMeterSheet
 *
 * Slide-up frosted modal sheet over the living celestial dashboard.
 * Allows instant, touch-friendly mood check-in and snapping without leaving the scenic view.
 */
export function MoodMeterSheet({
  isOpen,
  onClose,
  currentPhase,
  onPhaseChange,
  continuousValue,
  onContinuousChange,
}: MoodMeterSheetProps) {
  const activePhase: MoodPhase =
    typeof continuousValue === 'number'
      ? getMoodPhaseFromValue(continuousValue)
      : currentPhase;

  const activeTheme = MOOD_THEMES[activePhase] ?? MOOD_THEMES.not_bad;

  const activeBgColor =
    typeof continuousValue === 'number'
      ? interpolateMoodColor(continuousValue)
      : activeTheme.color;

  const activeInkColor =
    typeof continuousValue === 'number'
      ? interpolateInkColor(continuousValue)
      : activeTheme.inkColor;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end pointer-events-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Slide-Up Drawer Content */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full rounded-t-[36px] border-t border-x border-white/20 p-5 pt-3 pb-8 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center gap-3 transition-colors duration-300"
            style={{
              backgroundColor: activeBgColor,
              color: activeInkColor,
            }}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-black/20 mb-1" />

            {/* Header with Title & Dismiss */}
            <div className="w-full flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 opacity-80" />
                <h3 className="text-sm font-bold tracking-tight">
                  How are you feeling right now?
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mood Face Graphic */}
            <div className="py-2">
              <MoodFace
                phase={currentPhase}
                theme={activeTheme}
                continuousValue={continuousValue}
                className="w-44 h-44 sm:w-48 sm:h-48"
              />
            </div>

            {/* Dynamic Animated Mood Label */}
            <MoodLabel phase={activePhase} inkColor={activeInkColor} />

            {/* 4-Step Magnetic Snapping Slider */}
            <div className="w-full pt-2 pb-1 px-2">
              <StepSlider
                currentPhase={currentPhase}
                onChange={(phase) => {
                  onPhaseChange(phase);
                  onContinuousChange?.(undefined);
                }}
                onContinuousChange={(val) => {
                  onContinuousChange?.(val);
                }}
                theme={activeTheme}
              />
            </div>

            {/* Save / Done Button */}
            <button
              type="button"
              onClick={onClose}
              className="mt-1 w-full py-3 rounded-2xl font-bold text-sm bg-black/80 hover:bg-black text-white shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
            >
              Log Mood &amp; Continue
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MoodMeterSheet;
