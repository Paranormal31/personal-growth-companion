import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Droplets,
  Wind,
  Activity,
  Utensils,
  Trophy,
  Sparkles,
  Sprout,
  Heart,
  BookOpen,
} from 'lucide-react';
import type { TimeOfDay } from '../../types/theme';
import type { HabitIconKey, StoredHabit } from '../../hooks/useHabitsStorage';

export interface AddHabitSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Omit<StoredHabit, 'id' | 'completed' | 'streak'>) => void;
  activePhase: TimeOfDay;
}

interface PhaseOption {
  id: TimeOfDay;
  label: string;
  icon: typeof Sun;
  color: string;
  defaultTime: string;
}

const PHASE_OPTIONS: PhaseOption[] = [
  { id: 'morning', label: 'Morning', icon: Sun, color: '#FF6B6B', defaultTime: '08:00 AM' },
  { id: 'afternoon', label: 'Afternoon', icon: SunMedium, color: '#4C9EFF', defaultTime: '01:00 PM' },
  { id: 'evening', label: 'Evening', icon: Sunset, color: '#8E7CFB', defaultTime: '07:30 PM' },
  { id: 'night', label: 'Night', icon: Moon, color: '#4F46E5', defaultTime: '10:00 PM' },
];

interface IconOption {
  key: HabitIconKey;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const ICON_OPTIONS: IconOption[] = [
  { key: 'droplets', label: 'Hydration', icon: Droplets },
  { key: 'wind', label: 'Breathing', icon: Wind },
  { key: 'sun', label: 'Sunlight', icon: Sun },
  { key: 'activity', label: 'Movement', icon: Activity },
  { key: 'utensils', label: 'Meal', icon: Utensils },
  { key: 'trophy', label: 'Win', icon: Trophy },
  { key: 'sparkles', label: 'Focus', icon: Sparkles },
  { key: 'moon', label: 'Rest', icon: Moon },
  { key: 'sprout', label: 'Growth', icon: Sprout },
  { key: 'heart', label: 'Self-Care', icon: Heart },
  { key: 'book', label: 'Journal', icon: BookOpen },
];

/**
 * AddHabitSheet
 *
 * Slide-up frosted modal sheet to add a custom ritual.
 * Designed with Outfit typography and contextual theme accents from the reference guide.
 */
export function AddHabitSheet({
  isOpen,
  onClose,
  onAddHabit,
  activePhase,
}: AddHabitSheetProps) {
  const [title, setTitle] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<TimeOfDay>(activePhase);
  const [timeLabel, setTimeLabel] = useState(
    PHASE_OPTIONS.find((p) => p.id === activePhase)?.defaultTime ?? '08:00 AM'
  );
  const [selectedIconKey, setSelectedIconKey] = useState<HabitIconKey>('droplets');
  const [error, setError] = useState('');

  const currentPhaseConfig =
    PHASE_OPTIONS.find((p) => p.id === selectedPhase) ?? PHASE_OPTIONS[0];

  const handlePhaseChange = (phase: TimeOfDay) => {
    setSelectedPhase(phase);
    const defaultTime = PHASE_OPTIONS.find((p) => p.id === phase)?.defaultTime ?? '08:00 AM';
    setTimeLabel(defaultTime);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a ritual title');
      return;
    }

    onAddHabit({
      title: title.trim(),
      subtitle: `Daily ritual for ${currentPhaseConfig.label.toLowerCase()}`,
      phase: selectedPhase,
      timeLabel: timeLabel.trim() || currentPhaseConfig.defaultTime,
      iconKey: selectedIconKey,
      iconColor: currentPhaseConfig.color,
      category: `${currentPhaseConfig.label} Ritual`,
    });

    // Reset and close
    setTitle('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end pointer-events-auto font-['Outfit']">
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
            className="relative z-10 w-full rounded-t-[36px] bg-stone-900/95 border-t border-x border-white/20 p-5 pt-3 pb-8 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-4 text-stone-100 max-h-[85vh] overflow-y-auto no-scrollbar"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-white/20 self-center mb-1" />

            {/* Header */}
            <div className="w-full flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center border shadow-xs"
                  style={{
                    backgroundColor: `${currentPhaseConfig.color}25`,
                    borderColor: `${currentPhaseConfig.color}60`,
                  }}
                >
                  <Plus className="w-4 h-4" style={{ color: currentPhaseConfig.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white">
                    Add New Daily Ritual
                  </h3>
                  <p className="text-[10px] text-stone-400">
                    Nurture your daily growth step-by-step
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-stone-300 hover:text-white"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Title Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Ritual Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g., Read 10 Pages, Cold Shower, Evening Walk"
                  maxLength={50}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-white/40 transition-colors"
                />
                {error && <span className="text-[10px] text-rose-400">{error}</span>}
              </div>

              {/* Phase Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Time of Day Phase
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10">
                  {PHASE_OPTIONS.map((phase) => {
                    const Icon = phase.icon;
                    const isSelected = selectedPhase === phase.id;

                    return (
                      <button
                        key={phase.id}
                        type="button"
                        onClick={() => handlePhaseChange(phase.id)}
                        className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'text-white shadow-md'
                            : 'text-stone-400 hover:text-stone-200 border-transparent hover:bg-white/5'
                        }`}
                        style={{
                          backgroundColor: isSelected ? `${phase.color}35` : undefined,
                          borderColor: isSelected ? `${phase.color}80` : undefined,
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: isSelected ? phase.color : undefined }}
                        />
                        <span>{phase.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Label */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Target Time
                </label>
                <input
                  type="text"
                  value={timeLabel}
                  onChange={(e) => setTimeLabel(e.target.value)}
                  placeholder="e.g., 08:30 AM"
                  maxLength={15}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-stone-500 text-xs focus:outline-none focus:border-white/40 transition-colors font-mono"
                />
              </div>

              {/* Icon Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Choose an Icon
                </label>
                <div className="grid grid-cols-6 gap-2 p-2 rounded-2xl bg-black/40 border border-white/10">
                  {ICON_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedIconKey === opt.key;

                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setSelectedIconKey(opt.key)}
                        title={opt.label}
                        className={`aspect-square rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'scale-110 shadow-md'
                            : 'hover:bg-white/10 border-transparent text-stone-400 hover:text-stone-200'
                        }`}
                        style={{
                          backgroundColor: isSelected ? `${currentPhaseConfig.color}40` : undefined,
                          borderColor: isSelected ? currentPhaseConfig.color : undefined,
                          color: isSelected ? currentPhaseConfig.color : undefined,
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-lg transition-transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                style={{
                  backgroundColor: currentPhaseConfig.color,
                  boxShadow: `0 8px 24px ${currentPhaseConfig.color}50`,
                }}
              >
                <Plus className="w-4 h-4" />
                <span>Save Ritual</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AddHabitSheet;
