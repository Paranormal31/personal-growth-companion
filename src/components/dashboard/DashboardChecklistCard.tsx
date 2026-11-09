import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  SunMedium,
  Sunset,
  Moon,
  ChevronDown,
  ChevronUp,
  Sparkle,
  Flame,
  Plus,
  Pencil,
  Check,
  Trash2,
} from 'lucide-react';
import type { TimeOfDay, TimeThemeConfig } from '../../types/theme';
import type { HabitData } from '../../hooks/useHabitsStorage';
import { HabitItem } from './HabitItem';

export type { HabitData };

export interface DashboardChecklistCardProps {
  /** Active time of day period */
  timeOfDay: TimeOfDay;
  /** Active theme configuration */
  theme: TimeThemeConfig;
  /** List of habits (persisted via useHabitsStorage) */
  habits?: HabitData[];
  /** Whether to expand all phases (e.g. when navigated via Rituals tab) */
  expandAll?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Callback when a habit completion is toggled */
  onToggleHabit?: (id: string, completed: boolean) => void;
  /** Callback when a habit is deleted */
  onDeleteHabit?: (id: string) => void;
  /** Callback to trigger Add Habit sheet */
  onOpenAddHabit?: () => void;
}

interface PhaseGroupConfig {
  id: TimeOfDay;
  title: string;
  tag: string;
  icon: typeof Sun;
  color: string;
}

const PHASE_CONFIGS: PhaseGroupConfig[] = [
  { id: 'morning', title: 'Morning Rituals', tag: 'Bright Beginnings', icon: Sun, color: '#FF6B6B' },
  { id: 'afternoon', title: 'Afternoon Energy', tag: 'Steady Progress', icon: SunMedium, color: '#4C9EFF' },
  { id: 'evening', title: 'Evening Reflection', tag: 'Unwind & Reflect', icon: Sunset, color: '#8E7CFB' },
  { id: 'night', title: 'Night Sanctuary', tag: 'Rest & Recharge', icon: Moon, color: '#4F46E5' },
];

/**
 * Exact Reference Guide Color System per Time of Day
 */
const PHASE_THEME_MAP: Record<
  TimeOfDay,
  {
    surfaceBg: string;
    ink: string;
    inkMuted: string;
    accent1: string;
    accent2: string;
    accent3: string;
    border: string;
    isDark: boolean;
  }
> = {
  morning: {
    surfaceBg: 'rgba(255, 245, 230, 0.88)',
    ink: '#4A2545',
    inkMuted: 'rgba(74, 37, 69, 0.7)',
    accent1: '#FF6B6B',
    accent2: '#FFA07A',
    accent3: '#FFC83D',
    border: 'rgba(255, 107, 107, 0.25)',
    isDark: false,
  },
  afternoon: {
    surfaceBg: 'rgba(232, 246, 255, 0.88)',
    ink: '#1F3A5F',
    inkMuted: 'rgba(31, 58, 95, 0.7)',
    accent1: '#4C9EFF',
    accent2: '#7EC8FF',
    accent3: '#7ED957',
    border: 'rgba(76, 158, 255, 0.25)',
    isDark: false,
  },
  evening: {
    surfaceBg: 'rgba(255, 228, 236, 0.88)',
    ink: '#3B1E54',
    inkMuted: 'rgba(59, 30, 84, 0.7)',
    accent1: '#8E7CFB',
    accent2: '#C9B8FF',
    accent3: '#F4A7C6',
    border: 'rgba(142, 124, 251, 0.25)',
    isDark: false,
  },
  night: {
    surfaceBg: 'rgba(30, 27, 75, 0.92)',
    ink: '#F8FAFF',
    inkMuted: 'rgba(248, 250, 255, 0.7)',
    accent1: '#4F46E5',
    accent2: '#A78BFA',
    accent3: '#E9D5FF',
    border: 'rgba(167, 139, 250, 0.35)',
    isDark: true,
  },
};

/**
 * DashboardChecklistCard
 *
 * Floating frosted glass daily ritual checklist card over the lower half of the screen.
 * Formatted strictly according to the reference Brand Typography (Outfit) and 4-Phase Color Guide.
 * Supports:
 * - Dynamic Reference Theme Surface & Ink
 * - Accordions for 4 phases with current phase auto-expanded
 * - Inline `+ Add Ritual` and `Edit` mode with quick habit deletion
 * - Live progress bar with 3-accent gradient and streak badge
 */
export function DashboardChecklistCard({
  timeOfDay,
  theme,
  habits = [],
  expandAll = false,
  className = '',
  onToggleHabit,
  onDeleteHabit,
  onOpenAddHabit,
}: DashboardChecklistCardProps) {
  const currentPalette = PHASE_THEME_MAP[timeOfDay] ?? PHASE_THEME_MAP.morning;

  // Edit mode to delete habits
  const [isEditMode, setIsEditMode] = useState(false);

  // User-toggled phase accordion overrides
  const [userToggles, setUserToggles] = useState<Partial<Record<TimeOfDay, boolean>>>({});

  const isPhaseExpanded = (phase: TimeOfDay) => {
    if (expandAll) return true;
    if (userToggles[phase] !== undefined) return userToggles[phase]!;
    return true; // default all open for effortless viewing
  };

  const togglePhase = (phase: TimeOfDay) => {
    setUserToggles((prev) => ({
      ...prev,
      [phase]: !isPhaseExpanded(phase),
    }));
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
      className={`rounded-[32px] backdrop-blur-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.45)] p-4 sm:p-5 flex flex-col gap-3.5 transition-all duration-500 font-['Outfit'] select-none ${className}`}
      style={{
        backgroundColor: currentPalette.surfaceBg,
        borderColor: currentPalette.border,
        color: currentPalette.ink,
      }}
    >
      {/* Header: Title, Actions (Add/Edit), Streak Badge & Progress */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center border shadow-xs transition-colors shrink-0"
            style={{
              backgroundColor: `${currentPalette.accent1}25`,
              borderColor: `${currentPalette.accent1}50`,
            }}
          >
            <Sparkle
              className="w-4 h-4 transition-transform hover:rotate-12"
              style={{ color: currentPalette.accent1 }}
            />
          </div>
          <div>
            <h2
              className="text-sm font-bold tracking-tight leading-tight"
              style={{ color: currentPalette.ink }}
            >
              Daily Rituals
            </h2>
            <p
              className="text-[11px] font-medium leading-none"
              style={{ color: currentPalette.inkMuted }}
            >
              {completedCount} of {totalCount} completed
            </p>
          </div>
        </div>

        {/* Action Buttons: Add Habit & Edit Toggle */}
        <div className="flex items-center gap-1.5">
          {onOpenAddHabit && (
            <button
              type="button"
              onClick={onOpenAddHabit}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
              style={{
                backgroundColor: currentPalette.accent1,
                color: '#FFFFFF',
              }}
              title="Add New Habit"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Add</span>
            </button>
          )}

          {onDeleteHabit && totalCount > 0 && (
            <button
              type="button"
              onClick={() => setIsEditMode((prev) => !prev)}
              className="p-1.5 rounded-xl border transition-colors cursor-pointer"
              style={{
                backgroundColor: isEditMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                borderColor: isEditMode ? 'rgba(239, 68, 68, 0.5)' : currentPalette.border,
                color: isEditMode ? '#EF4444' : currentPalette.ink,
              }}
              title={isEditMode ? 'Done Editing' : 'Edit Habits'}
            >
              {isEditMode ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Streak & Completion Badges */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-bold shadow-xs"
            style={{
              backgroundColor: `${currentPalette.accent3}25`,
              borderColor: `${currentPalette.accent3}60`,
              color: currentPalette.isDark ? currentPalette.accent3 : currentPalette.ink,
            }}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{maxStreak}d</span>
          </div>

          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-mono font-semibold"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.06)',
              borderColor: currentPalette.border,
              color: currentPalette.ink,
            }}
          >
            <span>{percent}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar with 3-Accent Gradient from Reference */}
      <div
        className="relative w-full h-2 rounded-full overflow-hidden border"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          borderColor: currentPalette.border,
        }}
      >
        <motion.div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${currentPalette.accent1}, ${currentPalette.accent2}, ${currentPalette.accent3})`,
            boxShadow: `0 0 10px ${currentPalette.accent1}70`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
        />
      </div>

      {/* Grouped Accordions for all 4 Phases */}
      <div className="flex flex-col gap-2.5 max-h-[32vh] sm:max-h-[36vh] overflow-y-auto pr-0.5 no-scrollbar">
        {PHASE_CONFIGS.map((group) => {
          const groupHabits = habits.filter((h) => h.phase === group.id);
          if (groupHabits.length === 0) return null;

          const isCurrentPhase = group.id === timeOfDay;
          const isExpanded = isPhaseExpanded(group.id);
          const groupCompleted = groupHabits.filter((h) => h.completed).length;
          const groupTotal = groupHabits.length;
          const Icon = group.icon;

          return (
            <div
              key={group.id}
              className="rounded-2xl border transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: isCurrentPhase
                  ? currentPalette.isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.65)'
                  : currentPalette.isDark
                    ? 'rgba(0, 0, 0, 0.25)'
                    : 'rgba(255, 255, 255, 0.35)',
                borderColor: isCurrentPhase ? `${group.color}70` : currentPalette.border,
              }}
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
                    <span
                      className="text-xs font-bold"
                      style={{ color: currentPalette.ink }}
                    >
                      {group.title}
                    </span>
                    {isCurrentPhase && (
                      <span
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${group.color}20`,
                          borderColor: `${group.color}60`,
                          color: currentPalette.isDark ? '#FFFFFF' : group.color,
                        }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-mono font-medium"
                    style={{ color: currentPalette.inkMuted }}
                  >
                    {groupCompleted}/{groupTotal}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 opacity-60" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  )}
                </div>
              </button>

              {/* Habit Items in this Phase */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="px-2 pb-2 flex flex-col gap-1.5"
                  >
                    {groupHabits.map((habit) => (
                      <div key={habit.id} className="relative flex items-center gap-1 group">
                        <div className="flex-1 min-w-0">
                          <HabitItem
                            id={habit.id}
                            title={habit.title}
                            subtitle={habit.subtitle}
                            icon={habit.icon}
                            iconColor={habit.iconColor || group.color}
                            completed={habit.completed}
                            onToggle={(id, next) => onToggleHabit?.(id, next)}
                            theme={theme}
                            streak={habit.streak}
                            category={habit.category}
                            timeLabel={habit.timeLabel}
                          />
                        </div>

                        {/* Delete Action (Visible in Edit Mode or on hover) */}
                        {isEditMode && onDeleteHabit && (
                          <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            type="button"
                            onClick={() => onDeleteHabit(habit.id)}
                            className="w-7 h-7 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 flex items-center justify-center transition-all cursor-pointer shrink-0"
                            title="Delete Habit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        )}
                      </div>
                    ))}
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
