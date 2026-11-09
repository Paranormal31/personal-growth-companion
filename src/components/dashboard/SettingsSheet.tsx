import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Settings,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Check,
  Smartphone,
  Shield,
} from 'lucide-react';
import type { TimeOfDay, TimeThemeConfig } from '../../types/theme';

export interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  timeOfDay: TimeOfDay;
  onSelectTimeOfDay: (time: TimeOfDay) => void;
  theme: TimeThemeConfig;
  isAutoPlay?: boolean;
  onToggleAutoPlay?: () => void;
  onResetHabits?: () => void;
  cycleDuration?: number;
  onCycleDurationChange?: (duration: number) => void;
}

interface PeriodOption {
  id: TimeOfDay;
  label: string;
  tag: string;
  icon: typeof Sun;
  color: string;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { id: 'morning', label: 'Morning', tag: 'Bright Beginnings', icon: Sun, color: '#FF9F43' },
  { id: 'afternoon', label: 'Afternoon', tag: 'Steady Progress', icon: SunMedium, color: '#4DA8F5' },
  { id: 'evening', label: 'Evening', tag: 'Unwind & Reflect', icon: Sunset, color: '#F27B35' },
  { id: 'night', label: 'Night', tag: 'Rest & Recharge', icon: Moon, color: '#818CF8' },
];

/**
 * SettingsSheet
 *
 * Slide-up frosted modal sheet for app customization, manual time overrides,
 * continuous 24h celestial simulation controls, and habits reset.
 */
export function SettingsSheet({
  isOpen,
  onClose,
  timeOfDay,
  onSelectTimeOfDay,
  theme,
  isAutoPlay = false,
  onToggleAutoPlay,
  onResetHabits,
  cycleDuration = 16,
  onCycleDurationChange,
}: SettingsSheetProps) {
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
            className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-[36px] bg-stone-900/90 backdrop-blur-2xl border-t border-x border-white/20 p-5 pt-3 pb-8 text-stone-100 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-4 scrollbar-thin scrollbar-thumb-stone-700/50"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-1" />

            {/* Header with Title & Dismiss */}
            <div className="w-full flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs"
                  style={{
                    backgroundColor: `${theme.colors.accent}25`,
                    borderColor: `${theme.colors.accent}60`,
                  }}
                >
                  <Settings className="w-4 h-4" style={{ color: theme.colors.accent }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white leading-tight">
                    Settings &amp; Controls
                  </h3>
                  <p className="text-[11px] text-stone-400 leading-none">
                    Time simulation &amp; preferences
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Time of Day Override */}
            <section className="flex flex-col gap-2 rounded-2xl bg-black/35 border border-white/10 p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Time-of-Day Phase</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 uppercase">
                  {timeOfDay}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {PERIOD_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = timeOfDay === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onSelectTimeOfDay(opt.id)}
                      className={`relative flex items-center gap-2 p-2 rounded-xl text-left transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400/50 text-white shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                          : 'bg-stone-800/60 border-white/10 text-stone-400 hover:text-stone-200 hover:border-white/20'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${opt.color}25`,
                          borderColor: `${opt.color}60`,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: opt.color }} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold leading-tight truncate">
                          {opt.label}
                        </p>
                        <p className="text-[9px] text-stone-400 leading-none truncate">
                          {opt.tag}
                        </p>
                      </div>
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Section 2: Celestial 24h Auto-Play */}
            <section className="flex flex-col gap-2 rounded-2xl bg-black/35 border border-white/10 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">
                      Celestial 24h Auto-Play
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      Continuous day/night sky cycle
                    </p>
                  </div>
                </div>

                {onToggleAutoPlay && (
                  <button
                    type="button"
                    onClick={onToggleAutoPlay}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isAutoPlay
                        ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'bg-stone-800 border-white/15 text-stone-300 hover:text-white'
                    }`}
                  >
                    {isAutoPlay ? (
                      <>
                        <Pause className="w-3 h-3 fill-emerald-400" />
                        <span>Looping</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-stone-300" />
                        <span>Start</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {onCycleDurationChange && (
                <div className="pt-2 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] text-stone-400">
                    <span>Cycle Duration</span>
                    <span className="font-mono text-stone-200 font-semibold">
                      {cycleDuration}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="60"
                    step="2"
                    value={cycleDuration}
                    onChange={(e) => onCycleDurationChange(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </section>

            {/* Section 3: Reset Habits */}
            {onResetHabits && (
              <section className="flex items-center justify-between rounded-2xl bg-black/35 border border-white/10 p-3.5">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-stone-400" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-200">
                      Reset Daily Rituals
                    </h4>
                    <p className="text-[10px] text-stone-400">
                      Uncheck all items to restart your day
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onResetHabits}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-white/10 transition cursor-pointer"
                >
                  Reset
                </button>
              </section>
            )}

            {/* Section 4: Architecture Info */}
            <div className="px-1 pt-1 flex items-center justify-between text-[10px] text-stone-400">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-stone-500" />
                Personal Growth Companion v2.0
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Shield className="w-3 h-3 text-emerald-400" />
                Pure Vector SVG
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SettingsSheet;
