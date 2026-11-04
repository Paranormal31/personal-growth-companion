import { useState, useEffect, useCallback } from 'react';
import type { TimeOfDay, TimeThemeConfig } from '../types/theme';
import {
  getTimeOfDayFromHour,
  getPreviousTimeOfDay,
  getTimeTheme,
} from '../constants/timeThemes';

export interface UseTimeOfDayOptions {
  /** Optional initial manual override for testing / simulation */
  initialOverride?: TimeOfDay;
  /** Interval in ms to poll local system time (default 15,000ms = 15s) */
  syncIntervalMs?: number;
}

export interface UseTimeOfDayReturn {
  /** Active time of day period */
  currentTime: TimeOfDay;
  /** Chronologically previous time of day (for celestial orbital transitions) */
  previousTime: TimeOfDay;
  /** Whether the user/system is in manual simulation mode */
  isManualOverride: boolean;
  /** Manually switch time of day (activates simulation override) */
  setTimeOfDay: (time: TimeOfDay) => void;
  /** Return to live real-world clock time tracking */
  resetToLiveTime: () => void;
  /** Re-trigger the orbital entrance animation for the current time of day */
  triggerReplay: () => void;
  /** Numeric key incremented on time switch or replay to key Framer Motion animators */
  replayKey: number;
  /** Complete theme config for current time */
  theme: TimeThemeConfig;
  /** Complete theme config for previous time */
  previousTheme: TimeThemeConfig;
}

/**
 * useTimeOfDay
 *
 * Tracks local system clock time, supports interactive time-of-day simulation overrides,
 * and maintains previous state and replay keys for celestial orbital arc transitions.
 */
export function useTimeOfDay(options: UseTimeOfDayOptions = {}): UseTimeOfDayReturn {
  const { initialOverride, syncIntervalMs = 15000 } = options;

  const [isManualOverride, setIsManualOverride] = useState<boolean>(() => Boolean(initialOverride));

  const [currentTime, setCurrentTime] = useState<TimeOfDay>(() => {
    if (initialOverride) return initialOverride;
    return getTimeOfDayFromHour(new Date().getHours());
  });

  const [previousTime, setPreviousTime] = useState<TimeOfDay>(() => {
    return getPreviousTimeOfDay(currentTime);
  });

  const [replayKey, setReplayKey] = useState<number>(0);

  // Poll system clock when not in manual override mode
  useEffect(() => {
    if (isManualOverride) return;

    const checkLiveTime = () => {
      const liveHour = new Date().getHours();
      const livePeriod = getTimeOfDayFromHour(liveHour);

      setCurrentTime((prev) => {
        if (prev !== livePeriod) {
          setPreviousTime(prev);
          setReplayKey((k) => k + 1);
          return livePeriod;
        }
        return prev;
      });
    };

    const intervalId = window.setInterval(checkLiveTime, syncIntervalMs);
    return () => window.clearInterval(intervalId);
  }, [isManualOverride, syncIntervalMs]);

  /** Manually set time of day (activates manual override mode) */
  const setTimeOfDay = useCallback((newTime: TimeOfDay) => {
    setCurrentTime((prev) => {
      if (prev !== newTime) {
        setPreviousTime(prev);
        setReplayKey((k) => k + 1);
      }
      return newTime;
    });
    setIsManualOverride(true);
  }, []);

  /** Reset back to system clock time and clear override mode */
  const resetToLiveTime = useCallback(() => {
    const livePeriod = getTimeOfDayFromHour(new Date().getHours());
    setCurrentTime((prev) => {
      setPreviousTime(prev !== livePeriod ? prev : getPreviousTimeOfDay(livePeriod));
      return livePeriod;
    });
    setIsManualOverride(false);
    setReplayKey((k) => k + 1);
  }, []);

  /** Re-trigger celestial arc entrance animation */
  const triggerReplay = useCallback(() => {
    setCurrentTime((curr) => {
      setPreviousTime(getPreviousTimeOfDay(curr));
      return curr;
    });
    setReplayKey((k) => k + 1);
  }, []);

  const theme = getTimeTheme(currentTime);
  const previousTheme = getTimeTheme(previousTime);

  return {
    currentTime,
    previousTime,
    isManualOverride,
    setTimeOfDay,
    resetToLiveTime,
    triggerReplay,
    replayKey,
    theme,
    previousTheme,
  };
}
