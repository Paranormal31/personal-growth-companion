import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Smile,
  Calendar,
} from 'lucide-react';
import type { MoodPhase } from '../../types/mood';
import type { TimeOfDay, TimeThemeConfig } from '../../types/theme';
import { getTimeTheme, TIME_THEMES } from '../../constants/timeThemes';
import { MOOD_THEMES } from '../../constants/moods';
import { ProceduralLandscape } from '../scenery/ProceduralLandscape';
import { CelestialPhaseTransition } from '../scenery/CelestialPhaseTransition';
import { BottomNavDock, type DashboardTab } from './BottomNavDock';
import { DashboardChecklistCard } from './DashboardChecklistCard';
import { MoodMeterSheet } from './MoodMeterSheet';
import { SettingsSheet } from './SettingsSheet';
import { AddHabitSheet } from './AddHabitSheet';
import { useHabitsStorage } from '../../hooks/useHabitsStorage';

export interface UnifiedDashboardProps {
  /** Optional initial or controlled time-of-day */
  initialTimeOfDay?: TimeOfDay;
  /** Active mood phase */
  moodPhase?: MoodPhase;
  /** Callback when mood phase changes */
  onMoodChange?: (phase: MoodPhase) => void;
  /** Custom CSS classes for the container */
  className?: string;
  /** External time controls if provided by parent */
  timeControls?: {
    currentTime: TimeOfDay;
    theme: TimeThemeConfig;
    setTimeOfDay: (time: TimeOfDay) => void;
    replayKey?: number;
    triggerReplay?: () => void;
  };
  /** Alias for timeControls */
  externalTimeControls?: {
    currentTime: TimeOfDay;
    theme: TimeThemeConfig;
    setTimeOfDay: (time: TimeOfDay) => void;
    replayKey?: number;
    triggerReplay?: () => void;
  };
}

const PHASE_MAP: Record<
  TimeOfDay,
  { progress: number; icon: typeof Sun; color: string; border: string; glow: string }
> = {
  morning: {
    progress: 0.0,
    icon: Sun,
    color: '#FF6B6B',
    border: 'rgba(255, 107, 107, 0.4)',
    glow: 'rgba(255, 107, 107, 0.3)',
  },
  afternoon: {
    progress: 1.0,
    icon: SunMedium,
    color: '#4C9EFF',
    border: 'rgba(76, 158, 255, 0.4)',
    glow: 'rgba(76, 158, 255, 0.3)',
  },
  evening: {
    progress: 2.0,
    icon: Sunset,
    color: '#8E7CFB',
    border: 'rgba(142, 124, 251, 0.4)',
    glow: 'rgba(142, 124, 251, 0.3)',
  },
  night: {
    progress: 3.0,
    icon: Moon,
    color: '#4F46E5',
    border: 'rgba(167, 139, 250, 0.4)',
    glow: 'rgba(79, 70, 229, 0.3)',
  },
};

/**
 * UnifiedDashboard
 *
 * Flagship screen integrating:
 * 1. Living procedural celestial landscape vector background with physical mountain occlusion
 * 2. Top minimal frosted sky badge with exact reference period titles and mood indicator
 * 3. Daily ritual checklist card with habit CRUD (Add, Toggle, Delete) and localStorage persistence
 * 4. Frosted bottom navigation dock (Today, Rituals, Mood, Settings) with reference themes
 * 5. Slide-up drawers for Add Habit, Mood Meter, and Settings
 */
export function UnifiedDashboard({
  initialTimeOfDay = 'morning',
  moodPhase: propMoodPhase,
  onMoodChange,
  className = '',
  timeControls,
  externalTimeControls: propExternalTimeControls,
}: UnifiedDashboardProps) {
  const activeTimeControls = timeControls ?? propExternalTimeControls;

  // Habit CRUD and localStorage persistence hook
  const {
    habits,
    addHabit,
    removeHabit,
    toggleHabit,
    resetCompletions,
    restoreDefaults,
  } = useHabitsStorage();

  // Navigation & Modal sheets state
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [isMoodSheetOpen, setIsMoodSheetOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [isAddHabitSheetOpen, setIsAddHabitSheetOpen] = useState(false);

  // Mood state
  const [moodPhase, setMoodPhase] = useState<MoodPhase>(propMoodPhase ?? 'not_bad');
  const [continuousMoodValue, setContinuousMoodValue] = useState<number | undefined>(undefined);

  // Time-of-day state
  const [internalTimeOfDay, setInternalTimeOfDay] = useState<TimeOfDay>(initialTimeOfDay);
  const currentTimeOfDay = activeTimeControls?.currentTime ?? internalTimeOfDay;
  const currentTheme =
    activeTimeControls?.theme ?? (TIME_THEMES[currentTimeOfDay] ?? getTimeTheme(currentTimeOfDay));

  // Celestial 24h simulation loop
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [cycleDuration, setCycleDuration] = useState(18); // seconds
  const [autoPlayProgress, setAutoPlayProgress] = useState<number | null>(null);

  const autoPlayAnimRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Derived progress: if autoPlay is active and autoPlayProgress is set, use it; otherwise use static phase progress
  const staticProgress = PHASE_MAP[currentTimeOfDay]?.progress ?? 0;
  const continuousProgress =
    isAutoPlay && autoPlayProgress !== null ? autoPlayProgress : staticProgress;

  // Continuous loop runner
  useEffect(() => {
    if (!isAutoPlay) {
      if (autoPlayAnimRef.current !== null) {
        cancelAnimationFrame(autoPlayAnimRef.current);
        autoPlayAnimRef.current = null;
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setAutoPlayProgress((prev) => {
        const current = prev ?? staticProgress;
        const next = (current + (delta / cycleDuration) * 4) % 4;

        // Auto-detect phase from progress
        let detectedPhase: TimeOfDay = 'morning';
        if (next >= 0.5 && next < 1.5) detectedPhase = 'afternoon';
        else if (next >= 1.5 && next < 2.5) detectedPhase = 'evening';
        else if (next >= 2.5 && next < 3.5) detectedPhase = 'night';

        if (detectedPhase !== currentTimeOfDay) {
          if (activeTimeControls?.setTimeOfDay) {
            activeTimeControls.setTimeOfDay(detectedPhase);
          } else {
            setInternalTimeOfDay(detectedPhase);
          }
        }

        return next;
      });

      autoPlayAnimRef.current = requestAnimationFrame(loop);
    };

    autoPlayAnimRef.current = requestAnimationFrame(loop);

    return () => {
      if (autoPlayAnimRef.current !== null) {
        cancelAnimationFrame(autoPlayAnimRef.current);
        autoPlayAnimRef.current = null;
      }
    };
  }, [isAutoPlay, cycleDuration, currentTimeOfDay, activeTimeControls, staticProgress]);

  // Handle Tab Change
  const handleTabChange = useCallback((tab: DashboardTab) => {
    if (tab === 'mood') {
      setIsMoodSheetOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsSheetOpen(true);
    } else {
      setActiveTab(tab);
    }
  }, []);

  // Handle time switch from settings
  const handleSelectTime = useCallback(
    (time: TimeOfDay) => {
      setIsAutoPlay(false);
      setAutoPlayProgress(null);
      if (activeTimeControls?.setTimeOfDay) {
        activeTimeControls.setTimeOfDay(time);
      } else {
        setInternalTimeOfDay(time);
      }
    },
    [activeTimeControls]
  );

  // Active Phase Config
  const activePhaseMeta = PHASE_MAP[currentTimeOfDay] ?? PHASE_MAP.morning;
  const PhaseIcon = activePhaseMeta.icon;

  // Active Mood config
  const activeMoodTheme = MOOD_THEMES[moodPhase] ?? MOOD_THEMES.not_bad;

  // Today Date formatted string
  const [todayDateString] = useState(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  });

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none font-['Outfit'] ${className}`}
    >
      {/* ================================================================ */}
      {/* 1. LIVING PROCEDURAL SCENERY CANVAS (Physical Mountain Occlusion) */}
      {/* ================================================================ */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <ProceduralLandscape
          progress={continuousProgress}
          phase={currentTimeOfDay}
          animateClouds={true}
          className="w-full h-full object-cover"
          celestialHtml={
            <CelestialPhaseTransition
              progress={continuousProgress}
              phase={currentTimeOfDay}
              size={106}
              animated={true}
              interactive={true}
            />
          }
        />
      </div>

      {/* ================================================================ */}
      {/* 2. TOP MINIMAL SKY BADGE & MOOD INDICATOR                        */}
      {/* ================================================================ */}
      <header className="absolute top-3.5 sm:top-5 inset-x-3.5 sm:inset-x-5 z-20 flex items-center justify-between pointer-events-none">
        {/* Living Time-of-Day Tag Pill */}
        <motion.button
          type="button"
          onClick={() => setIsSettingsSheetOpen(true)}
          key={currentTimeOfDay}
          initial={{ opacity: 0, y: -6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl border text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all active:scale-95 cursor-pointer"
          style={{
            backgroundColor: activePhaseMeta.glow,
            borderColor: activePhaseMeta.border,
          }}
          title="Open Settings & Time Controls"
        >
          <PhaseIcon className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="text-xs font-bold tracking-tight">
            {currentTheme.tag}
          </span>
        </motion.button>

        {/* Date and Quick Mood Pill */}
        <div className="flex items-center gap-1.5">
          <div className="hidden xs:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 text-white/90 text-xs font-medium shadow-xs">
            <Calendar className="w-3 h-3 opacity-70" />
            <span>{todayDateString}</span>
          </div>

          <motion.button
            type="button"
            onClick={() => setIsMoodSheetOpen(true)}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 text-stone-100 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:border-white/35 transition-colors cursor-pointer"
            title="Log Your Mood"
          >
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 border border-white/20"
              style={{ backgroundColor: activeMoodTheme.color }}
            >
              <Smile className="w-3 h-3 text-stone-900" />
            </div>
            <span className="text-xs font-semibold tracking-tight text-white capitalize">
              {activeMoodTheme.label}
            </span>
          </motion.button>
        </div>
      </header>

      {/* ================================================================ */}
      {/* 3. CENTER / LOWER SCENE: FLOATING DAILY RITUAL CHECKLIST CARD     */}
      {/* ================================================================ */}
      <main className="absolute inset-x-3.5 sm:inset-x-5 top-[48%] bottom-20 z-10 pointer-events-auto flex flex-col overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="w-full h-full flex flex-col overflow-hidden"
        >
          <DashboardChecklistCard
            timeOfDay={currentTimeOfDay}
            theme={currentTheme}
            habits={habits}
            expandAll={activeTab === 'habits'}
            onToggleHabit={toggleHabit}
            onDeleteHabit={removeHabit}
            onOpenAddHabit={() => setIsAddHabitSheetOpen(true)}
            className="w-full h-full"
          />
        </motion.div>
      </main>

      {/* ================================================================ */}
      {/* 4. FLOATING FROSTED BOTTOM NAVIGATION DOCK                       */}
      {/* ================================================================ */}
      <div className="absolute bottom-3 sm:bottom-4 inset-x-4 sm:inset-x-6 z-30 pointer-events-auto">
        <BottomNavDock
          activeTab={activeTab}
          onTabChange={handleTabChange}
          timeOfDay={currentTimeOfDay}
        />
      </div>

      {/* ================================================================ */}
      {/* 5. SLIDE-UP MODAL SHEETS                                         */}
      {/* ================================================================ */}
      {/* Add New Habit Sheet */}
      <AddHabitSheet
        isOpen={isAddHabitSheetOpen}
        onClose={() => setIsAddHabitSheetOpen(false)}
        onAddHabit={addHabit}
        activePhase={currentTimeOfDay}
      />

      {/* Mood Meter Sheet */}
      <MoodMeterSheet
        isOpen={isMoodSheetOpen}
        onClose={() => setIsMoodSheetOpen(false)}
        currentPhase={moodPhase}
        onPhaseChange={(phase) => {
          setMoodPhase(phase);
          onMoodChange?.(phase);
        }}
        continuousValue={continuousMoodValue}
        onContinuousChange={(val) => setContinuousMoodValue(val)}
      />

      {/* Settings Sheet */}
      <SettingsSheet
        isOpen={isSettingsSheetOpen}
        onClose={() => setIsSettingsSheetOpen(false)}
        timeOfDay={currentTimeOfDay}
        onSelectTimeOfDay={handleSelectTime}
        theme={currentTheme}
        isAutoPlay={isAutoPlay}
        onToggleAutoPlay={() => setIsAutoPlay((prev) => !prev)}
        onResetHabits={resetCompletions}
        onRestoreDefaults={restoreDefaults}
        cycleDuration={cycleDuration}
        onCycleDurationChange={(dur) => setCycleDuration(dur)}
      />
    </div>
  );
}

export default UnifiedDashboard;
