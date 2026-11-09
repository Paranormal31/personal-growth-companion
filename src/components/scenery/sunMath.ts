/**
 * sunMath.ts
 *
 * Mathematical utilities and 360° orbital coordinate calculators for the
 * Personal Growth Companion 24-hour celestial system with physical mountain occlusion.
 */

/**
 * Interpolates two 6-digit hex colors (#RRGGBB) by factor t [0..1]
 */
export function interpolateHex(hexA: string, hexB: string, factor: number): string {
  const t = Math.max(0, Math.min(1, factor));
  const cA = parseInt(hexA.replace('#', ''), 16);
  const cB = parseInt(hexB.replace('#', ''), 16);

  const rA = (cA >> 16) & 255;
  const gA = (cA >> 8) & 255;
  const bA = cA & 255;

  const rB = (cB >> 16) & 255;
  const gB = (cB >> 8) & 255;
  const bB = cB & 255;

  const r = Math.round(rA + (rB - rA) * t);
  const g = Math.round(gA + (gB - gA) * t);
  const b = Math.round(bA + (bB - bA) * t);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Parabolic Sky Orbital Arc coordinates between Morning (t=0) and Afternoon (t=1):
 * - At t = 0 (Morning): x = ~76%, y = 56% (right horizon, emerging from y=68%)
 * - At t = 1 (Afternoon): x = 50%, y = 19% (high noon top-center)
 * - Vertex at (50%, 19%) with natural gravity/celestial deceleration near zenith.
 */
export function getParabolicSunCoords(progress: number): { x: number; y: number } {
  const t = Math.max(0, Math.min(1, progress));
  const x = 50 + 26 * (1 - t);
  const y = 19 + 37 * Math.pow(1 - t, 2);
  return { x, y };
}

export interface CelestialBodyCoords {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  visible: boolean;
}

export interface Celestial24hState {
  /** Sun body coordinates and continuous daytime progress [0..2] (0=morning, 1=afternoon, 2=evening) */
  sun: CelestialBodyCoords & { dayProgress: number };
  /** Moon body coordinates */
  moon: CelestialBodyCoords;
  /** Primary celestial body active */
  activeBody: 'sun' | 'moon' | 'both';
}

/**
 * Computes full 24-hour continuous 360° celestial orbital trajectory with
 * physical mountain occlusion (NO FADE OUT - opacity = 1.0):
 *
 * Day Cycle (T = 0 to 2.3):
 * - T = 0 (Morning): Sun rises from behind right mountain ridge (x: ~76%, y: 56%, emerging from y: 68%).
 * - T = 1 (Afternoon): Sun reaches zenith top-center (x: 50%, y: 19%).
 * - T = 2 (Evening): Sun descends towards left mountain ridge (x: 25%, y: 57%).
 * - T = 2 to 2.3: Sun sinks physically behind the left mountain ridge (y -> 72%, occluded by mountain).
 *
 * Night Cycle (T = 2.3 to 4.0):
 * - T = 2.3 to 2.8: Moon emerges from behind right mountain ridge (rises from y: 70% to y: 54%).
 * - T = 2.8 to 3.4: Moon travels across upper night sky (x: 70% -> 48%, y: 28%).
 * - T = 3.4 to 4.0: Moon descends and sinks physically behind left mountain ridge (x -> 24%, y -> 72%).
 * - T = 4.0 / 0.0: Moon is completely behind left mountain, and Morning Sun emerges from right mountain!
 */
export function getCelestial24hState(progress: number): Celestial24hState {
  const normT = ((progress % 4) + 4) % 4;

  let sun: CelestialBodyCoords & { dayProgress: number } = {
    x: 76,
    y: 72,
    opacity: 1,
    scale: 1,
    visible: false,
    dayProgress: 0,
  };

  let moon: CelestialBodyCoords = {
    x: 76,
    y: 72,
    opacity: 1,
    scale: 1,
    visible: false,
  };

  // -----------------------------------------------------------------
  // 1. SUN TRAJECTORY (Active during Daytime & Transitions)
  // -----------------------------------------------------------------
  if (normT >= 3.7 || normT < 2.3) {
    sun.visible = true;

    if (normT >= 3.7) {
      // Dawn emergence: rising from y: 68% to y: 56% behind right mountain
      const w = (normT - 3.7) / 0.3;
      sun.x = 78 - 2 * w;
      sun.y = 68 - 12 * w;
      sun.dayProgress = 0;
    } else if (normT <= 1.0) {
      // Morning to Afternoon: sweeps up along parabolic arc from right to zenith
      const t = normT;
      sun.x = 50 + 26 * (1 - t);
      sun.y = 19 + 37 * Math.pow(1 - t, 2);
      sun.dayProgress = t;
    } else if (normT <= 2.0) {
      // Afternoon to Evening: sweeps down along parabolic arc from zenith to left horizon
      const p = normT - 1.0;
      sun.x = 50 - 25 * p;
      sun.y = 19 + 38 * Math.pow(p, 2);
      sun.dayProgress = 1 + p;
    } else {
      // Evening sinking: descends physically behind left mountain ridge (y -> 72%)
      const s = (normT - 2.0) / 0.3;
      sun.x = 25 - 5 * s;
      sun.y = 57 + 15 * s;
      sun.dayProgress = 2;
    }
  }

  // -----------------------------------------------------------------
  // 2. MOON TRAJECTORY (Active during Night Cycle & Transitions)
  // -----------------------------------------------------------------
  if (normT >= 2.3 && normT <= 4.0) {
    moon.visible = true;

    if (normT <= 2.8) {
      // Moon emergence: rises from y: 70% to y: 54% from behind right mountain
      const m1 = (normT - 2.3) / 0.5;
      moon.x = 76 - 6 * m1;
      moon.y = 70 - 16 * m1;
    } else if (normT <= 3.4) {
      // Upper night sky travel: x: 70% -> 48%, y: 54% -> 28%
      const m2 = (normT - 2.8) / 0.6;
      moon.x = 70 - 22 * m2;
      moon.y = 54 - 26 * Math.sin((m2 * Math.PI) / 2);
    } else {
      // Moon descent: descends and sinks physically behind left mountain ridge (y -> 72%)
      const m3 = (normT - 3.4) / 0.6;
      moon.x = 48 - 24 * m3;
      moon.y = 28 + 44 * Math.pow(m3, 2);
    }
  }

  let activeBody: 'sun' | 'moon' | 'both' = 'sun';
  if (sun.visible && moon.visible) {
    activeBody = 'both';
  } else if (moon.visible) {
    activeBody = 'moon';
  }

  return { sun, moon, activeBody };
}
