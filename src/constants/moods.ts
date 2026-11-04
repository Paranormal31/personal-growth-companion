import type { MoodPhase, MoodSliderConfig, MoodTheme } from '../types/mood';

export const MOOD_PHASES: readonly MoodPhase[] = ['bad', 'not_good', 'not_bad', 'good'] as const;

export const DEFAULT_MOOD_PHASE: MoodPhase = 'not_bad';

export const SLIDER_CONFIG: MoodSliderConfig = {
  min: 0,
  max: 3,
  step: 0.01,
  snapPoints: [0, 1, 2, 3],
};

export const MOOD_THEMES: Record<MoodPhase, MoodTheme> = {
  bad: {
    phase: 'bad',
    index: 0,
    label: 'Bad',
    sublabel: "It's okay to not be okay. Honor what you are feeling.",
    color: '#EB583B', // Coral Red
    inkColor: '#4A1208', // Deep maroon ink
    softBgColor: 'rgba(235, 88, 59, 0.16)',
    accentColor: '#FF8A75',
    normalizedPosition: 0.0,
    sliderValue: 0,
    faceConfig: {
      headTilt: -3,
      eyeShape: 'droop',
      eyeScaleX: 0.92,
      eyeScaleY: 0.88,
      pupilOffsetY: 6,
      eyebrowAngle: 18,
      eyebrowOffsetY: -5,
      mouthPath: 'M 32 68 Q 50 52 68 68',
      mouthOpenHeight: 0,
      tearOpacity: 0.9,
      blushOpacity: 0.0,
      sparkleOpacity: 0.0,
    },
    affirmations: [
      'Take a gentle breath. You do not have to carry everything alone.',
      'Allow yourself to feel and heal. Today is just one page.',
      'You are resilient, even when you feel tired.',
    ],
  },
  not_good: {
    phase: 'not_good',
    index: 1,
    label: 'Not Good',
    sublabel: 'Things feel heavy or off-track. One breath at a time.',
    color: '#F57C00', // Warm Orange
    inkColor: '#4E2600', // Burnt ochre ink
    softBgColor: 'rgba(245, 124, 0, 0.16)',
    accentColor: '#FFA726',
    normalizedPosition: 0.333,
    sliderValue: 1,
    faceConfig: {
      headTilt: -1.5,
      eyeShape: 'neutral',
      eyeScaleX: 0.98,
      eyeScaleY: 0.95,
      pupilOffsetY: 3,
      eyebrowAngle: 8,
      eyebrowOffsetY: -2,
      mouthPath: 'M 34 64 Q 50 60 66 64',
      mouthOpenHeight: 0,
      tearOpacity: 0.0,
      blushOpacity: 0.1,
      sparkleOpacity: 0.0,
    },
    affirmations: [
      'Small steps forward still count as progress.',
      'Be patient with yourself; not every moment has to be productive.',
      'A brief pause might be just what you need right now.',
    ],
  },
  not_bad: {
    phase: 'not_bad',
    index: 2,
    label: 'Not Bad',
    sublabel: 'Grounded and steady. Finding balance in the day.',
    color: '#F7B731', // Sunny Amber
    inkColor: '#4A3500', // Deep warm brown ink
    softBgColor: 'rgba(247, 183, 49, 0.16)',
    accentColor: '#FFD54F',
    normalizedPosition: 0.667,
    sliderValue: 2,
    faceConfig: {
      headTilt: 1,
      eyeShape: 'calm',
      eyeScaleX: 1.0,
      eyeScaleY: 1.0,
      pupilOffsetY: 0,
      eyebrowAngle: 0,
      eyebrowOffsetY: 0,
      mouthPath: 'M 34 60 Q 50 68 66 60',
      mouthOpenHeight: 2,
      tearOpacity: 0.0,
      blushOpacity: 0.45,
      sparkleOpacity: 0.0,
    },
    affirmations: [
      'Balance is a quiet strength. Keep holding this steady rhythm.',
      'Every peaceful moment builds a solid foundation.',
      'You are doing wonderfully. Appreciate how far you have come.',
    ],
  },
  good: {
    phase: 'good',
    index: 3,
    label: 'Good',
    sublabel: 'Full of vitality and vibrant joy! Keep shining.',
    color: '#98D837', // Lime Green
    inkColor: '#1E440A', // Forest green ink
    softBgColor: 'rgba(152, 216, 55, 0.18)',
    accentColor: '#B6E668',
    normalizedPosition: 1.0,
    sliderValue: 3,
    faceConfig: {
      headTilt: 3.5,
      eyeShape: 'crescent',
      eyeScaleX: 1.1,
      eyeScaleY: 1.15,
      pupilOffsetY: -3,
      eyebrowAngle: -9,
      eyebrowOffsetY: 3,
      mouthPath: 'M 28 54 Q 50 78 72 54',
      mouthOpenHeight: 14,
      tearOpacity: 0.0,
      blushOpacity: 0.8,
      sparkleOpacity: 1.0,
    },
    affirmations: [
      'Celebrate this feeling! Savor every ounce of your energy.',
      'Your positivity is contagious. Spread the warmth today!',
      'Hold onto this vibrant momentum for whatever comes next.',
    ],
  },
};

/**
 * Retrieve mood theme by phase name
 */
export function getMoodTheme(phase: MoodPhase): MoodTheme {
  return MOOD_THEMES[phase] ?? MOOD_THEMES[DEFAULT_MOOD_PHASE];
}

/**
 * Convert slider continuous value [0..3] into discrete MoodPhase
 */
export function getMoodPhaseFromValue(value: number): MoodPhase {
  const rounded = Math.round(Math.max(0, Math.min(3, value)));
  return MOOD_PHASES[rounded] ?? DEFAULT_MOOD_PHASE;
}

/**
 * Convert continuous slider progress [0..1] into discrete MoodPhase
 */
export function getMoodPhaseFromProgress(progress: number): MoodPhase {
  const scaled = progress * 3;
  return getMoodPhaseFromValue(scaled);
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

const MOOD_BG_RGB: RGB[] = [
  { r: 235, g: 88, b: 59 }, // bad: #EB583B
  { r: 245, g: 124, b: 0 }, // not_good: #F57C00
  { r: 247, g: 183, b: 49 }, // not_bad: #F7B731
  { r: 152, g: 216, b: 55 }, // good: #98D837
];

const MOOD_INK_RGB: RGB[] = [
  { r: 74, g: 18, b: 8 }, // bad: #4A1208
  { r: 78, g: 38, b: 0 }, // not_good: #4E2600
  { r: 74, g: 53, b: 0 }, // not_bad: #4A3500
  { r: 30, g: 68, b: 10 }, // good: #1E440A
];

function interpolateRGBList(palette: RGB[], value: number): string {
  const clamped = Math.max(0, Math.min(palette.length - 1, value));
  const lower = Math.floor(clamped);
  const upper = Math.min(palette.length - 1, Math.ceil(clamped));
  const t = clamped - lower;

  const c1 = palette[lower];
  const c2 = palette[upper];

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Interpolate dynamic tone-on-tone background color during continuous scrubbing (0..3)
 */
export function interpolateMoodColor(value: number): string {
  return interpolateRGBList(MOOD_BG_RGB, value);
}

/**
 * Interpolate dynamic tone-on-tone ink color during continuous scrubbing (0..3)
 */
export function interpolateInkColor(value: number): string {
  return interpolateRGBList(MOOD_INK_RGB, value);
}

