/**
 * Time-of-Day Theme Types & Data Contracts
 * Personal Growth Companion — Scenic & Brand Integration
 */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type CelestialType = 'sun' | 'moon';

export interface TimeThemeColors {
  /** Hex 0: Dominant sky / primary gradient stop */
  primary: string;
  /** Hex 1: Secondary atmospheric horizon stop */
  secondary: string;
  /** Hex 2: Scenic landscape accent / golden hour / celestial glow */
  accent: string;
  /** Hex 3: Soft background wash / card surface container */
  background: string;
  /** Soft surface tint alias */
  surface: string;
  /** Primary sky alias */
  sky: string;
  /** High-contrast typography & icon ink color */
  ink: string;
  /** The 4 scenic palette stops in order [primary, secondary, accent, background] */
  stops: [string, string, string, string];
  /** Tuple indexed access support (e.g. colors[0], colors[1]) */
  0: string;
  1: string;
  2: string;
  3: string;
}

export interface TimeThemeConfig {
  /** Period identifier ('morning' | 'afternoon' | 'evening' | 'night') */
  period: TimeOfDay;
  /** Short inspirational tag e.g. 'Bright Beginnings' */
  tag: string;
  /** Contextual greeting e.g. 'Good Morning' */
  greeting: string;
  /** Header title */
  title: string;
  /** Subtitle with motivational reflection aligned with Fabulous philosophy */
  subtitle: string;
  /** Scenic palette colors & ink */
  colors: TimeThemeColors;
  /** Whether cozy window warm light in the cottage/house is turned on */
  houseLightOn: boolean;
  /** Celestial body displayed along orbital arc */
  celestial: CelestialType;
}

export interface TimeOfDayState {
  currentTime: TimeOfDay;
  previousTime: TimeOfDay;
  isManualOverride: boolean;
  replayKey: number;
}
