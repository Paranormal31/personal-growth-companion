import { useState, useEffect, useCallback } from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Activity,
  Utensils,
  Trophy,
  Moon,
  Sparkles,
  Sprout,
  Heart,
  BookOpen,
} from 'lucide-react';
import type { TimeOfDay } from '../types/theme';

export type HabitIconKey =
  | 'droplets'
  | 'wind'
  | 'sun'
  | 'activity'
  | 'utensils'
  | 'trophy'
  | 'moon'
  | 'sparkles'
  | 'sprout'
  | 'heart'
  | 'book';

export const HABIT_ICON_MAP: Record<
  HabitIconKey,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  droplets: Droplets,
  wind: Wind,
  sun: Sun,
  activity: Activity,
  utensils: Utensils,
  trophy: Trophy,
  moon: Moon,
  sparkles: Sparkles,
  sprout: Sprout,
  heart: Heart,
  book: BookOpen,
};

export interface StoredHabit {
  id: string;
  phase: TimeOfDay;
  title: string;
  subtitle: string;
  iconKey: HabitIconKey;
  iconColor: string;
  completed: boolean;
  streak: number;
  category: string;
  timeLabel: string;
}

export interface HabitData extends StoredHabit {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const STORAGE_KEY = 'pgc_habits_v2';

export const DEFAULT_STORED_HABITS: StoredHabit[] = [
  // Morning Rituals (Bright Beginnings)
  {
    id: 'habit-morning-1',
    phase: 'morning',
    title: 'Morning Hydration',
    subtitle: 'Drink a tall glass of fresh water to awaken your body',
    iconKey: 'droplets',
    iconColor: '#FF6B6B',
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
    iconKey: 'wind',
    iconColor: '#FFA07A',
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
    iconKey: 'sun',
    iconColor: '#FFC83D',
    completed: false,
    streak: 3,
    category: 'Vitality',
    timeLabel: '08:30 AM',
  },

  // Afternoon Energy (Steady Progress)
  {
    id: 'habit-afternoon-1',
    phase: 'afternoon',
    title: 'Nourishing Balanced Meal',
    subtitle: 'Eat mindfully and savor your fuel away from screens',
    iconKey: 'utensils',
    iconColor: '#7ED957',
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
    iconKey: 'activity',
    iconColor: '#4C9EFF',
    completed: false,
    streak: 5,
    category: 'Energy Reset',
    timeLabel: '03:30 PM',
  },

  // Evening Reflection (Unwind & Reflect)
  {
    id: 'habit-evening-1',
    phase: 'evening',
    title: 'Celebrate One Daily Win',
    subtitle: 'Acknowledge personal progress and gratitude today',
    iconKey: 'trophy',
    iconColor: '#F4A7C6',
    completed: false,
    streak: 9,
    category: 'Reflection',
    timeLabel: '07:30 PM',
  },
  {
    id: 'habit-evening-2',
    phase: 'evening',
    title: 'Sunset Unwind & Journal',
    subtitle: 'Softly note your thoughts and release daily tension',
    iconKey: 'book',
    iconColor: '#8E7CFB',
    completed: false,
    streak: 7,
    category: 'Reflection',
    timeLabel: '08:30 PM',
  },

  // Night Wind-Down (Rest & Recharge)
  {
    id: 'habit-night-1',
    phase: 'night',
    title: 'Digital Sunset & Dim Lights',
    subtitle: 'Power down bright screens 30 minutes before sleep',
    iconKey: 'moon',
    iconColor: '#A78BFA',
    completed: false,
    streak: 15,
    category: 'Sleep Hygiene',
    timeLabel: '10:00 PM',
  },
  {
    id: 'habit-night-2',
    phase: 'night',
    title: 'Gratitude Peace Ritual',
    subtitle: 'Rest in deep restorative stillness and peaceful joy',
    iconKey: 'heart',
    iconColor: '#E9D5FF',
    completed: false,
    streak: 8,
    category: 'Sleep Prep',
    timeLabel: '10:30 PM',
  },
];

function hydrateHabit(stored: StoredHabit): HabitData {
  return {
    ...stored,
    icon: HABIT_ICON_MAP[stored.iconKey] ?? Droplets,
  };
}

export function useHabitsStorage() {
  const [storedHabits, setStoredHabits] = useState<StoredHabit[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_STORED_HABITS;
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STORED_HABITS;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedHabits));
    } catch {
      // Ignore quota/private mode errors
    }
  }, [storedHabits]);

  // Hydrated habits with React icon components
  const habits: HabitData[] = storedHabits.map(hydrateHabit);

  // Toggle habit completed
  const toggleHabit = useCallback((id: string, nextCompleted: boolean) => {
    setStoredHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const updatedStreak = nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          return { ...h, completed: nextCompleted, streak: updatedStreak };
        }
        return h;
      })
    );
  }, []);

  // Add new habit
  const addHabit = useCallback(
    (newHabit: Omit<StoredHabit, 'id' | 'completed' | 'streak'>) => {
      const id = `habit-${newHabit.phase}-${Date.now()}`;
      const habitEntry: StoredHabit = {
        ...newHabit,
        id,
        completed: false,
        streak: 0,
      };
      setStoredHabits((prev) => [...prev, habitEntry]);
      return id;
    },
    []
  );

  // Remove habit
  const removeHabit = useCallback((id: string) => {
    setStoredHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  // Reset completions for a fresh demo day
  const resetCompletions = useCallback(() => {
    setStoredHabits((prev) => prev.map((h) => ({ ...h, completed: false })));
  }, []);

  // Restore defaults
  const restoreDefaults = useCallback(() => {
    setStoredHabits(DEFAULT_STORED_HABITS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return {
    habits,
    storedHabits,
    toggleHabit,
    addHabit,
    removeHabit,
    resetCompletions,
    restoreDefaults,
  };
}
