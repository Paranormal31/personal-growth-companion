import { useId, useMemo } from 'react';
import { motion } from 'framer-motion';

export type LandscapePhase = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ScenicPalette {
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  sunriseGlowOpacity: number;
  afternoonGlowOpacity: number;
  sunsetGlowOpacity: number;
  starsOpacity: number;
  firefliesOpacity: number;
  cloudBody: string;
  cloudShadow: string;
  mtnPeakLit: string;
  mtnPeakShade: string;
  mtnMidRidge: string;
  hillDistantRidge: string;
  hillMidLeft: string;
  hillMidRight: string;
  hillMidRightHighlight: string;
  hillCottageMeadow: string;
  hillRightForeground: string;
  hillBottomCorner: string;
  riverTop: string;
  riverMid: string;
  riverBottom: string;
  waterFlowOpacity: number;
  treeCanopy: string;
  treeCanopyHighlight: string;
  treeTrunk: string;
  cottageWallSide: string;
  cottageWallFront: string;
  cottageRoofLeft: string;
  cottageRoofRight: string;
  cottageChimney: string;
  cottageDoor: string;
}

export interface CelestialRenderProps {
  /** Current progress 0..4 (0=Morning, 1=Afternoon, 2=Evening, 3=Night, looping to 4/0) */
  progress: number;
  /** Active discrete phase */
  phase: LandscapePhase;
  /** Complete scenic palette */
  palette: ScenicPalette;
  /** Sun X coordinate in 430x844 viewBox */
  sunX: number;
  /** Sun Y coordinate in 430x844 viewBox */
  sunY: number;
  /** Moon X coordinate in 430x844 viewBox */
  moonX: number;
  /** Moon Y coordinate in 430x844 viewBox */
  moonY: number;
  /** Whether sun is currently above horizon */
  isSunVisible: boolean;
  /** Whether moon is currently above horizon */
  isMoonVisible: boolean;
}

export interface ProceduralLandscapeProps {
  /**
   * Continuous interpolation progress:
   * 0 = Morning, 1 = Afternoon, 2 = Evening, 3 = Night (smoothly looping back to 0/4).
   * Also supports 0..1 for Morning -> Afternoon transition.
   */
  progress?: number;
  /** Discrete phase: 'morning' | 'afternoon' | 'evening' | 'night' (default: 'morning') */
  phase?: LandscapePhase;
  /** Whether floating sky clouds gently drift across the sky (default: true) */
  animateClouds?: boolean;
  /** Force cottage window lights state (defaults: false for morning/afternoon, true for evening/night) */
  houseLightOn?: boolean;
  /**
   * Slot for celestial content (Sun / Moon character, rays, orbital trails).
   * Rendered physically BEHIND the distant mountains and rolling hills (viewBox 0 0 430 844)
   * so that celestial bodies emerge from and submerge into the mountains naturally without fading out.
   */
  celestialContent?: React.ReactNode;
  /**
   * Render function alternative for celestial content, passing useful landscape coordinates and progress.
   */
  renderCelestial?: (props: CelestialRenderProps) => React.ReactNode;
  /**
   * HTML/DOM celestial content automatically wrapped in a 430x844 <foreignObject> layer.
   */
  celestialHtml?: React.ReactNode;
  /**
   * Direct children rendered in the celestial slot behind mountains.
   */
  children?: React.ReactNode;
  /** Additional CSS classes for outer container */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

/**
 * 32 Deterministic star positions for Night sky
 */
const NIGHT_STARS = [
  // Upper sky
  { id: 1, cx: 38, cy: 52, r: 1.4, delay: 0.1, dur: 2.2, diamond: false },
  { id: 2, cx: 85, cy: 78, r: 1.8, delay: 0.5, dur: 3.1, diamond: false },
  { id: 3, cx: 132, cy: 45, r: 1.2, delay: 1.1, dur: 1.9, diamond: false },
  { id: 4, cx: 184, cy: 82, r: 2.4, delay: 0.3, dur: 2.7, diamond: true },
  { id: 5, cx: 236, cy: 40, r: 1.3, delay: 0.8, dur: 2.4, diamond: false },
  { id: 6, cx: 288, cy: 72, r: 1.9, delay: 1.4, dur: 3.3, diamond: false },
  { id: 7, cx: 342, cy: 48, r: 2.2, delay: 0.2, dur: 2.1, diamond: true },
  { id: 8, cx: 395, cy: 68, r: 1.5, delay: 0.9, dur: 2.8, diamond: false },
  // Upper-mid sky
  { id: 9, cx: 58, cy: 130, r: 1.3, delay: 1.3, dur: 2.5, diamond: false },
  { id: 10, cx: 112, cy: 165, r: 2.0, delay: 0.4, dur: 3.0, diamond: true },
  { id: 11, cx: 162, cy: 125, r: 1.4, delay: 1.0, dur: 2.1, diamond: false },
  { id: 12, cx: 212, cy: 155, r: 2.1, delay: 0.6, dur: 2.8, diamond: false },
  { id: 13, cx: 265, cy: 120, r: 1.5, delay: 1.5, dur: 3.2, diamond: false },
  { id: 14, cx: 318, cy: 160, r: 2.3, delay: 0.7, dur: 2.0, diamond: true },
  { id: 15, cx: 370, cy: 135, r: 1.4, delay: 1.2, dur: 2.6, diamond: false },
  { id: 16, cx: 412, cy: 110, r: 1.7, delay: 0.3, dur: 2.9, diamond: false },
  // Mid sky
  { id: 17, cx: 45, cy: 220, r: 1.5, delay: 0.9, dur: 2.3, diamond: false },
  { id: 18, cx: 98, cy: 250, r: 2.1, delay: 0.2, dur: 3.0, diamond: true },
  { id: 19, cx: 150, cy: 210, r: 1.3, delay: 1.4, dur: 1.8, diamond: false },
  { id: 20, cx: 205, cy: 245, r: 1.8, delay: 0.7, dur: 2.7, diamond: false },
  { id: 21, cx: 258, cy: 218, r: 1.4, delay: 1.1, dur: 2.2, diamond: false },
  { id: 22, cx: 310, cy: 260, r: 2.2, delay: 0.5, dur: 3.2, diamond: true },
  { id: 23, cx: 365, cy: 225, r: 1.6, delay: 1.6, dur: 2.4, diamond: false },
  { id: 24, cx: 408, cy: 250, r: 1.3, delay: 0.8, dur: 2.8, diamond: false },
  // Lower sky above hills
  { id: 25, cx: 72, cy: 330, r: 1.4, delay: 0.4, dur: 2.6, diamond: false },
  { id: 26, cx: 128, cy: 360, r: 1.9, delay: 1.2, dur: 2.9, diamond: true },
  { id: 27, cx: 182, cy: 320, r: 1.2, delay: 0.6, dur: 2.0, diamond: false },
  { id: 28, cx: 238, cy: 365, r: 1.7, delay: 1.5, dur: 3.1, diamond: false },
  { id: 29, cx: 292, cy: 335, r: 1.3, delay: 0.3, dur: 2.2, diamond: false },
  { id: 30, cx: 345, cy: 375, r: 2.0, delay: 1.0, dur: 2.8, diamond: true },
  { id: 31, cx: 195, cy: 440, r: 1.4, delay: 0.8, dur: 2.5, diamond: false },
  { id: 32, cx: 275, cy: 460, r: 1.6, delay: 1.3, dur: 2.7, diamond: false },
];

/**
 * Deterministic firefly positions hovering over the meadows
 */
const FIREFLIES = [
  { id: 1, cx: 62, cy: 720, r: 1.8, delay: 0.2, dur: 3.1 },
  { id: 2, cx: 110, cy: 745, r: 2.2, delay: 0.8, dur: 2.8 },
  { id: 3, cx: 155, cy: 685, r: 1.7, delay: 1.4, dur: 3.5 },
  { id: 4, cx: 205, cy: 725, r: 2.1, delay: 0.4, dur: 2.6 },
  { id: 5, cx: 250, cy: 690, r: 1.9, delay: 1.1, dur: 3.3 },
  { id: 6, cx: 295, cy: 755, r: 2.3, delay: 0.6, dur: 2.9 },
  { id: 7, cx: 340, cy: 705, r: 2.0, delay: 1.5, dur: 3.2 },
  { id: 8, cx: 385, cy: 680, r: 2.2, delay: 0.3, dur: 3.6 },
  { id: 9, cx: 175, cy: 785, r: 1.8, delay: 0.9, dur: 2.7 },
  { id: 10, cx: 230, cy: 805, r: 2.1, delay: 1.3, dur: 3.0 },
  { id: 11, cx: 280, cy: 795, r: 1.9, delay: 0.5, dur: 3.4 },
  { id: 12, cx: 360, cy: 770, r: 2.1, delay: 1.0, dur: 2.5 },
];

/**
 * Interpolates two 6-character hex colors (#RRGGBB) by factor t [0..1]
 */
function interpolateHex(hexA: string, hexB: string, factor: number): string {
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

/** 1. Morning Palette (Sunrise) */
const PALETTE_MORNING: ScenicPalette = {
  skyTop: '#FBA486',
  skyMid: '#FFC399',
  skyBottom: '#FFE6BE',
  sunriseGlowOpacity: 0.85,
  afternoonGlowOpacity: 0,
  sunsetGlowOpacity: 0,
  starsOpacity: 0,
  firefliesOpacity: 0,
  cloudBody: '#FFF4EB',
  cloudShadow: '#FADDC9',
  mtnPeakLit: '#76A19E',
  mtnPeakShade: '#648E8B',
  mtnMidRidge: '#6C9693',
  hillDistantRidge: '#78ABA3',
  hillMidLeft: '#5F9F8B',
  hillMidRight: '#8EC8A6',
  hillMidRightHighlight: '#A8D8BC',
  hillCottageMeadow: '#7EBF9E',
  hillRightForeground: '#94D0B1',
  hillBottomCorner: '#71B493',
  riverTop: '#FFE3D4',
  riverMid: '#D4EFE4',
  riverBottom: '#C5ECE0',
  waterFlowOpacity: 0.55,
  treeCanopy: '#548A76',
  treeCanopyHighlight: '#6EA390',
  treeTrunk: '#6E5343',
  cottageWallSide: '#C7A58E',
  cottageWallFront: '#A98570',
  cottageRoofLeft: '#8D624E',
  cottageRoofRight: '#734B39',
  cottageChimney: '#7D5543',
  cottageDoor: '#5C3E2D',
};

/** 2. Afternoon Palette (High Noon) */
const PALETTE_AFTERNOON: ScenicPalette = {
  skyTop: '#4DA8F5',
  skyMid: '#76C5FF',
  skyBottom: '#BFE7FF',
  sunriseGlowOpacity: 0,
  afternoonGlowOpacity: 0.4,
  sunsetGlowOpacity: 0,
  starsOpacity: 0,
  firefliesOpacity: 0,
  cloudBody: '#FFFFFF',
  cloudShadow: '#D6EDFF',
  mtnPeakLit: '#559C97',
  mtnPeakShade: '#42817C',
  mtnMidRidge: '#498B86',
  hillDistantRidge: '#5EA880',
  hillMidLeft: '#66AB4E',
  hillMidRight: '#94C848',
  hillMidRightHighlight: '#A9DE5B',
  hillCottageMeadow: '#86BF42',
  hillRightForeground: '#A2D354',
  hillBottomCorner: '#76B236',
  riverTop: '#78C4F9',
  riverMid: '#56AFF6',
  riverBottom: '#42A3F4',
  waterFlowOpacity: 0.85,
  treeCanopy: '#518B33',
  treeCanopyHighlight: '#6FA945',
  treeTrunk: '#65442F',
  cottageWallSide: '#C7A58E',
  cottageWallFront: '#A98570',
  cottageRoofLeft: '#8D624E',
  cottageRoofRight: '#734B39',
  cottageChimney: '#7D5543',
  cottageDoor: '#5C3E2D',
};

/** 3. Evening Palette (Sunset & Dusk) */
const PALETTE_EVENING: ScenicPalette = {
  skyTop: '#422464',
  skyMid: '#8E3E63',
  skyBottom: '#F27B35',
  sunriseGlowOpacity: 0,
  afternoonGlowOpacity: 0,
  sunsetGlowOpacity: 0.9,
  starsOpacity: 0.2,
  firefliesOpacity: 0.9,
  cloudBody: '#8A567D',
  cloudShadow: '#5D3357',
  mtnPeakLit: '#33465C',
  mtnPeakShade: '#233242',
  mtnMidRidge: '#283A4E',
  hillDistantRidge: '#2A484D',
  hillMidLeft: '#26493F',
  hillMidRight: '#35624B',
  hillMidRightHighlight: '#477C60',
  hillCottageMeadow: '#2C5545',
  hillRightForeground: '#356550',
  hillBottomCorner: '#24473B',
  riverTop: '#F79744',
  riverMid: '#DE6C32',
  riverBottom: '#C9572A',
  waterFlowOpacity: 0.65,
  treeCanopy: '#1F4532',
  treeCanopyHighlight: '#2E5F46',
  treeTrunk: '#452E22',
  cottageWallSide: '#614539',
  cottageWallFront: '#4B342A',
  cottageRoofLeft: '#43291E',
  cottageRoofRight: '#301D15',
  cottageChimney: '#3A231A',
  cottageDoor: '#271711',
};

/** 4. Night Palette (Midnight Starlight) */
const PALETTE_NIGHT: ScenicPalette = {
  skyTop: '#0E1438',
  skyMid: '#171E4A',
  skyBottom: '#252F6B',
  sunriseGlowOpacity: 0,
  afternoonGlowOpacity: 0,
  sunsetGlowOpacity: 0,
  starsOpacity: 1.0,
  firefliesOpacity: 1.0,
  cloudBody: '#222B58',
  cloudShadow: '#151A3B',
  mtnPeakLit: '#14283E',
  mtnPeakShade: '#0D1C2C',
  mtnMidRidge: '#112336',
  hillDistantRidge: '#152E38',
  hillMidLeft: '#122D29',
  hillMidRight: '#183D36',
  hillMidRightHighlight: '#225349',
  hillCottageMeadow: '#15362F',
  hillRightForeground: '#1A4037',
  hillBottomCorner: '#102924',
  riverTop: '#EFE3C6',
  riverMid: '#8FA8C2',
  riverBottom: '#355375',
  waterFlowOpacity: 0.6,
  treeCanopy: '#122E22',
  treeCanopyHighlight: '#1A3F2F',
  treeTrunk: '#2C1E17',
  cottageWallSide: '#3F302B',
  cottageWallFront: '#2F2421',
  cottageRoofLeft: '#2A1B16',
  cottageRoofRight: '#1D130F',
  cottageChimney: '#231713',
  cottageDoor: '#170E0B',
};

/**
 * Interpolates all scenic palette variables between two keyframes
 */
function interpolatePalettes(pA: ScenicPalette, pB: ScenicPalette, t: number): ScenicPalette {
  return {
    skyTop: interpolateHex(pA.skyTop, pB.skyTop, t),
    skyMid: interpolateHex(pA.skyMid, pB.skyMid, t),
    skyBottom: interpolateHex(pA.skyBottom, pB.skyBottom, t),
    sunriseGlowOpacity: pA.sunriseGlowOpacity + (pB.sunriseGlowOpacity - pA.sunriseGlowOpacity) * t,
    afternoonGlowOpacity: pA.afternoonGlowOpacity + (pB.afternoonGlowOpacity - pA.afternoonGlowOpacity) * t,
    sunsetGlowOpacity: pA.sunsetGlowOpacity + (pB.sunsetGlowOpacity - pA.sunsetGlowOpacity) * t,
    starsOpacity: pA.starsOpacity + (pB.starsOpacity - pA.starsOpacity) * t,
    firefliesOpacity: pA.firefliesOpacity + (pB.firefliesOpacity - pA.firefliesOpacity) * t,
    cloudBody: interpolateHex(pA.cloudBody, pB.cloudBody, t),
    cloudShadow: interpolateHex(pA.cloudShadow, pB.cloudShadow, t),
    mtnPeakLit: interpolateHex(pA.mtnPeakLit, pB.mtnPeakLit, t),
    mtnPeakShade: interpolateHex(pA.mtnPeakShade, pB.mtnPeakShade, t),
    mtnMidRidge: interpolateHex(pA.mtnMidRidge, pB.mtnMidRidge, t),
    hillDistantRidge: interpolateHex(pA.hillDistantRidge, pB.hillDistantRidge, t),
    hillMidLeft: interpolateHex(pA.hillMidLeft, pB.hillMidLeft, t),
    hillMidRight: interpolateHex(pA.hillMidRight, pB.hillMidRight, t),
    hillMidRightHighlight: interpolateHex(pA.hillMidRightHighlight, pB.hillMidRightHighlight, t),
    hillCottageMeadow: interpolateHex(pA.hillCottageMeadow, pB.hillCottageMeadow, t),
    hillRightForeground: interpolateHex(pA.hillRightForeground, pB.hillRightForeground, t),
    hillBottomCorner: interpolateHex(pA.hillBottomCorner, pB.hillBottomCorner, t),
    riverTop: interpolateHex(pA.riverTop, pB.riverTop, t),
    riverMid: interpolateHex(pA.riverMid, pB.riverMid, t),
    riverBottom: interpolateHex(pA.riverBottom, pB.riverBottom, t),
    waterFlowOpacity: pA.waterFlowOpacity + (pB.waterFlowOpacity - pA.waterFlowOpacity) * t,
    treeCanopy: interpolateHex(pA.treeCanopy, pB.treeCanopy, t),
    treeCanopyHighlight: interpolateHex(pA.treeCanopyHighlight, pB.treeCanopyHighlight, t),
    treeTrunk: interpolateHex(pA.treeTrunk, pB.treeTrunk, t),
    cottageWallSide: interpolateHex(pA.cottageWallSide, pB.cottageWallSide, t),
    cottageWallFront: interpolateHex(pA.cottageWallFront, pB.cottageWallFront, t),
    cottageRoofLeft: interpolateHex(pA.cottageRoofLeft, pB.cottageRoofLeft, t),
    cottageRoofRight: interpolateHex(pA.cottageRoofRight, pB.cottageRoofRight, t),
    cottageChimney: interpolateHex(pA.cottageChimney, pB.cottageChimney, t),
    cottageDoor: interpolateHex(pA.cottageDoor, pB.cottageDoor, t),
  };
}

/**
 * Calculates continuous window light illumination intensity [0..1]
 */
function calculateWindowLightIntensity(p: number): number {
  const wrapped = ((p % 4) + 4) % 4;

  if (wrapped >= 1.5 && wrapped < 2.0) {
    return (wrapped - 1.5) / 0.5;
  }
  if (wrapped >= 2.0 && wrapped < 3.4) {
    return 1.0;
  }
  if (wrapped >= 3.4 && wrapped < 3.9) {
    return 1.0 - (wrapped - 3.4) / 0.5;
  }
  return 0.0;
}

/**
 * Calculates standard Sun & Moon coordinates in 430x844 viewBox
 * - Sun emerges at morning (progress 0: x=345, y=500), reaches zenith at afternoon (progress 1: x=215, y=170),
 *   sets into mountains at evening (progress 2: x=75, y=520), and stays submerged until dawn.
 * - Moon emerges at dusk/night on right (progress 2.2..3: x=355->240, y=520->210),
 *   and sets into left mountains at dawn (progress 3.8: x=75, y=530).
 */
function calculateOrbitalCoords(p: number) {
  const wrapped = ((p % 4) + 4) % 4;

  // 1. Sun Coordinates
  let sunX = 345;
  let sunY = 500;
  let isSunVisible = false;

  if (wrapped < 2.2) {
    // Daytime arc: 0 (Morning right) -> 1 (Afternoon center high) -> 2 (Evening left)
    const t = wrapped / 2.0; // 0 to 1
    // Smooth parametric curve
    sunX = 345 - 270 * t; // 345 -> 75
    // Parabolic arc with zenith at y=170
    sunY = 170 + 4 * (510 - 170) * Math.pow(t - 0.5, 2);
    isSunVisible = sunY < 540;
  } else {
    // Night: submerged under the mountains
    const tNight = (wrapped - 2.2) / 1.8;
    sunX = 75 + 270 * tNight;
    sunY = 660 + 40 * Math.sin(tNight * Math.PI);
    isSunVisible = false;
  }

  // 2. Moon Coordinates
  let moonX = 355;
  let moonY = 680;
  let isMoonVisible = false;

  if (wrapped >= 1.8 && wrapped < 4.0) {
    const t = (wrapped - 1.8) / 2.1; // 0 to 1 across night
    moonX = 355 - 280 * t; // 355 -> 75
    moonY = 195 + 4 * (535 - 195) * Math.pow(t - 0.5, 2);
    isMoonVisible = moonY < 540;
  } else {
    // Daytime: submerged under the mountains
    const tDay = wrapped < 1.8 ? wrapped / 1.8 : 0;
    moonX = 75 + 280 * tDay;
    moonY = 680 + 30 * Math.sin(tDay * Math.PI);
    isMoonVisible = false;
  }

  return { sunX, sunY, moonX, moonY, isSunVisible, isMoonVisible };
}

/**
 * ProceduralLandscape
 *
 * Full 4-Phase Pure SVG vector landscape built from scratch with ZERO raster image overlays:
 * - Layer 1: Sky background, atmospheric gradients, stars, shooting star, and clouds.
 * - Layer 2: CELESTIAL LAYER SLOT (Behind mountains & hills) for Sun and Moon emergence and immersion.
 * - Layer 3: Distant Alpine Mountains & Horizon Ridge (physically occluding celestial bodies below the skyline).
 * - Layer 4: Midground Rolling Hills & Trees.
 * - Layer 5: Winding River & Water Reflections (with pale golden moonlight ribbon in Night).
 * - Layer 6: Foreground Meadows, Trees, Cottage (with window light logic), and Fireflies.
 */
export function ProceduralLandscape({
  progress,
  phase = 'morning',
  animateClouds = true,
  houseLightOn,
  celestialContent,
  renderCelestial,
  celestialHtml,
  children,
  className = '',
  style,
}: ProceduralLandscapeProps) {
  const id = useId();

  // Normalize progress parameter across 0..4
  const progressVal = useMemo(() => {
    if (typeof progress === 'number') {
      return progress;
    }
    switch (phase) {
      case 'afternoon':
        return 1.0;
      case 'evening':
        return 2.0;
      case 'night':
        return 3.0;
      case 'morning':
      default:
        return 0.0;
    }
  }, [progress, phase]);

  // Window light illumination state (0.0 to 1.0)
  const windowLightIntensity = useMemo(() => {
    if (typeof houseLightOn === 'boolean') {
      return houseLightOn ? 1.0 : 0.0;
    }
    return calculateWindowLightIntensity(progressVal);
  }, [houseLightOn, progressVal]);

  // Interpolated continuous palette across 4-phase cycle
  const palette = useMemo(() => {
    const wrapped = ((progressVal % 4) + 4) % 4;

    if (wrapped < 1.0) {
      return interpolatePalettes(PALETTE_MORNING, PALETTE_AFTERNOON, wrapped);
    } else if (wrapped < 2.0) {
      return interpolatePalettes(PALETTE_AFTERNOON, PALETTE_EVENING, wrapped - 1.0);
    } else if (wrapped < 3.0) {
      return interpolatePalettes(PALETTE_EVENING, PALETTE_NIGHT, wrapped - 2.0);
    } else {
      return interpolatePalettes(PALETTE_NIGHT, PALETTE_MORNING, wrapped - 3.0);
    }
  }, [progressVal]);

  // Computed standard orbital celestial coordinates
  const orbital = useMemo(() => calculateOrbitalCoords(progressVal), [progressVal]);

  // Dynamic window pane fill: slate daylight (#8E8A87) -> glowing amber (#FFC83D)
  const windowPaneColor = interpolateHex('#8E8A87', '#FFC83D', windowLightIntensity);
  const windowMullionColor = interpolateHex('#686462', '#8F5C00', windowLightIntensity);
  const windowBloomOpacity = windowLightIntensity * 0.85;

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      style={style}
    >
      <svg
        viewBox="0 0 430 844"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Vertical Sky Gradient */}
          <linearGradient id={`${id}-sky`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.skyTop} />
            <stop offset="42%" stopColor={palette.skyMid} />
            <stop offset="100%" stopColor={palette.skyBottom} />
          </linearGradient>

          {/* Morning Sunrise Radial Horizon Glow */}
          <radialGradient
            id={`${id}-sunrise-glow`}
            cx="355"
            cy="525"
            r="230"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFF2D6" stopOpacity={0.9} />
            <stop offset="35%" stopColor="#FFE0AA" stopOpacity={0.55} />
            <stop offset="70%" stopColor="#FFC888" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#FFC888" stopOpacity={0} />
          </radialGradient>

          {/* Afternoon High Sun Radial Sky Glow */}
          <radialGradient
            id={`${id}-highsun-glow`}
            cx="215"
            cy="180"
            r="260"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.8} />
            <stop offset="30%" stopColor="#E0F2FE" stopOpacity={0.4} />
            <stop offset="70%" stopColor="#BAE6FD" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity={0} />
          </radialGradient>

          {/* Evening Sunset Radial Glow (lower left horizon) */}
          <radialGradient
            id={`${id}-sunset-glow`}
            cx="80"
            cy="525"
            r="230"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FF9B42" stopOpacity={0.9} />
            <stop offset="40%" stopColor="#F26E35" stopOpacity={0.5} />
            <stop offset="80%" stopColor="#8E3E63" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#8E3E63" stopOpacity={0} />
          </radialGradient>

          {/* Shooting Star Gradient */}
          <linearGradient id={`${id}-shooting-star`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0} />
            <stop offset="60%" stopColor="#C9DCFF" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={1} />
          </linearGradient>

          {/* River Water Surface Linear Gradient */}
          <linearGradient
            id={`${id}-river`}
            x1="330"
            y1="550"
            x2="430"
            y2="844"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={palette.riverTop} />
            <stop offset="35%" stopColor={palette.riverMid} />
            <stop offset="100%" stopColor={palette.riverBottom} />
          </linearGradient>

          {/* Soft Ground Shadow Gradient for Cottage */}
          <radialGradient id={`${id}-cottage-shadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity={0.24} />
            <stop offset="70%" stopColor="#000000" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </radialGradient>

          {/* Exterior Window Light Bloom (casts warm amber onto grass and wall) */}
          <radialGradient
            id={`${id}-window-bloom`}
            cx="46"
            cy="678"
            r="48"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFC83D" stopOpacity={0.9} />
            <stop offset="35%" stopColor="#FFB300" stopOpacity={0.45} />
            <stop offset="70%" stopColor="#FF8F00" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#FF8F00" stopOpacity={0} />
          </radialGradient>

          {/* Firefly Ambient Halo */}
          <radialGradient id={`${id}-firefly-halo`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8F84A" stopOpacity={0.8} />
            <stop offset="40%" stopColor="#D4F844" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#D4F844" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* ============================================================== */}
        {/* LAYER 1: SKY BACKGROUND, ATMOSPHERE, STARS & DRIFTING CLOUDS   */}
        {/* ============================================================== */}
        <rect width="430" height="844" fill={`url(#${id}-sky)`} />

        {/* Morning Sunrise Warm Glow */}
        {palette.sunriseGlowOpacity > 0.01 && (
          <circle
            cx="355"
            cy="525"
            r="230"
            fill={`url(#${id}-sunrise-glow)`}
            opacity={palette.sunriseGlowOpacity}
          />
        )}

        {/* Afternoon High Zenith Sun Glow */}
        {palette.afternoonGlowOpacity > 0.01 && (
          <circle
            cx="215"
            cy="180"
            r="260"
            fill={`url(#${id}-highsun-glow)`}
            opacity={palette.afternoonGlowOpacity}
          />
        )}

        {/* Evening Sunset Horizon Glow */}
        {palette.sunsetGlowOpacity > 0.01 && (
          <circle
            cx="80"
            cy="525"
            r="230"
            fill={`url(#${id}-sunset-glow)`}
            opacity={palette.sunsetGlowOpacity}
          />
        )}

        {/* 32 Twinkling SVG Stars for Night */}
        {palette.starsOpacity > 0.02 && (
          <g className="night-stars" opacity={palette.starsOpacity}>
            {NIGHT_STARS.map((star) =>
              star.diamond ? (
                <motion.path
                  key={star.id}
                  d={`M ${star.cx} ${star.cy - star.r * 1.5} Q ${star.cx} ${star.cy} ${
                    star.cx + star.r * 1.5
                  } ${star.cy} Q ${star.cx} ${star.cy} ${star.cx} ${
                    star.cy + star.r * 1.5
                  } Q ${star.cx} ${star.cy} ${star.cx - star.r * 1.5} ${star.cy} Q ${
                    star.cx
                  } ${star.cy} ${star.cx} ${star.cy - star.r * 1.5} Z`}
                  fill="#FFFFFF"
                  animate={{
                    opacity: [0.35, 1, 0.35],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    duration: star.dur,
                    delay: star.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: `${star.cx}px ${star.cy}px` }}
                />
              ) : (
                <motion.circle
                  key={star.id}
                  cx={star.cx}
                  cy={star.cy}
                  r={star.r}
                  fill="#FFFFFF"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.85, 1.25, 0.85],
                  }}
                  transition={{
                    duration: star.dur,
                    delay: star.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: `${star.cx}px ${star.cy}px` }}
                />
              )
            )}

            {/* Shooting Star Streak in Night Sky */}
            {palette.starsOpacity > 0.4 && (
              <motion.g
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [0, -110],
                  y: [0, 65],
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  repeatDelay: 5.4,
                  ease: 'easeOut',
                }}
              >
                <line
                  x1="350"
                  y1="70"
                  x2="310"
                  y2="94"
                  stroke={`url(#${id}-shooting-star)`}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="310" cy="94" r="2.2" fill="#FFFFFF" />
              </motion.g>
            )}
          </g>
        )}

        {/* Floating Sky Clouds */}
        <g className="sky-clouds">
          {/* Cloud 1: Upper Left */}
          <motion.g
            animate={
              animateClouds
                ? {
                    x: [0, 14, 0],
                    y: [0, -3, 0],
                  }
                : undefined
            }
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <path
              d="M 45 132 C 45 120, 58 112, 72 112 C 82 105, 102 105, 112 114 C 122 110, 136 117, 138 128 C 145 128, 150 133, 150 138 C 150 144, 144 148, 137 148 L 52 148 C 44 148, 41 140, 45 132 Z"
              fill={palette.cloudShadow}
              transform="translate(0, 3)"
            />
            <path
              d="M 45 132 C 45 120, 58 112, 72 112 C 82 105, 102 105, 112 114 C 122 110, 136 117, 138 128 C 145 128, 150 133, 150 138 C 150 144, 144 148, 137 148 L 52 148 C 44 148, 41 140, 45 132 Z"
              fill={palette.cloudBody}
            />
          </motion.g>

          {/* Cloud 2: Upper Right */}
          <motion.g
            animate={
              animateClouds
                ? {
                    x: [0, -18, 0],
                    y: [0, 4, 0],
                  }
                : undefined
            }
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
          >
            <circle cx="282" cy="278" r="9" fill={palette.cloudBody} />
            <path
              d="M 315 272 C 315 258, 330 250, 344 250 C 354 240, 376 240, 388 251 C 399 247, 414 254, 416 267 C 426 267, 432 274, 430 282 C 426 288, 418 290, 408 290 L 322 290 C 312 290, 308 281, 315 272 Z"
              fill={palette.cloudShadow}
              transform="translate(0, 3)"
            />
            <path
              d="M 315 272 C 315 258, 330 250, 344 250 C 354 240, 376 240, 388 251 C 399 247, 414 254, 416 267 C 426 267, 432 274, 430 282 C 426 288, 418 290, 408 290 L 322 290 C 312 290, 308 281, 315 272 Z"
              fill={palette.cloudBody}
            />
          </motion.g>

          {/* Cloud 3: Mid-Left Bank extending from left edge */}
          <motion.g
            animate={
              animateClouds
                ? {
                    x: [0, 10, 0],
                    y: [0, -2, 0],
                  }
                : undefined
            }
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3,
            }}
          >
            <path
              d="M -15 390 L -15 348 C 0 332, 22 332, 36 345 C 50 328, 86 325, 105 345 C 122 335, 150 342, 155 360 C 166 360, 175 368, 172 379 C 168 388, 158 392, 146 392 L -15 392 Z"
              fill={palette.cloudShadow}
              transform="translate(0, 4)"
            />
            <path
              d="M -15 390 L -15 348 C 0 332, 22 332, 36 345 C 50 328, 86 325, 105 345 C 122 335, 150 342, 155 360 C 166 360, 175 368, 172 379 C 168 388, 158 392, 146 392 L -15 392 Z"
              fill={palette.cloudBody}
            />
          </motion.g>

          {/* Cloud 4: Center Floating Cloud */}
          <motion.g
            animate={
              animateClouds
                ? {
                    x: [0, -12, 0],
                    y: [0, 3, 0],
                  }
                : undefined
            }
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8,
            }}
          >
            <path
              d="M 188 510 C 188 497, 202 489, 216 489 C 226 480, 246 480, 256 490 C 267 487, 281 494, 283 506 C 291 506, 297 512, 295 519 C 292 524, 285 528, 276 528 L 195 528 C 185 528, 180 520, 188 510 Z"
              fill={palette.cloudShadow}
              transform="translate(0, 3)"
            />
            <path
              d="M 188 510 C 188 497, 202 489, 216 489 C 226 480, 246 480, 256 490 C 267 487, 281 494, 283 506 C 291 506, 297 512, 295 519 C 292 524, 285 528, 276 528 L 195 528 C 185 528, 180 520, 188 510 Z"
              fill={palette.cloudBody}
            />
          </motion.g>

          {/* Distant Horizon Cloud Bank behind hills (Left & Center) */}
          <path
            d="M -15 570 L -15 500 C 10 472, 45 468, 70 492 C 90 460, 140 455, 170 488 C 198 468, 242 474, 268 508 C 288 498, 330 512, 345 540 L 345 570 Z"
            fill={palette.cloudBody}
            opacity={0.94}
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 2: CELESTIAL LAYER SLOT (Behind Mountains & Hills)       */}
        {/* Celestial bodies emerge from and submerge into mountains here  */}
        {/* ============================================================== */}
        <g className="celestial-layer-slot" data-slot="celestial">
          {celestialContent}
          {renderCelestial?.({
            progress: progressVal,
            phase,
            palette,
            sunX: orbital.sunX,
            sunY: orbital.sunY,
            moonX: orbital.moonX,
            moonY: orbital.moonY,
            isSunVisible: orbital.isSunVisible,
            isMoonVisible: orbital.isMoonVisible,
          })}
          {children}
          {celestialHtml && (
            <foreignObject x="0" y="0" width="430" height="844" className="pointer-events-none">
              <div className="relative w-full h-full overflow-hidden">
                {celestialHtml}
              </div>
            </foreignObject>
          )}
        </g>

        {/* ============================================================== */}
        {/* LAYER 3: DISTANT ALPINE MOUNTAINS & HORIZON RIDGE              */}
        {/* Physically occludes the lower half of rising and setting sun   */}
        {/* ============================================================== */}
        <g className="distant-mountains">
          {/* Back Tall Mountain Mass (extends to y=860 for solid occlusion) */}
          <path
            d="M 210 860 L 210 565 C 260 540, 320 495, 365 470 C 390 455, 412 435, 425 430 L 445 440 L 445 860 Z"
            fill={palette.mtnPeakLit}
          />
          {/* Shaded Facet on Back Mountain */}
          <path
            d="M 365 470 C 390 455, 412 435, 425 430 L 445 440 L 445 510 C 418 498, 390 485, 365 470 Z"
            fill={palette.mtnPeakShade}
          />
          {/* Mid Ridge Mountain Peak (extends to y=860 for solid occlusion) */}
          <path
            d="M 165 860 L 165 565 C 215 538, 268 505, 308 498 C 342 492, 385 520, 445 550 L 445 860 Z"
            fill={palette.mtnMidRidge}
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 4: MID-DISTANCE ROLLING HILLS & MID TREES                */}
        {/* ============================================================== */}
        <g className="rolling-hills-mid">
          {/* Distant Horizon Rolling Ridge Layer (solid down to y=860) */}
          <path
            d="M -15 860 L -15 535 C 45 524, 115 520, 175 534 C 235 548, 295 558, 355 552 C 395 548, 420 550, 445 553 L 445 860 Z"
            fill={palette.hillDistantRidge}
          />

          {/* Middle Left Rolling Hill (solid down to y=860) */}
          <path
            d="M -15 860 L -15 570 C 35 568, 85 575, 135 590 C 185 605, 235 625, 285 645 C 325 660, 355 665, 385 665 L 385 860 Z"
            fill={palette.hillMidLeft}
          />

          {/* Middle Right Grassy Meadow */}
          <path
            d="M 235 610 C 275 585, 335 565, 395 560 C 418 558, 435 560, 445 562 L 445 860 C 405 675, 345 670, 285 665 C 255 650, 242 630, 235 610 Z"
            fill={palette.hillMidRight}
          />
          {/* Highlight ridge line along crest */}
          <path
            d="M 245 608 C 285 583, 340 563, 400 558 C 420 556, 435 558, 445 560"
            stroke={palette.hillMidRightHighlight}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity={0.8}
          />
        </g>

        {/* Trees along Mid-Distance Hills */}
        <g className="trees-mid">
          {/* Shrub cluster on right middle ridge */}
          <ellipse cx="320" cy="595" rx="14" ry="10" fill={palette.treeCanopy} />
          <ellipse cx="336" cy="592" rx="18" ry="12" fill={palette.treeCanopy} />
          <ellipse cx="355" cy="596" rx="15" ry="11" fill={palette.treeCanopy} />
          <ellipse cx="334" cy="590" rx="13" ry="8" fill={palette.treeCanopyHighlight} opacity={0.65} />

          {/* Tree 4: Right Mid Hill */}
          <rect x="368" y="618" width="3.5" height="16" rx="1" fill={palette.treeTrunk} />
          <ellipse cx="370" cy="610" rx="13" ry="17" fill={palette.treeCanopy} />
          <ellipse cx="367" cy="607" rx="9" ry="12" fill={palette.treeCanopyHighlight} opacity={0.7} />

          {/* Tree 5: Right Middle Ridge */}
          <rect x="408" y="594" width="4" height="20" rx="1" fill={palette.treeTrunk} />
          <ellipse cx="410" cy="584" rx="16" ry="21" fill={palette.treeCanopy} />
          <ellipse cx="407" cy="580" rx="11" ry="15" fill={palette.treeCanopyHighlight} opacity={0.7} />
        </g>

        {/* ============================================================== */}
        {/* LAYER 5: THE WINDING RIVER & WATER REFLECTIONS                 */}
        {/* ============================================================== */}
        <g className="winding-river">
          {/* Main River Body */}
          <path
            d="M 338 556
               C 310 578, 275 604, 245 632
               C 215 658, 192 680, 208 696
               C 224 712, 270 722, 320 735
               C 365 747, 408 772, 445 802
               L 445 855
               L 315 855
               C 270 812, 220 778, 172 758
               C 142 745, 138 718, 168 698
               C 194 680, 224 658, 254 632
               C 284 604, 316 578, 346 556 Z"
            fill={`url(#${id}-river)`}
          />

          {/* Night Pale Golden Moonlight Reflection Ribbon */}
          {palette.starsOpacity > 0.05 && (
            <path
              d="M 338 560
                 C 312 580, 280 606, 252 634
                 C 226 660, 206 682, 218 696
                 C 230 708, 272 718, 318 730
                 C 360 742, 400 765, 435 792"
              stroke="#FFF3D6"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              opacity={palette.starsOpacity * 0.72}
              filter="blur(3px)"
            />
          )}

          {/* River Water Highlights / Shimmer flow lines */}
          <g stroke="#FFFFFF" strokeLinecap="round" opacity={palette.waterFlowOpacity} fill="none">
            {/* Upper Flow */}
            <path d="M 282 602 C 265 618, 248 632, 235 645" strokeWidth="2.5" />
            <path d="M 292 612 C 278 626, 262 638, 252 648" strokeWidth="1.8" />

            {/* Mid Turn */}
            <path d="M 230 678 C 220 688, 230 696, 255 702" strokeWidth="2.8" />
            <path d="M 265 706 C 295 714, 335 724, 365 732" strokeWidth="3" />
            <path d="M 285 722 C 320 730, 360 740, 395 752" strokeWidth="2.2" />

            {/* Foreground Wide Rapids */}
            <path d="M 325 765 C 365 776, 405 792, 440 810" strokeWidth="3.2" />
            <path d="M 355 792 C 385 802, 415 815, 440 828" strokeWidth="2.5" />
            <path d="M 305 798 C 340 810, 380 826, 420 845" strokeWidth="2" />
          </g>

          {/* Glistening Sparkle Star (Bottom Right) */}
          <motion.path
            d="M 395 802 Q 395 810 403 810 Q 395 810 395 818 Q 395 810 387 810 Q 395 810 395 802 Z"
            fill="#FFFFFF"
            animate={{
              scale: [0.85, 1.25, 0.85],
              opacity: [0.65, 1, 0.65],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '395px 810px' }}
          />
        </g>

        {/* ============================================================== */}
        {/* LAYER 6: FOREGROUND MEADOWS, TREES, COTTAGE & FIREFLIES        */}
        {/* ============================================================== */}
        <g className="foreground-meadows">
          {/* Left Foreground Grassy Slope (Where the Cottage sits) */}
          <path
            d="M -15 690 L -15 615 C 25 615, 75 625, 125 640 C 170 655, 202 670, 218 685 C 228 695, 218 710, 198 715 C 158 725, 88 740, -15 755 Z"
            fill={palette.hillCottageMeadow}
          />

          {/* Right Foreground River Bank */}
          <path
            d="M 235 686 C 280 670, 350 655, 445 650 L 445 775 C 395 770, 345 748, 288 726 C 262 718, 245 702, 235 686 Z"
            fill={palette.hillRightForeground}
          />

          {/* Bottom Left Corner Grass Bank */}
          <path
            d="M -15 745 C 35 735, 105 740, 155 760 C 205 780, 265 815, 310 855 L -15 855 Z"
            fill={palette.hillBottomCorner}
          />
        </g>

        {/* Foreground Trees */}
        <g className="trees-foreground">
          {/* Tree 1: Left background behind cottage */}
          <rect x="34" y="582" width="3.5" height="16" rx="1" fill={palette.treeTrunk} />
          <ellipse cx="36" cy="572" rx="12" ry="16" fill={palette.treeCanopy} />
          <ellipse cx="33" cy="568" rx="8" ry="11" fill={palette.treeCanopyHighlight} opacity={0.7} />

          {/* Tree 2: Left background edge */}
          <rect x="58" y="594" width="3" height="14" rx="1" fill={palette.treeTrunk} />
          <ellipse cx="60" cy="585" rx="10" ry="14" fill={palette.treeCanopy} />
          <ellipse cx="58" cy="582" rx="7" ry="10" fill={palette.treeCanopyHighlight} opacity={0.7} />

          {/* Tree 3: Beside cottage on the right */}
          <rect x="138" y="640" width="4.5" height="20" rx="1" fill={palette.treeTrunk} />
          <ellipse cx="140" cy="628" rx="15" ry="20" fill={palette.treeCanopy} />
          <ellipse cx="137" cy="624" rx="10" ry="14" fill={palette.treeCanopyHighlight} opacity={0.7} />

          {/* Tree 6: Right bank foreground */}
          <rect x="352" y="642" width="4" height="18" rx="1" fill={palette.treeTrunk} />
          <ellipse cx="354" cy="632" rx="14" ry="18" fill={palette.treeCanopy} />
          <ellipse cx="351" cy="628" rx="10" ry="13" fill={palette.treeCanopyHighlight} opacity={0.7} />
        </g>

        {/* The Cottage */}
        <g className="cottage-group">
          {/* Ground Contact Shadow */}
          <ellipse
            cx="75"
            cy="708"
            rx="52"
            ry="11"
            fill={`url(#${id}-cottage-shadow)`}
          />

          {/* Exterior Window Light Bloom on grass and wall (Lights ON) */}
          {windowBloomOpacity > 0.01 && (
            <circle
              cx="46"
              cy="678"
              r="48"
              fill={`url(#${id}-window-bloom)`}
              opacity={windowBloomOpacity}
            />
          )}

          {/* Chimney */}
          <rect x="50" y="618" width="10" height="22" fill={palette.cottageChimney} />
          {/* Chimney Cap */}
          <rect x="48" y="616" width="14" height="3" rx="0.5" fill="#6A4535" />

          {/* Left Side Wall */}
          <polygon
            points="30,655 72,655 72,705 30,705"
            fill={palette.cottageWallSide}
          />

          {/* Front Gable Wall (Facing right/forward) */}
          <polygon
            points="72,655 94,635 116,655 116,705 72,705"
            fill={palette.cottageWallFront}
          />

          {/* Gable Roof Overhang: Left Slope */}
          <polygon
            points="24,657 68,624 95,632 68,662"
            fill={palette.cottageRoofLeft}
          />

          {/* Gable Roof Overhang: Right Shaded Slope */}
          <polygon
            points="95,632 122,658 116,662 92,638"
            fill={palette.cottageRoofRight}
          />

          {/* Front Door */}
          <rect x="88" y="672" width="13" height="33" rx="1" fill={palette.cottageDoor} />

          {/* Window 1 (Left wall: smooth daylight slate -> glowing warm amber) */}
          <g transform="translate(38, 672)">
            <rect x="0" y="0" width="12" height="12" rx="1" fill="#4A3427" />
            <rect
              x="1.5"
              y="1.5"
              width="9"
              height="9"
              fill={windowPaneColor}
            />
            <line
              x1="6"
              y1="1.5"
              x2="6"
              y2="10.5"
              stroke={windowMullionColor}
              strokeWidth="1"
            />
            <line
              x1="1.5"
              y1="6"
              x2="10.5"
              y2="6"
              stroke={windowMullionColor}
              strokeWidth="1"
            />
          </g>

          {/* Window 2 (Left wall: smooth daylight slate -> glowing warm amber) */}
          <g transform="translate(54, 672)">
            <rect x="0" y="0" width="12" height="12" rx="1" fill="#4A3427" />
            <rect
              x="1.5"
              y="1.5"
              width="9"
              height="9"
              fill={windowPaneColor}
            />
            <line
              x1="6"
              y1="1.5"
              x2="6"
              y2="10.5"
              stroke={windowMullionColor}
              strokeWidth="1"
            />
            <line
              x1="1.5"
              y1="6"
              x2="10.5"
              y2="6"
              stroke={windowMullionColor}
              strokeWidth="1"
            />
          </g>
        </g>

        {/* Glowing Fireflies (Active in Evening & Night over grass) */}
        {palette.firefliesOpacity > 0.02 && (
          <g className="fireflies-layer" opacity={palette.firefliesOpacity}>
            {FIREFLIES.map((ff) => (
              <motion.g
                key={ff.id}
                animate={{
                  x: [-3, 4, -3],
                  y: [-4, 5, -4],
                  opacity: [0.25, 0.95, 0.25],
                  scale: [0.8, 1.25, 0.8],
                }}
                transition={{
                  duration: ff.dur,
                  delay: ff.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: `${ff.cx}px ${ff.cy}px` }}
              >
                <circle
                  cx={ff.cx}
                  cy={ff.cy}
                  r={ff.r * 2.8}
                  fill={`url(#${id}-firefly-halo)`}
                />
                <circle cx={ff.cx} cy={ff.cy} r={ff.r} fill="#FCFFA6" />
              </motion.g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
