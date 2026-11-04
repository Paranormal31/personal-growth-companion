import type { MoodPhase } from '../types/mood';
import { MOOD_PHASES } from './moods';

export interface EyeGeometry {
  x: number;
  y: number;
  r: number;
}

export interface MouthGeometry {
  x1: number;
  y1: number;
  cx: number;
  cy: number;
  x2: number;
  y2: number;
  strokeWidth: number;
}

export interface FaceGeometry {
  leftEye: EyeGeometry;
  rightEye: EyeGeometry;
  mouth: MouthGeometry;
  headTilt: number;
  tearOpacity: number;
  blushOpacity: number;
  sparkleOpacity: number;
}

/**
 * High-fidelity facial geometry for each emotional state.
 * Tuned to match the reference screenshots:
 * - Bad: Compact, slightly drooped eyes (r=22) and deep sad frown (⌒).
 * - Not Good: Slightly lowered eyes (r=28) and gentle pout/flat droop.
 * - Not Bad: Calm balanced eyes (r=34) and subtle playful smirk.
 * - Good: Massive oversized circular eyes (r=44) with tight spacing and wide beaming smile (⌣).
 */
export const FACE_GEOMETRIES: Record<MoodPhase, FaceGeometry> = {
  bad: {
    leftEye: { x: 120, y: 116, r: 22 },
    rightEye: { x: 200, y: 116, r: 22 },
    mouth: {
      x1: 130,
      y1: 184,
      cx: 160,
      cy: 156,
      x2: 190,
      y2: 184,
      strokeWidth: 11,
    },
    headTilt: -3.5,
    tearOpacity: 0.65,
    blushOpacity: 0.0,
    sparkleOpacity: 0.0,
  },
  not_good: {
    leftEye: { x: 116, y: 112, r: 28 },
    rightEye: { x: 204, y: 112, r: 28 },
    mouth: {
      x1: 130,
      y1: 178,
      cx: 160,
      cy: 170,
      x2: 190,
      y2: 181,
      strokeWidth: 10.5,
    },
    headTilt: -1.5,
    tearOpacity: 0.0,
    blushOpacity: 0.15,
    sparkleOpacity: 0.0,
  },
  not_bad: {
    leftEye: { x: 112, y: 108, r: 34 },
    rightEye: { x: 208, y: 108, r: 34 },
    mouth: {
      x1: 130,
      y1: 176,
      cx: 160,
      cy: 182,
      x2: 190,
      y2: 174,
      strokeWidth: 10.5,
    },
    headTilt: 1.0,
    tearOpacity: 0.0,
    blushOpacity: 0.45,
    sparkleOpacity: 0.0,
  },
  good: {
    leftEye: { x: 106, y: 102, r: 44 },
    rightEye: { x: 214, y: 102, r: 44 },
    mouth: {
      x1: 132,
      y1: 168,
      cx: 160,
      cy: 198,
      x2: 188,
      y2: 168,
      strokeWidth: 11.5,
    },
    headTilt: 3.5,
    tearOpacity: 0.0,
    blushOpacity: 0.75,
    sparkleOpacity: 1.0,
  },
};

/**
 * Spring physics parameters requested for authentic bouncy character feel
 */
export const FACE_SPRING_TRANSITION = {
  type: 'spring' as const,
  stiffness: 350,
  damping: 22,
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Continuous interpolation helper across discrete phases for silky slider scrubbing
 */
export function interpolateFaceGeometry(continuousValue: number): FaceGeometry {
  const clamped = Math.max(0, Math.min(3, continuousValue));
  const baseIndex = Math.floor(clamped);
  const nextIndex = Math.min(3, Math.ceil(clamped));
  const t = clamped - baseIndex;

  const basePhase = MOOD_PHASES[baseIndex];
  const nextPhase = MOOD_PHASES[nextIndex];

  const baseGeo = FACE_GEOMETRIES[basePhase];
  const nextGeo = FACE_GEOMETRIES[nextPhase];

  if (t === 0 || basePhase === nextPhase) {
    return baseGeo;
  }

  return {
    leftEye: {
      x: lerp(baseGeo.leftEye.x, nextGeo.leftEye.x, t),
      y: lerp(baseGeo.leftEye.y, nextGeo.leftEye.y, t),
      r: lerp(baseGeo.leftEye.r, nextGeo.leftEye.r, t),
    },
    rightEye: {
      x: lerp(baseGeo.rightEye.x, nextGeo.rightEye.x, t),
      y: lerp(baseGeo.rightEye.y, nextGeo.rightEye.y, t),
      r: lerp(baseGeo.rightEye.r, nextGeo.rightEye.r, t),
    },
    mouth: {
      x1: lerp(baseGeo.mouth.x1, nextGeo.mouth.x1, t),
      y1: lerp(baseGeo.mouth.y1, nextGeo.mouth.y1, t),
      cx: lerp(baseGeo.mouth.cx, nextGeo.mouth.cx, t),
      cy: lerp(baseGeo.mouth.cy, nextGeo.mouth.cy, t),
      x2: lerp(baseGeo.mouth.x2, nextGeo.mouth.x2, t),
      y2: lerp(baseGeo.mouth.y2, nextGeo.mouth.y2, t),
      strokeWidth: lerp(baseGeo.mouth.strokeWidth, nextGeo.mouth.strokeWidth, t),
    },
    headTilt: lerp(baseGeo.headTilt, nextGeo.headTilt, t),
    tearOpacity: lerp(baseGeo.tearOpacity, nextGeo.tearOpacity, t),
    blushOpacity: lerp(baseGeo.blushOpacity, nextGeo.blushOpacity, t),
    sparkleOpacity: lerp(baseGeo.sparkleOpacity, nextGeo.sparkleOpacity, t),
  };
}
