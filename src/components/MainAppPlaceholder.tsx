import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  Smile,
  ArrowRight,
  Sprout,
  Activity,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import type { MoodPhase } from '../types/mood';
import type { TimeOfDay, TimeThemeConfig } from '../types/theme';
import { MOOD_THEMES } from '../constants/moods';
import { getTimeTheme } from '../constants/timeThemes';
import { ScenicLandscape } from './scenery/ScenicLandscape';
import { HabitItem } from './dashboard/HabitItem';

export interface MainAppPlaceholderProps {
  /** Callback to re-open the Mood Meter modal */
  onOpenMoodMeter: () => void;
  /** Current logged mood phase */
  currentPhase: MoodPhase;
  /** Active time of day period ('morning' | 'afternoon' | 'evening' | 'night') */
  period?: TimeOfDay;
  /** Full active time theme configuration */
  timeTheme?: TimeThemeConfig;
  /** Numeric key triggering orbital arc animations in ScenicLandscape */
  replayKey?: number;
  /** Callback when user triggers celestial orbital transition replay */
  onReplay?: () => void;
  /** Optional custom container CSS classes */
  className?: string;
}

interface HabitTask {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  completed: boolean;
  streak: number;
  category: string;
  timeLabel: string;
}

const INITIAL_TASKS: HabitTask[] = [
  {
    id: 'habit-1',
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
    id: 'habit-2',
    title: '5-Minute Mindful Breathing',
    subtitle: 'Ground yourself with calm, deep diaphragmatic breaths',
    icon: Wind,
    iconColor: '#7C3AED',
    completed: true,
    streak: 4,
    category: 'Mindfulness',
    timeLabel: '08:15 AM',
  },
  {
    id: 'habit-3',
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
    id: 'habit-4',
    title: 'Mindful Walk & Movement',
    subtitle: 'Step outside or gently stretch to reset physical energy',
    icon: Activity,
    iconColor: '#E11D48',
    completed: false,
    streak: 5,
    category: 'Vitality',
    timeLabel: '03:30 PM',
  },
  {
    id: 'habit-5',
    title: 'Celebrate One Daily Win',
    subtitle: 'Acknowledge your personal progress and gratitude today',
    icon: Trophy,
    iconColor: '#D97706',
    completed: false,
    streak: 9,
    category: 'Reflection',
    timeLabel: '08:00 PM',
  },
];

/**
 * MainAppPlaceholder — Dashboard Screen representing Stage 2 (Grow).
 *
 * Built with Fabulous-inspired personal growth principles:
 * - Dynamic living hero landscape that evolves across Morning, Afternoon, Evening, and Night
 * - Strictly styled in the Outfit brand font with theme-reactive ink and surface tones
 * - Rich habit items with celebratory confetti spark bursts and streak counters
 * - Prominent and elegant Check-in Mood action to revisit Phase 1 Mood Meter
 */
export function MainAppPlaceholder({
  onOpenMoodMeter,
  currentPhase,
  period,
  timeTheme: propTimeTheme,
  replayKey = 0,
  onReplay,
  className = '',
}: MainAppPlaceholderProps) {
  const [tasks, setTasks] = useState<HabitTask[]>(INITIAL_TASKS);

  // Derive resolved active theme and period
  const activeTheme = useMemo(() => {
    if (propTimeTheme) return propTimeTheme;
    return getTimeTheme(period ?? 'morning');
  }, [propTimeTheme, period]);

  const activePeriod: TimeOfDay = activeTheme.period;
  const isNight = activePeriod === 'night';
  const currentMoodTheme = MOOD_THEMES[currentPhase] ?? MOOD_THEMES.not_bad;

  // Streak & progress statistics
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);
  const totalStreakDays = useMemo(() => {
    return tasks.reduce((max, t) => Math.max(max, t.streak), 0);
  }, [tasks]);

  const handleToggleTask = (id: string, nextCompleted: boolean) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updatedStreak = nextCompleted ? t.streak + 1 : Math.max(1, t.streak - 1);
          return { ...t, completed: nextCompleted, streak: updatedStreak };
        }
        return t;
      })
    );
  };

  // Period icon mapping
  const PeriodIcon = useMemo(() => {
    switch (activePeriod) {
      case 'morning':
        return Sun;
      case 'afternoon':
        return SunMedium;
      case 'evening':
        return Sunset;
      case 'night':
        return Moon;
    }
  }, [activePeriod]);

  // Today's date string
  const [todayDateString] = useState(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  });

  // Adaptive background and ink colors
  const containerBg = isNight
    ? '#13112A'
    : activeTheme.colors.surface || activeTheme.colors.background || '#FAF7F2';

  const inkColor = isNight ? '#F8FAFF' : activeTheme.colors.ink;

  return (
    <div
      className={`w-full h-full flex flex-col justify-between overflow-hidden relative select-none font-['Outfit'] transition-colors duration-500 ${className}`}
      style={{
        backgroundColor: containerBg,
        color: inkColor,
      }}
    >
      {/* Scrollable Main Content Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-5 pt-6 pb-24 flex flex-col gap-4">
        {/* ============================================================== */}
        {/* TOP STATUS BAR: Period Tag + Stage Pill + Today Date           */}
        {/* ============================================================== */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Period Tag Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300"
              style={{
                backgroundColor: isNight
                  ? 'rgba(255, 255, 255, 0.12)'
                  : `${activeTheme.colors.primary}18`,
                color: isNight ? '#E0E7FF' : activeTheme.colors.ink,
                border: `1px solid ${
                  isNight ? 'rgba(255, 255, 255, 0.18)' : `${activeTheme.colors.primary}32`
                }`,
              }}
            >
              <PeriodIcon
                className="w-3.5 h-3.5"
                style={{
                  color: isNight ? activeTheme.colors.accent : activeTheme.colors.primary,
                }}
              />
              <span className="capitalize">{activePeriod}</span>
            </div>

            {/* Stage indicator */}
            <div
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold opacity-75"
              style={{
                backgroundColor: isNight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(16, 185, 129, 0.12)',
                color: isNight ? '#C7D2FE' : '#065F46',
              }}
            >
              <Sprout className="w-3 h-3 text-emerald-500" />
              <span>Stage 2: Grow</span>
            </div>
          </div>

          <div
            className="text-xs font-semibold opacity-75 tracking-tight"
            style={{ color: isNight ? '#C7D2FE' : activeTheme.colors.ink }}
          >
            {todayDateString}
          </div>
        </header>

        {/* ============================================================== */}
        {/* GREETING, GREETING TITLE & SUBTITLE                            */}
        {/* ============================================================== */}
        <section className="space-y-1">
          <p
            className="text-xs font-extrabold uppercase tracking-widest opacity-80"
            style={{
              color: isNight ? activeTheme.colors.accent : activeTheme.colors.primary,
            }}
          >
            {activeTheme.greeting}
          </p>
          <h1
            className="text-2xl sm:text-[28px] font-black tracking-tight leading-tight"
            style={{ color: isNight ? '#FFFFFF' : activeTheme.colors.ink }}
          >
            {activeTheme.title}
          </h1>
          <p
            className="text-xs sm:text-sm font-medium leading-relaxed opacity-85"
            style={{ color: isNight ? '#E0E7FF' : activeTheme.colors.ink }}
          >
            {activeTheme.subtitle}
          </p>
        </section>

        {/* ============================================================== */}
        {/* HERO AREA: Living Scenic Landscape                             */}
        {/* ============================================================== */}
        <section className="relative group rounded-[28px] md:rounded-[36px] overflow-hidden shadow-md transition-shadow hover:shadow-lg">
          <ScenicLandscape
            period={activePeriod}
            theme={activeTheme}
            replayKey={replayKey}
            interactive={true}
            onCelestialTap={onReplay}
            className="w-full"
          />

          {/* Quick celestial replay chip */}
          {onReplay && (
            <button
              type="button"
              onClick={onReplay}
              className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/45 hover:bg-black/65 text-white/90 hover:text-white text-[11px] font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1 cursor-pointer opacity-85 hover:opacity-100 shadow-xs"
              title="Replay celestial orbital entrance"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay Arc</span>
            </button>
          )}
        </section>

        {/* ============================================================== */}
        {/* PROMINENT ELEGANT CHECK-IN MOOD ACTION                         */}
        {/* ============================================================== */}
        <section>
          <motion.button
            type="button"
            onClick={onOpenMoodMeter}
            whileHover={{ scale: 1.015, y: -2 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="w-full text-left p-4 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden group shadow-xs hover:shadow-md relative"
            style={{
              backgroundColor: isNight ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
              borderColor: isNight
                ? 'rgba(255, 255, 255, 0.16)'
                : `${activeTheme.colors.primary}35`,
            }}
          >
            {/* Ambient soft glow radiating from current mood color */}
            <div
              className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: currentMoodTheme.color }}
            />

            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Mood Face Badge with dynamic color & glow */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-108 shrink-0 relative"
                  style={{
                    backgroundColor: currentMoodTheme.color,
                    boxShadow: `0 6px 18px ${currentMoodTheme.color}50`,
                  }}
                >
                  <Smile className="w-6 h-6 stroke-[2.3]" />
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-widest opacity-70"
                      style={{ color: isNight ? '#CBD5E1' : activeTheme.colors.ink }}
                    >
                      Logged Mood
                    </span>
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: currentMoodTheme.color }}
                    />
                  </div>
                  <p
                    className="text-base font-black truncate"
                    style={{ color: isNight ? '#FFFFFF' : activeTheme.colors.ink }}
                  >
                    Feeling {currentMoodTheme.label}
                  </p>
                  <p
                    className="text-xs font-normal opacity-75 truncate"
                    style={{ color: isNight ? '#C7D2FE' : activeTheme.colors.ink }}
                  >
                    {currentMoodTheme.sublabel}
                  </p>
                </div>
              </div>

              {/* Action Pill CTA */}
              <div
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs group-hover:shadow-sm transition-all shrink-0"
                style={{
                  backgroundColor: isNight
                    ? activeTheme.colors.accent
                    : activeTheme.colors.primary,
                  color: isNight ? '#1E1B4B' : '#FFFFFF',
                }}
              >
                <span>Check in</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>
        </section>

        {/* ============================================================== */}
        {/* MOTIVATIONAL STREAK & PROGRESS CARD                            */}
        {/* ============================================================== */}
        <section
          className="p-4 rounded-3xl border shadow-xs relative overflow-hidden transition-colors duration-300"
          style={{
            backgroundColor: isNight
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.75)',
            borderColor: isNight
              ? 'rgba(255, 255, 255, 0.12)'
              : `${activeTheme.colors.primary}25`,
          }}
        >
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-500 mb-1">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>{totalStreakDays}-Day Win Streak</span>
              </div>
              <p
                className="text-xs sm:text-sm font-semibold leading-snug"
                style={{ color: isNight ? '#F8FAFF' : activeTheme.colors.ink }}
              >
                &ldquo;Every small win deserves recognition.&rdquo;
              </p>
            </div>
            <div className="text-right shrink-0">
              <span
                className="text-xl font-black"
                style={{ color: isNight ? '#FFFFFF' : activeTheme.colors.ink }}
              >
                {progressPercent}%
              </span>
              <p
                className="text-[10px] font-bold uppercase tracking-wider opacity-70"
                style={{ color: isNight ? '#C7D2FE' : activeTheme.colors.ink }}
              >
                {completedCount}/{tasks.length} Done
              </p>
            </div>
          </div>

          {/* Animated Progress Track */}
          <div
            className="w-full h-2 rounded-full mt-3 overflow-hidden"
            style={{
              backgroundColor: isNight ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.07)',
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${activeTheme.colors.primary}, ${activeTheme.colors.accent})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* DAILY HABITS & RITUALS SECTION WITH CONFETTI BURSTS            */}
        {/* ============================================================== */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h2
              className="text-xs font-black uppercase tracking-wider opacity-75"
              style={{ color: isNight ? '#CBD5E1' : activeTheme.colors.ink }}
            >
              Daily Rituals
            </h2>
            <span
              className="text-[11px] font-semibold opacity-65"
              style={{ color: isNight ? '#C7D2FE' : activeTheme.colors.ink }}
            >
              Tap to check off
            </span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <HabitItem
                key={task.id}
                id={task.id}
                title={task.title}
                subtitle={task.subtitle}
                icon={task.icon}
                iconColor={task.iconColor}
                completed={task.completed}
                streak={task.streak}
                category={task.category}
                timeLabel={task.timeLabel}
                onToggle={handleToggleTask}
                theme={activeTheme}
                className={
                  isNight
                    ? 'border-white/10 hover:border-white/20'
                    : undefined
                }
              />
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* COMPANION NOTE (Fabulous Philosophy)                           */}
        {/* ============================================================== */}
        <section
          className="p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 transition-colors duration-300"
          style={{
            backgroundColor: isNight
              ? 'rgba(255, 255, 255, 0.05)'
              : `${activeTheme.colors.primary}0D`,
            borderColor: isNight
              ? 'rgba(255, 255, 255, 0.12)'
              : `${activeTheme.colors.primary}20`,
            color: isNight ? '#E0E7FF' : activeTheme.colors.ink,
          }}
        >
          <Sparkles
            className="w-4 h-4 shrink-0 mt-0.5"
            style={{
              color: isNight ? activeTheme.colors.accent : activeTheme.colors.primary,
            }}
          />
          <p>
            <strong className="font-bold">Companion Note:</strong> Remember that consistency
            is built through gentle persistence, not perfection.
          </p>
        </section>
      </div>

      {/* ============================================================== */}
      {/* FLOATING ACTION BOTTOM DOCK FOR EASY CHECK-IN ACCESS           */}
      {/* ============================================================== */}
      <footer className="absolute bottom-3 inset-x-4 sm:inset-x-5 z-20 pointer-events-auto">
        <motion.button
          type="button"
          onClick={onOpenMoodMeter}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          className="w-full py-3 px-6 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2.5 cursor-pointer ring-1 ring-white/15"
          style={{
            backgroundColor: isNight ? '#4338CA' : '#1C1917',
          }}
        >
          <div
            className="w-3 h-3 rounded-full transition-colors animate-pulse"
            style={{ backgroundColor: currentMoodTheme.color }}
          />
          <span>Check-in Mood</span>
          <Smile className="w-4 h-4 opacity-85" />
        </motion.button>
      </footer>
    </div>
  );
}

export default MainAppPlaceholder;
