import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Droplets,
  Wind,
  Utensils,
  Sparkles,
  Flame,
  Activity,
  Trophy,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  Sparkle,
} from 'lucide-react';
import type { TimeOfDay, TimeThemeConfig } from '../../types/theme';
import { HabitItem } from './HabitItem';

export interface HabitData {
  id: string;
  phase: TimeOfDay;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  completed: boolean;
  streak: number;
  category: string;
  timeLabel: string;
}

export interface DashboardChecklistCardProps {
  /** Active time of day period */
  timeOfDay: TimeOfDay;
  /** Active theme configuration */
  theme: TimeThemeConfig;
  /** Whether to expand all phases (e.g. when navigated via Rituals tab) */
  expandAll?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Optional callback when a habit is toggled */
  onToggleHabit?: (id: string, completed: boolean) => void;
}

const DEFAULT_HABITS: HabitData[] = [
  // Morning Rituals
  {
    id: 'habit-morning-1',
    phase: 'morning',
    title: 'Morning Hydration',
    subtitle: 'Drink a tall glass of fresh water to awaken your body',
    icon: Droplets,
    iconColor: '#0284C7',
    completed: true,
    streak: 6,
    category: 'Morning Ritual',
    timeLabel: '07:30 AM',
  },
  {
    id: 'habit-morning-2',
    phase: 'morning',
    title: '5-Minute Mindful Breathing',
    subtitle: 'Ground yourself with calm, deep diaphragmatic breaths',
    icon: Wind,
    iconColor: '#7C3AED',
    completed: true,
    streak: 4,
    category: 'Mindfulness',
    timeLabel: '08:00 AM',
  },
  {
    id: 'habit-morning-3',
    phase: 'morning',
    title: 'Sunshine & Gentle Stretch',
    subtitle: 'Soak up natural morning light and loosen your muscles',
    icon: Sun,
    iconColor: '#F59E0B',
    completed: false,
    streak: 3,
    category: 'Vitality',
    timeLabel: '08:30 AM',
  },

  // Afternoon Rituals
  {
    id: 'habit-afternoon-1',
    phase: 'afternoon',
    title: 'Nourishing Balanced Meal',
    subtitle: 'Eat mindfully and savor your fuel away from screens',
    icon: Utensils,
    iconColor: '#16A34A',
    completed: false,
    streak: 12,
    category: 'Nourishment',
    timeLabel: '12:30 PM',
  },
  {
    id: 'habit-afternoon-2',
    phase: 'afternoon',
    title: 'Mindful Walk & Movement',
    subtitle: 'Step outside or take a short stroll to clear mental fog',
    icon: Activity,
    iconColor: '#E11D48',
    completed: false,
    streak: 5,
    category: 'Energy Reset',
    timeLabel: '03:00 PM',
  },

  // Evening Rituals
  {
    id: 'habit-evening-1',
    phase: 'evening',
    title: 'Celebrate One Daily Win',
    subtitle: 'Acknowledge your personal progress and gratitude today',
    icon: Trophy,
    iconColor: '#D97706',
    completed: false,
    streak: 9,
    category: 'Reflection',
    timeLabel: '06:30 PM',
  },
  {
    id: 'habit-evening-2',
    phase: 'evening',
    title: 'Gratitude Reflection',
    subtitle: 'Jot down 3 simple things that brought peace today',
    icon: BookOpen,
    iconColor: '#8B5CF6',
    completed: false,
    streak: 8,
    category: 'Mindfulness',
    timeLabel: '08:00 PM',
  },

  // Night Rituals
  {
    id: 'habit-night-1',
    phase: 'night',
    title: 'Digital Sunset & Dim Lights',
    subtitle: 'Silence notifications and put away glowing screens',
    icon: Sunset,
    iconColor: '#6366F1',
    completed: false,
    streak: 14,
    category: 'Rest & Recharge',
    timeLabel: '10:00 PM',
  },
  {
    id: 'habit-night-2',
    phase: 'night',
    title: 'Restorative Wind Down',
    subtitle: 'Deep calm body scan before entering restful slumber',
    icon: Sparkles,
    iconColor: '#A855F7',
    completed: false,
    streak: 11,
    category: 'Sleep Sanctuary',
    timeLabel: '10:30 PM',
  },
];

interface PhaseGroupConfig {
  id: TimeOfDay;
  title: string;
  tag: string;
  icon: typeof Sun;
  color: string;
}

const PHASE_CONFIGS: PhaseGroupConfig[] = [
  { id: 'morning', title: 'Morning Rituals', tag: 'Bright Beginnings', icon: Sun, color: '#FF9F43' },
  { id: 'afternoon', title: 'Afternoon Flow', tag: 'Steady Progress', icon: SunMedium, color: '#4DA8F5' },
  { id: 'evening', title: 'Evening Unwind', tag: 'Reflect & Center', icon: Sunset, color: '#F27B35' },
  { id: 'night', title: 'Night Sanctuary', tag: 'Rest & Recharge', icon: Moon, color: '#818CF8' },
];

/**
 * DashboardChecklistCard
 *
 * Floating frosted glass daily ritual checklist card over the lower half of the screen.
 * Groups rituals by 4 time phases (Morning, Afternoon, Evening, Night).
 * Auto-expands the active phase matching current time-of-day.
 * Shows overall progress bar and total streak counter.
 */
export function DashboardChecklistCard({
  timeOfDay,
  theme,
  expandAll = false,
  className = '',
  onToggleHabit,
}: DashboardChecklistCardProps) {
  const [habits, setHabits] = useState<HabitData[]>(DEFAULT_HABITS);

  // User-toggled phase accordion overrides
  const [userToggles, setUserToggles] = useState<Partial<Record<TimeOfDay, boolean>>>({});

  const isPhaseExpanded = (phase: TimeOfDay) => {
    if (expandAll) return true;
    if (userToggles[phase] !== undefined) return userToggles[phase]!;
    return phase === timeOfDay;
  };

  const togglePhase = (phase: TimeOfDay) => {
    setUserToggles((prev) => ({
      ...prev,
      [phase]: !isPhaseExpanded(phase),
    }));
  };

  const handleToggle = (id: string, nextCompleted: boolean) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: nextCompleted } : h))
    );
    onToggleHabit?.(id, nextCompleted);
  };

  // Metrics
  const totalCount = habits.length;
  const completedCount = useMemo(
    () => habits.filter((h) => h.completed).length,
    [habits]
  );
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Max streak among habits
  const maxStreak = useMemo(
    () => Math.max(...habits.map((h) => h.streak), 0),
    [habits]
  );

  return (
    <section
      aria-label="Daily rituals checklist"
      className={`rounded-[32px] bg-stone-900/75 backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-4 sm:p-5 flex flex-col gap-3.5 text-stone-100 ring-1 ring-white/10 ${className}`}
    >
      {/* Header with Title, Streaks Badge, and Completion % */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center border shadow-xs transition-colors"
            style={{
              backgroundColor: `${theme.colors.accent}25`,
              borderColor: `${theme.colors.accent}60`,
            }}
          >
            <Sparkle
              className="w-4 h-4 transition-transform hover:rotate-12"
              style={{ color: theme.colors.accent }}
            />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white leading-tight">
              Daily Rituals
            </h2>
            <p className="text-[11px] text-stone-300 font-medium leading-none">
              {completedCount} of {totalCount} completed
            </p>
          </div>
        </div>

        {/* Streak & Completion Badge */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{maxStreak}d</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-stone-200 text-xs font-mono font-semibold">
            <span>{percent}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 rounded-full bg-black/40 border border-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${theme.colors.accent}, #F59E0B)`,
            boxShadow: `0 0 12px ${theme.colors.accent}80`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
        />
      </div>

      {/* Grouped Accordions for all 4 Phases */}
      <div className="flex flex-col gap-2.5 max-h-[340px] sm:max-h-[380px] overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-stone-700/50">
        {PHASE_CONFIGS.map((group) => {
          const groupHabits = habits.filter((h) => h.phase === group.id);
          if (groupHabits.length === 0) return null;

          const isCurrentPhase = group.id === timeOfDay;
          const isExpanded = isPhaseExpanded(group.id);
          const groupCompleted = groupHabits.filter((h) => h.completed).length;
          const groupTotal = groupHabits.length;
          const isGroupAllDone = groupCompleted === groupTotal;
          const Icon = group.icon;

          return (
            <div
              key={group.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isCurrentPhase
                  ? 'bg-white/[0.08] border-white/25 shadow-sm'
                  : 'bg-black/25 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Group Accordion Header */}
              <button
                type="button"
                onClick={() => togglePhase(group.id)}
                className="w-full flex items-center justify-between p-2.5 sm:px-3 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center border shadow-xs"
                    style={{
                      backgroundColor: `${group.color}25`,
                      borderColor: `${group.color}60`,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: group.color }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-100">
                      {group.title}
                    </span>
                    {isCurrentPhase && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-stone-400">
                    {groupCompleted}/{groupTotal}
                  </span>
                  {isGroupAllDone && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </motion.div>
                </div>
              </button>

              {/* Accordion Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-2 sm:p-2.5 pt-0 flex flex-col gap-2">
                      {groupHabits.map((habit) => (
                        <HabitItem
                          key={habit.id}
                          id={habit.id}
                          title={habit.title}
                          subtitle={habit.subtitle}
                          icon={habit.icon}
                          iconColor={habit.iconColor}
                          completed={habit.completed}
                          onToggle={handleToggle}
                          theme={theme}
                          streak={habit.streak}
                          category={habit.category}
                          timeLabel={habit.timeLabel}
                          className="bg-stone-900/80 border-white/10 hover:border-white/20"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DashboardChecklistCard;
