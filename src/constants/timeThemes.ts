import type { TimeOfDay, TimeThemeConfig, TimeThemeColors } from '../types/theme';

/** Helper to construct immutable TimeThemeColors with array indexing and named keys */
function createColors(
  c0: string,
  c1: string,
  c2: string,
  c3: string,
  ink: string
): TimeThemeColors {
  const stops: [string, string, string, string] = [c0, c1, c2, c3];
  return {
    0: c0,
    1: c1,
    2: c2,
    3: c3,
    stops,
    primary: c0,
    secondary: c1,
    accent: c2,
    background: c3,
    surface: c3,
    sky: c0,
    ink,
  };
}

/** Complete configuration for all 4 periods */
export const TIME_THEMES: Record<TimeOfDay, TimeThemeConfig> = {
  morning: {
    period: 'morning',
    tag: 'Bright Beginnings',
    greeting: 'Good Morning',
    title: 'Bright Beginnings',
    subtitle: 'Energetic, warm and motivating. Perfect for starting the day.',
    colors: createColors(
      '#FF6B6B', // Sunrise crimson / coral
      '#FFA07A', // Warm salmon / apricot
      '#FFC83D', // Golden morning glow
      '#FFF5E6', // Warm cream background wash
      '#4A2545'  // Deep plum ink
    ),
    houseLightOn: false,
    celestial: 'sun',
  },
  afternoon: {
    period: 'afternoon',
    tag: 'Steady Progress',
    greeting: 'Good Afternoon',
    title: 'Steady Progress',
    subtitle: 'Focused, fresh and balanced. Keep going through the day.',
    colors: createColors(
      '#4C9EFF', // Clear sky blue
      '#7EC8FF', // Soft daylight cyan
      '#7ED957', // Fresh foliage green accent
      '#E8F6FF', // Crisp sky mist background wash
      '#1F3A5F'  // Deep navy ink
    ),
    houseLightOn: false,
    celestial: 'sun',
  },
  evening: {
    period: 'evening',
    tag: 'Unwind & Reflect',
    greeting: 'Good Evening',
    title: 'Unwind & Reflect',
    subtitle: 'Calm, elegant and introspective. Wind down and check in.',
    colors: createColors(
      '#8E7CFB', // Twilight lavender
      '#C9B8FF', // Soft lilac mist
      '#F4A7C6', // Sunset blossom pink accent
      '#FFE4EC', // Twilight blush background wash
      '#3B1E54'  // Deep purple noir ink
    ),
    houseLightOn: true,
    celestial: 'moon',
  },
  night: {
    period: 'night',
    tag: 'Rest & Recharge',
    greeting: 'Good Night',
    title: 'Rest & Recharge',
    subtitle: 'Peaceful, cozy and comforting. End the day with kindness.',
    colors: createColors(
      '#1E1B4B', // Midnight indigo
      '#4F46E5', // Royal starlight indigo
      '#A78BFA', // Moonlit violet accent
      '#E9D5FF', // Luminescent lavender background wash
      '#F8FAFF'  // Starlight white ink
    ),
    houseLightOn: true,
    celestial: 'moon',
  },
};

/** All 4 time-of-day periods in chronological order */
export const TIME_PERIODS: readonly TimeOfDay[] = [
  'morning',
  'afternoon',
  'evening',
  'night',
] as const;

/**
 * Maps hour of day (0-23) to corresponding TimeOfDay period:
 * - 05:00 - 11:59 -> 'morning'
 * - 12:00 - 16:59 -> 'afternoon'
 * - 17:00 - 20:59 -> 'evening'
 * - 21:00 - 04:59 -> 'night'
 */
export function getTimeOfDayFromHour(hour: number): TimeOfDay {
  const normalizedHour = ((Math.floor(hour) % 24) + 24) % 24;

  if (normalizedHour >= 5 && normalizedHour <= 11) {
    return 'morning';
  }
  if (normalizedHour >= 12 && normalizedHour <= 16) {
    return 'afternoon';
  }
  if (normalizedHour >= 17 && normalizedHour <= 20) {
    return 'evening';
  }
  return 'night';
}

/**
 * Returns previous chronological time of day period.
 * Used for opening orbital arc transitions so celestial body arrives from previous position.
 */
export function getPreviousTimeOfDay(current: TimeOfDay): TimeOfDay {
  switch (current) {
    case 'morning':
      return 'night';
    case 'afternoon':
      return 'morning';
    case 'evening':
      return 'afternoon';
    case 'night':
      return 'evening';
  }
}

/**
 * Returns next chronological time of day period.
 */
export function getNextTimeOfDay(current: TimeOfDay): TimeOfDay {
  switch (current) {
    case 'morning':
      return 'afternoon';
    case 'afternoon':
      return 'evening';
    case 'evening':
      return 'night';
    case 'night':
      return 'morning';
  }
}

/**
 * Convenience getter for time theme configuration
 */
export function getTimeTheme(period: TimeOfDay): TimeThemeConfig {
  return TIME_THEMES[period] ?? TIME_THEMES.morning;
}
