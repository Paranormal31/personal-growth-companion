/**
 * Mood Meter Types & Data Contracts
 * Personal Growth Companion - Phase 1: Mood Meter UI
 */

export type MoodPhase = 'bad' | 'not_good' | 'not_bad' | 'good';

export interface MoodFaceConfig {
  /** Tilt angle in degrees for the head/face container */
  headTilt: number;
  /** Eye shape style */
  eyeShape: 'droop' | 'neutral' | 'calm' | 'crescent';
  /** Eye scale factor for squash & stretch */
  eyeScaleY: number;
  eyeScaleX: number;
  /** Eye offset from center */
  pupilOffsetY: number;
  /** Eyebrow angle in degrees (positive = worried/sad, negative = determined, 0 = neutral) */
  eyebrowAngle: number;
  /** Eyebrow vertical offset */
  eyebrowOffsetY: number;
  /** SVG path for mouth */
  mouthPath: string;
  /** Mouth open height if mouth has fill */
  mouthOpenHeight?: number;
  /** Tear particle visibility (0 to 1) */
  tearOpacity: number;
  /** Cheek blush opacity (0 to 1) */
  blushOpacity: number;
  /** Sparkle / stars visibility (0 to 1) */
  sparkleOpacity: number;
}

export interface MoodTheme {
  /** Unique phase identifier */
  phase: MoodPhase;
  /** Integer index 0..3 */
  index: number;
  /** Short label for the phase */
  label: 'Bad' | 'Not Good' | 'Not Bad' | 'Good';
  /** Empathetic, supportive description */
  sublabel: string;
  /** Main vibrant background color hex */
  color: string;
  /** Dark ink color for SVG facial features and typography */
  inkColor: string;
  /** Light/tinted container background */
  softBgColor: string;
  /** Subtle accent/highlight color */
  accentColor: string;
  /** Normalized slider target position [0.0 - 1.0] */
  normalizedPosition: number;
  /** Discrete slider step value [0..3] */
  sliderValue: number;
  /** Facial features geometry and expression configuration */
  faceConfig: MoodFaceConfig;
  /** Supportive micro-messages aligned with Fabulous philosophy */
  affirmations: string[];
}

export interface MoodEntry {
  id: string;
  mood: MoodPhase;
  sliderValue: number;
  note?: string;
  timestamp: string;
  tags?: string[];
}

export interface MoodMeterState {
  currentPhase: MoodPhase;
  sliderValue: number;
  note: string;
  isNoteOpen: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submittedEntry: MoodEntry | null;
}

export interface MoodSliderConfig {
  min: number;
  max: number;
  step: number;
  snapPoints: number[];
}
