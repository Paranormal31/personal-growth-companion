import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  SunMedium,
  Sunset,
  Moon,
  RotateCcw,
  Sparkles,
  Radio,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import type { TimeOfDay, TimeThemeConfig } from '../../types/theme';
import type { UseTimeOfDayReturn } from '../../hooks/useTimeOfDay';
import { TIME_THEMES } from '../../constants/timeThemes';

export interface DesktopTimeDockProps {
  /** Current active time period */
  currentTime?: TimeOfDay;
  /** Manually switch time of day */
  setTimeOfDay?: (time: TimeOfDay) => void;
  /** Reset to real-world live system clock */
  resetToLiveTime?: () => void;
  /** Re-trigger the orbital arc celestial transition */
  triggerReplay?: () => void;
  /** Whether currently in manual simulation mode */
  isManualOverride?: boolean;
  /** Replay key counter from useTimeOfDay */
  replayKey?: number;
  /** Current active theme config */
  theme?: TimeThemeConfig;
  /** Alternatively pass the complete useTimeOfDay return object directly */
  timeControls?: UseTimeOfDayReturn;
  /** Custom container styling or positioning overrides */
  className?: string;
  /** Default to collapsed view on initial render */
  defaultCollapsed?: boolean;
  /** Enable keyboard hotkeys (1-4 for periods, R for replay, L for live) */
  enableKeyboardShortcuts?: boolean;
}

interface PeriodConfig {
  id: TimeOfDay;
  label: string;
  shortcut: string;
  timeRange: string;
  icon: typeof Sun;
  color: string;
  glowColor: string;
  accentBg: string;
}

const PERIODS: PeriodConfig[] = [
  {
    id: 'morning',
    label: 'Morning',
    shortcut: '1',
    timeRange: '06:00 – 12:00',
    icon: Sun,
    color: '#FF6B6B',
    glowColor: 'rgba(255, 107, 107, 0.45)',
    accentBg: 'rgba(255, 107, 107, 0.15)',
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    shortcut: '2',
    timeRange: '12:00 – 17:00',
    icon: SunMedium,
    color: '#4C9EFF',
    glowColor: 'rgba(76, 158, 255, 0.45)',
    accentBg: 'rgba(76, 158, 255, 0.15)',
  },
  {
    id: 'evening',
    label: 'Evening',
    shortcut: '3',
    timeRange: '17:00 – 21:00',
    icon: Sunset,
    color: '#8E7CFB',
    glowColor: 'rgba(142, 124, 251, 0.45)',
    accentBg: 'rgba(142, 124, 251, 0.15)',
  },
  {
    id: 'night',
    label: 'Night',
    shortcut: '4',
    timeRange: '21:00 – 06:00',
    icon: Moon,
    color: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.45)',
    accentBg: 'rgba(129, 140, 248, 0.15)',
  },
];

/**
 * DesktopTimeDock
 *
 * Floating desktop control panel positioned outside the phone mockup.
 * Provides developers and evaluators instant control over the 4 scenic time-of-day periods,
 * manual simulation override vs. live clock sync, and celestial orbital arc replay triggering.
 */
export function DesktopTimeDock({
  currentTime: propCurrentTime,
  setTimeOfDay: propSetTimeOfDay,
  resetToLiveTime: propResetToLiveTime,
  triggerReplay: propTriggerReplay,
  isManualOverride: propIsManualOverride,
  replayKey: propReplayKey,
  theme: propTheme,
  timeControls,
  className = '',
  defaultCollapsed = false,
  enableKeyboardShortcuts = true,
}: DesktopTimeDockProps) {
  // Extract state from either timeControls bundle or direct props
  const currentTime = timeControls?.currentTime ?? propCurrentTime ?? 'morning';
  const setTimeOfDay = timeControls?.setTimeOfDay ?? propSetTimeOfDay;
  const resetToLiveTime = timeControls?.resetToLiveTime ?? propResetToLiveTime;
  const triggerReplay = timeControls?.triggerReplay ?? propTriggerReplay;
  const isManualOverride = timeControls?.isManualOverride ?? propIsManualOverride ?? false;
  const replayKey = timeControls?.replayKey ?? propReplayKey ?? 0;
  const activeTheme = timeControls?.theme ?? propTheme ?? TIME_THEMES[currentTime];

  // Stable refs for event callbacks to avoid unnecessary re-subscriptions
  const setTimeOfDayRef = useRef(setTimeOfDay);
  const resetToLiveTimeRef = useRef(resetToLiveTime);
  const triggerReplayRef = useRef(triggerReplay);

  useEffect(() => {
    setTimeOfDayRef.current = setTimeOfDay;
    resetToLiveTimeRef.current = resetToLiveTime;
    triggerReplayRef.current = triggerReplay;
  });

  // UI state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const [localClockTime, setLocalClockTime] = useState<string>(() => {
    const d = new Date();
    return d.toTimeString().slice(0, 5);
  });

  // Keep live local clock updated every second
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setLocalClockTime(d.toTimeString().slice(0, 5));
    };
    const timerId = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timerId);
  }, []);

  // Handle replay click with animated icon feedback
  const handleReplayClick = useCallback(() => {
    setIsReplaying(true);
    triggerReplayRef.current?.();
    window.setTimeout(() => setIsReplaying(false), 650);
  }, []);

  const handleResetToLive = useCallback(() => {
    resetToLiveTimeRef.current?.();
  }, []);

  const handleSelectPeriod = useCallback((periodId: TimeOfDay) => {
    setTimeOfDayRef.current?.(periodId);
  }, []);

  // Keyboard hotkeys
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === '1') setTimeOfDayRef.current?.('morning');
      else if (key === '2') setTimeOfDayRef.current?.('afternoon');
      else if (key === '3') setTimeOfDayRef.current?.('evening');
      else if (key === '4') setTimeOfDayRef.current?.('night');
      else if (key === 'r') handleReplayClick();
      else if (key === 'l') resetToLiveTimeRef.current?.();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts, handleReplayClick]);

  // Current active period configuration
  const activePeriodConfig = useMemo(() => {
    return PERIODS.find((p) => p.id === currentTime) ?? PERIODS[0];
  }, [currentTime]);

  return (
    <aside
      aria-label="Time of Day Development Controls"
      className={`fixed z-50 transition-all duration-300 pointer-events-auto ${
        // Positioning outside phone mockup on desktop (top-right or custom),
        // and neat bottom-right floating pill on mobile screens
        className || 'bottom-4 right-4 md:bottom-auto md:top-6 md:right-6'
      }`}
    >
      <div
        className="relative rounded-2xl border border-white/12 bg-stone-900/90 text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-xl ring-1 ring-white/5 transition-all overflow-hidden"
        style={{
          boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${activePeriodConfig.color}25`,
        }}
      >
        {/* Subtle accent bar at very top indicating active theme color */}
        <div
          className="h-1 w-full transition-colors duration-500"
          style={{ backgroundColor: activePeriodConfig.color }}
        />

        {/* Collapsed Compact State */}
        {isCollapsed ? (
          <div className="flex items-center gap-2 p-2.5">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
              title="Expand Time Controls Dock"
            >
              <activePeriodConfig.icon
                className="w-4 h-4"
                style={{ color: activePeriodConfig.color }}
              />
              <span className="capitalize">{currentTime}</span>
              <span className="text-[10px] text-stone-400 font-mono">
                {localClockTime}
              </span>
              <Maximize2 className="w-3.5 h-3.5 ml-1 text-stone-400" />
            </button>

            {/* Quick Replay button even when collapsed */}
            <button
              type="button"
              onClick={handleReplayClick}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-all cursor-pointer"
              title="Replay Celestial Transition"
            >
              <RotateCcw
                className={`w-3.5 h-3.5 ${isReplaying ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        ) : (
          /* Expanded Full Dock Panel */
          <div className="p-3.5 w-[320px] sm:w-[340px] flex flex-col gap-3">
            {/* Header: Label + Clock Toggle Badge + Collapse */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: activePeriodConfig.accentBg }}
                >
                  <Sparkles
                    className="w-3.5 h-3.5"
                    style={{ color: activePeriodConfig.color }}
                  />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-200">
                    Time Dock
                  </h3>
                  <p className="text-[10px] text-stone-400 leading-none">
                    Orbital &amp; Scenery Simulator
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Live vs. Manual Status Badge */}
                <button
                  type="button"
                  onClick={handleResetToLive}
                  title={
                    isManualOverride
                      ? 'In Manual Mode. Click to return to Live Clock sync.'
                      : 'Live Clock Sync active. Click to refresh.'
                  }
                  className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-all cursor-pointer border ${
                    isManualOverride
                      ? 'bg-amber-950/60 text-amber-300 border-amber-600/40 hover:bg-amber-900/60'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/60'
                  }`}
                >
                  {/* Status Indicator Dot */}
                  <span className="relative flex h-2 w-2">
                    {!isManualOverride && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        isManualOverride ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                    />
                  </span>

                  <span>
                    {localClockTime} • {isManualOverride ? 'Manual' : 'Live'}
                  </span>

                  {isManualOverride && (
                    <RotateCcw className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition-all" />
                  )}
                </button>

                {/* Minimize Button */}
                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Minimize dock"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4 Sleek Period Pill Buttons */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5 px-0.5">
                <span>Select Period</span>
                <span className="font-mono text-stone-500 text-[9px]">Keys 1–4</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {PERIODS.map((period) => {
                  const Icon = period.icon;
                  const isActive = currentTime === period.id;

                  return (
                    <button
                      key={period.id}
                      type="button"
                      onClick={() => handleSelectPeriod(period.id)}
                      className={`relative flex items-center gap-2 p-2 rounded-xl text-left transition-all duration-200 cursor-pointer overflow-hidden border ${
                        isActive
                          ? 'border-white/30 text-white shadow-md'
                          : 'border-white/5 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white'
                      }`}
                      style={{
                        backgroundColor: isActive
                          ? period.accentBg
                          : undefined,
                        boxShadow: isActive
                          ? `0 0 16px ${period.glowColor}`
                          : undefined,
                        borderColor: isActive ? period.color : undefined,
                      }}
                    >
                      {/* Active glowing indicator pill backdrop */}
                      {isActive && (
                        <motion.div
                          layoutId="activePeriodDockIndicator"
                          className="absolute inset-0 rounded-xl pointer-events-none -z-10"
                          style={{
                            background: `linear-gradient(135deg, ${period.color}22 0%, rgba(255,255,255,0.04) 100%)`,
                          }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                          isActive ? 'scale-110' : 'group-hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: isActive
                            ? period.color
                            : 'rgba(255,255,255,0.08)',
                          color: isActive ? '#0F172A' : period.color,
                        }}
                      >
                        <Icon className="w-4 h-4 stroke-[2.3]" />
                      </div>

                      {/* Period Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold leading-tight truncate">
                            {period.label}
                          </p>
                          <span className="text-[9px] font-mono text-stone-400 opacity-60">
                            [{period.shortcut}]
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 font-mono leading-tight truncate">
                          {period.timeRange}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions Bar: Replay Transition + Theme Tag Reflection */}
            <div className="flex items-center gap-2 pt-1">
              {/* Replay Transition Button */}
              <motion.button
                type="button"
                onClick={handleReplayClick}
                whileTap={{ scale: 0.96 }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-stone-800 to-stone-750 hover:from-stone-750 hover:to-stone-700 text-white font-semibold text-xs border border-white/10 shadow-sm hover:shadow transition-all cursor-pointer group"
                title="Replays celestial orbital entrance animation from previous to current position"
              >
                <RotateCcw
                  className={`w-3.5 h-3.5 text-stone-300 group-hover:text-white transition-transform ${
                    isReplaying ? 'animate-spin' : 'group-hover:-rotate-45'
                  }`}
                  style={{
                    color: isReplaying ? activePeriodConfig.color : undefined,
                  }}
                />
                <span>Replay Transition</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black/40 text-stone-400 font-mono">
                  #{replayKey}
                </span>
              </motion.button>

              {/* Reset to Live shortcut button if in manual mode */}
              {isManualOverride && (
                <button
                  type="button"
                  onClick={handleResetToLive}
                  className="px-2.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 text-xs font-medium transition-all cursor-pointer flex items-center gap-1"
                  title="Reset to system clock (Key: L)"
                >
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Sync</span>
                </button>
              )}
            </div>

            {/* Contextual Active Period Meta Tag */}
            <div className="flex items-center justify-between text-[10px] text-stone-400 bg-black/30 rounded-lg px-2.5 py-1.5 border border-white/5 font-mono">
              <span className="truncate">
                {activeTheme.greeting} • &ldquo;{activeTheme.tag}&rdquo;
              </span>
              <span className="shrink-0 text-[9px] uppercase tracking-wider text-stone-500">
                {activeTheme.celestial}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default DesktopTimeDock;
