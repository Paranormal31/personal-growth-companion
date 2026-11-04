import { useId, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimeOfDay, TimeThemeConfig } from '../../types/theme';
import { TIME_THEMES, getTimeTheme } from '../../constants/timeThemes';
import { CelestialCharacter } from './CelestialCharacter';

export interface ScenicLandscapeProps {
  /** Time-of-day period ('morning' | 'afternoon' | 'evening' | 'night') */
  period?: TimeOfDay;
  /** Full theme configuration override (optional, defaults to getTimeTheme(period)) */
  theme?: TimeThemeConfig;
  /** Numeric key triggering the radial orbital arc transition animation */
  replayKey?: number;
  /** Whether to render the celestial character in the sky vault (default: true) */
  showCelestial?: boolean;
  /** Whether celestial character reacts to taps and hover */
  interactive?: boolean;
  /** Callback when celestial character is tapped */
  onCelestialTap?: () => void;
  /** Additional CSS classes for wrapper container */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/** Deterministic star coordinates for night sky */
const NIGHT_STARS = [
  { id: 1, x: 45, y: 35, r: 1.8, dur: 2.2, delay: 0.1 },
  { id: 2, x: 95, y: 70, r: 2.4, dur: 3.1, delay: 0.6 },
  { id: 3, x: 140, y: 45, r: 1.5, dur: 1.9, delay: 1.2 },
  { id: 4, x: 190, y: 85, r: 2.8, dur: 2.7, delay: 0.3, diamond: true },
  { id: 5, x: 235, y: 30, r: 1.6, dur: 2.4, delay: 0.8 },
  { id: 6, x: 285, y: 65, r: 2.2, dur: 3.3, delay: 1.5 },
  { id: 7, x: 340, y: 40, r: 2.6, dur: 2.1, delay: 0.2, diamond: true },
  { id: 8, x: 385, y: 90, r: 1.7, dur: 2.9, delay: 0.9 },
  { id: 9, x: 430, y: 50, r: 2.0, dur: 1.8, delay: 1.4 },
  { id: 10, x: 480, y: 80, r: 2.5, dur: 3.0, delay: 0.5, diamond: true },
  { id: 11, x: 520, y: 35, r: 1.5, dur: 2.3, delay: 1.1 },
  { id: 12, x: 575, y: 60, r: 2.2, dur: 2.6, delay: 0.4 },
  { id: 13, x: 630, y: 40, r: 1.8, dur: 3.2, delay: 1.6 },
  { id: 14, x: 675, y: 85, r: 2.7, dur: 2.0, delay: 0.7, diamond: true },
  { id: 15, x: 720, y: 55, r: 1.6, dur: 2.8, delay: 1.3 },
  { id: 16, x: 760, y: 30, r: 2.3, dur: 3.4, delay: 0.2 },
  { id: 17, x: 70, y: 120, r: 1.5, dur: 2.5, delay: 1.0 },
  { id: 18, x: 120, y: 140, r: 2.1, dur: 1.9, delay: 0.5 },
  { id: 19, x: 165, y: 110, r: 1.7, dur: 3.1, delay: 1.4 },
  { id: 20, x: 220, y: 135, r: 2.4, dur: 2.6, delay: 0.8 },
  { id: 21, x: 260, y: 115, r: 1.8, dur: 2.2, delay: 0.3 },
  { id: 22, x: 310, y: 145, r: 2.5, dur: 3.0, delay: 1.2, diamond: true },
  { id: 23, x: 360, y: 125, r: 1.6, dur: 2.4, delay: 0.6 },
  { id: 24, x: 410, y: 155, r: 2.2, dur: 2.8, delay: 1.5 },
  { id: 25, x: 460, y: 130, r: 1.5, dur: 1.8, delay: 0.1 },
  { id: 26, x: 510, y: 145, r: 2.6, dur: 3.3, delay: 1.0, diamond: true },
  { id: 27, x: 650, y: 130, r: 1.7, dur: 2.7, delay: 0.4 },
  { id: 28, x: 700, y: 110, r: 2.3, dur: 2.1, delay: 1.3 },
  { id: 29, x: 745, y: 140, r: 1.6, dur: 3.0, delay: 0.7 },
  { id: 30, x: 610, y: 150, r: 2.0, dur: 2.5, delay: 1.1 },
  { id: 31, x: 180, y: 160, r: 1.8, dur: 2.3, delay: 0.9 },
  { id: 32, x: 330, y: 165, r: 2.2, dur: 2.9, delay: 0.4 },
];

/** Glistening water sparkles for Afternoon */
const WATER_GLISTENS = [
  { id: 1, x: 375, y: 310, size: 7, dur: 1.6, delay: 0.1 },
  { id: 2, x: 395, y: 335, size: 9, dur: 2.0, delay: 0.5 },
  { id: 3, x: 360, y: 350, size: 8, dur: 1.8, delay: 1.0 },
  { id: 4, x: 425, y: 375, size: 10, dur: 2.2, delay: 0.3 },
  { id: 5, x: 455, y: 395, size: 8, dur: 1.7, delay: 0.8 },
  { id: 6, x: 390, y: 415, size: 11, dur: 2.1, delay: 1.2 },
  { id: 7, x: 480, y: 440, size: 9, dur: 1.9, delay: 0.4 },
  { id: 8, x: 345, y: 450, size: 7, dur: 2.3, delay: 0.7 },
];

/**
 * ScenicLandscape
 *
 * A single unified living landscape across all 4 times of day:
 * - Dynamic horizon & sky gradient matching active theme stops [c0, c1, c2, c3]
 * - Winding river flowing towards center horizon with water reflections & ripples
 * - Arched stone bridge crossing the river with water visible beneath
 * - Cozy riverside cottage:
 *   * Window lights OFF during Morning and Afternoon
 *   * Window lights ON (warm glowing amber light with soft exterior bloom) during Evening and Night
 *   * Gentle animated chimney smoke puffs
 * - 4 distinct atmospheric weather / cloud conditions:
 *   1. Morning: Warm dawn glow, fluffy floating morning clouds drifting across the sky
 *   2. Afternoon: Fresh blue sky, crisp white clouds, glistening sunlit water under the bridge
 *   3. Evening: Rosy purple sunset streaks, twilight mountain silhouettes
 *   4. Night: Deep starlit sky with 32 twinkling stars, shooting star meteor, and drifting mist
 * - Radial Orbital Arc Transition:
 *   Departing celestial body curves down and out along a natural sky trajectory;
 *   Incoming celestial body arcs smoothly up into the sky (~1.0s - 1.2s duration).
 */
export function ScenicLandscape({
  period = 'morning',
  theme: customTheme,
  replayKey = 0,
  showCelestial = true,
  interactive = true,
  onCelestialTap,
  className = '',
  style,
}: ScenicLandscapeProps) {
  const theme = customTheme ?? getTimeTheme(period) ?? TIME_THEMES.morning;
  const uid = useId().replace(/:/g, '');

  const colors = theme.colors;
  const isNight = period === 'night';
  const isEvening = period === 'evening';
  const isMorning = period === 'morning';
  const isAfternoon = period === 'afternoon';
  const isWindowLightOn = theme.houseLightOn;

  // Mountain & hill palettes based on time of day
  const terrainPalette = useMemo(() => {
    switch (period) {
      case 'morning':
        return {
          mountainsFar: '#D88A83',
          mountainsMid: '#C4757A',
          hillLeft: '#8EA66E',
          hillRight: '#779357',
          foreground: '#658146',
          waterPrimary: '#FFA885',
          waterSecondary: '#FFCC66',
          waterAccent: '#FFE6A3',
          bridgeStone: '#B09885',
          bridgeShade: '#876F5E',
          cottageWall: '#EBDDC8',
          cottageRoof: '#A85D47',
        };
      case 'afternoon':
        return {
          mountainsFar: '#6A9BC3',
          mountainsMid: '#4E83B3',
          hillLeft: '#65BA38',
          hillRight: '#4DA225',
          foreground: '#3C8E16',
          waterPrimary: '#57B5FF',
          waterSecondary: '#3B93EB',
          waterAccent: '#BCE4FF',
          bridgeStone: '#B3BABF',
          bridgeShade: '#7F8B94',
          cottageWall: '#FAF4EB',
          cottageRoof: '#B85D3B',
        };
      case 'evening':
        return {
          mountainsFar: '#64487B',
          mountainsMid: '#513768',
          hillLeft: '#4B3860',
          hillRight: '#3F2C54',
          foreground: '#321F45',
          waterPrimary: '#C9B8FF',
          waterSecondary: '#8E7CFB',
          waterAccent: '#F4A7C6',
          bridgeStone: '#6B587B',
          bridgeShade: '#4B3A5A',
          cottageWall: '#D9C5DE',
          cottageRoof: '#6C4066',
        };
      case 'night':
      default:
        return {
          mountainsFar: '#1A183E',
          mountainsMid: '#141235',
          hillLeft: '#1A213D',
          hillRight: '#151C34',
          foreground: '#0F1528',
          waterPrimary: '#3A2E78',
          waterSecondary: '#201A4A',
          waterAccent: '#A78BFA',
          bridgeStone: '#2E3250',
          bridgeShade: '#1C2038',
          cottageWall: '#2B2E48',
          cottageRoof: '#1B1C2E',
        };
    }
  }, [period]);

  return (
    <div
      className={`relative w-full aspect-[16/9.6] sm:aspect-[16/9] overflow-hidden rounded-[28px] md:rounded-[36px] shadow-lg select-none transition-all duration-700 ${className}`}
      style={{
        backgroundColor: colors.background,
        ...style,
      }}
      role="region"
      aria-label={`Scenic living landscape for ${theme.greeting} - ${theme.title}`}
    >
      {/* ============================================================== */}
      {/* SVG LIVING LANDSCAPE CANVAS (ViewBox 0 0 800 480)              */}
      {/* ============================================================== */}
      <svg
        viewBox="0 0 800 480"
        className="w-full h-full block absolute inset-0 pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Dynamic Sky Gradient (Theme stops 0, 1, 2, 3) */}
          <linearGradient id={`skyGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="42%" stopColor={colors[1]} />
            <stop offset="72%" stopColor={colors[2]} />
            <stop offset="100%" stopColor={colors[3]} />
          </linearGradient>

          {/* Dynamic River Gradient */}
          <linearGradient id={`riverGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={terrainPalette.waterSecondary} stopOpacity="0.85" />
            <stop offset="40%" stopColor={terrainPalette.waterPrimary} />
            <stop offset="100%" stopColor={terrainPalette.waterSecondary} />
          </linearGradient>

          {/* Water Highlight Ripple Shimmer */}
          <linearGradient id={`waterShimmer-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={terrainPalette.waterAccent} stopOpacity="0.1" />
            <stop offset="50%" stopColor={terrainPalette.waterAccent} stopOpacity="0.85" />
            <stop offset="100%" stopColor={terrainPalette.waterAccent} stopOpacity="0.1" />
          </linearGradient>

          {/* Horizon Atmospheric Glow */}
          <radialGradient id={`horizonGlow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.accent} stopOpacity="0.45" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
          </radialGradient>

          {/* Morning / Afternoon Cloud Gradients */}
          <linearGradient id={`cloudGradMorning-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFBF2" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFA07A" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id={`cloudGradAfternoon-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#E0F0FF" stopOpacity="0.75" />
          </linearGradient>

          {/* Warm Cottage Window Exterior Bloom (Evening & Night) */}
          <radialGradient id={`windowBloom-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC83D" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FFA500" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#FF7700" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FF7700" stopOpacity="0" />
          </radialGradient>

          {/* Shooting Star Gradient */}
          <linearGradient id={`shootingStarGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="40%" stopColor="#DDD6FE" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Bridge Arch Shadow */}
          <linearGradient id={`bridgeShadow-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
          </linearGradient>

          {/* River Mist Gradient (Night) */}
          <linearGradient id={`mistGrad-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#E9D5FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* 1. SKY BACKGROUND & ATMOSPHERE                                */}
        {/* ------------------------------------------------------------- */}
        <rect width="800" height="480" fill={`url(#skyGrad-${uid})`} />

        {/* Horizon Soft Glow */}
        <ellipse
          cx="400"
          cy="225"
          rx="380"
          ry="110"
          fill={`url(#horizonGlow-${uid})`}
        />

        {/* ------------------------------------------------------------- */}
        {/* 2. WEATHER & CLOUD CONDITIONS                                 */}
        {/* ------------------------------------------------------------- */}

        {/* --- NIGHT WEATHER: Twinkling Stars & Shooting Star Meteor --- */}
        {isNight && (
          <g key="night-sky-weather">
            {/* 32 Starlit Stars */}
            {NIGHT_STARS.map((star) => (
              <motion.g
                key={`star-${star.id}`}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: star.diamond ? [0.8, 1.35, 0.8] : [0.75, 1.25, 0.75],
                }}
                transition={{
                  duration: star.dur,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: `${star.x}px ${star.y}px` }}
              >
                {star.diamond ? (
                  <path
                    d={`M ${star.x} ${star.y - star.r * 1.5} Q ${star.x} ${star.y} ${
                      star.x + star.r * 1.5
                    } ${star.y} Q ${star.x} ${star.y} ${star.x} ${
                      star.y + star.r * 1.5
                    } Q ${star.x} ${star.y} ${star.x - star.r * 1.5} ${star.y} Z`}
                    fill="#FFFFFF"
                  />
                ) : (
                  <circle cx={star.x} cy={star.y} r={star.r} fill="#F8FAFF" />
                )}
              </motion.g>
            ))}

            {/* Shooting Star Meteor across the upper sky */}
            <motion.g
              animate={{
                x: [-120, 360],
                y: [-60, 180],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.25,
                repeat: Infinity,
                repeatDelay: 8.5,
                ease: 'easeOut',
                times: [0, 0.2, 0.7, 1],
              }}
            >
              <line
                x1="180"
                y1="35"
                x2="240"
                y2="65"
                stroke={`url(#shootingStarGrad-${uid})`}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <circle cx="240" cy="65" r="2.2" fill="#FFFFFF" />
            </motion.g>
          </g>
        )}

        {/* --- MORNING WEATHER: Dawn Glow & Fluffy Floating Morning Clouds --- */}
        {isMorning && (
          <g key="morning-clouds">
            {/* Cloud 1 */}
            <motion.g
              animate={{ x: [-22, 26, -22] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M 90 95 Q 80 95 72 87 Q 65 78 72 68 Q 80 58 92 62 Q 98 48 114 48 Q 130 48 136 60 Q 146 58 152 66 Q 160 75 154 85 Q 162 95 148 95 Z"
                fill={`url(#cloudGradMorning-${uid})`}
              />
            </motion.g>

            {/* Cloud 2 */}
            <motion.g
              animate={{ x: [18, -20, 18] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M 270 120 Q 262 120 256 114 Q 250 106 256 98 Q 262 90 272 93 Q 278 82 290 82 Q 304 82 310 92 Q 318 90 324 97 Q 330 104 326 112 Q 332 120 320 120 Z"
                fill={`url(#cloudGradMorning-${uid})`}
                opacity="0.88"
              />
            </motion.g>

            {/* Cloud 3 */}
            <motion.g
              animate={{ x: [-16, 18, -16] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M 460 70 Q 452 70 446 64 Q 440 56 446 48 Q 452 40 462 43 Q 468 32 480 32 Q 494 32 500 42 Q 508 40 514 47 Q 520 54 516 62 Q 522 70 510 70 Z"
                fill={`url(#cloudGradMorning-${uid})`}
                opacity="0.82"
              />
            </motion.g>
          </g>
        )}

        {/* --- AFTERNOON WEATHER: Fresh Crisp White Clouds --- */}
        {isAfternoon && (
          <g key="afternoon-clouds">
            {/* Cloud 1 */}
            <motion.g
              animate={{ x: [-18, 22, -18] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M 120 85 Q 108 85 98 75 Q 90 64 100 52 Q 110 40 126 44 Q 134 28 154 28 Q 174 28 182 42 Q 194 40 202 50 Q 212 60 206 74 Q 214 85 198 85 Z"
                fill={`url(#cloudGradAfternoon-${uid})`}
              />
            </motion.g>

            {/* Cloud 2 */}
            <motion.g
              animate={{ x: [16, -16, 16] }}
              transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M 330 110 Q 320 110 312 102 Q 305 92 312 82 Q 320 72 332 75 Q 338 62 352 62 Q 366 62 374 74 Q 384 72 390 80 Q 398 90 392 100 Q 398 110 384 110 Z"
                fill={`url(#cloudGradAfternoon-${uid})`}
                opacity="0.9"
              />
            </motion.g>
          </g>
        )}

        {/* --- EVENING WEATHER: Rosy Purple Sunset Streaks --- */}
        {isEvening && (
          <g key="evening-sunset-streaks" opacity="0.65">
            <path
              d="M 0 150 Q 240 142 480 152 Q 680 144 800 150 L 800 168 Q 620 160 400 166 Q 180 160 0 168 Z"
              fill="#F4A7C6"
            />
            <path
              d="M 0 178 Q 200 170 420 180 Q 640 172 800 178 L 800 196 Q 600 188 380 194 Q 160 188 0 196 Z"
              fill="#C9B8FF"
              opacity="0.8"
            />
            <path
              d="M 0 206 Q 260 198 520 208 Q 700 202 800 206 L 800 220 Q 560 214 320 220 Q 120 216 0 220 Z"
              fill="#FFA07A"
              opacity="0.6"
            />
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 3. DISTANT MOUNTAIN SILHOUETTES & HORIZON                     */}
        {/* ------------------------------------------------------------- */}
        {/* Far Background Mountain Range */}
        <path
          d="M 0 235 L 0 185 Q 65 145 130 165 Q 210 190 280 140 Q 350 105 420 170 Q 510 130 600 178 Q 690 135 760 172 L 800 188 L 800 250 L 0 250 Z"
          fill={terrainPalette.mountainsFar}
          opacity={isEvening ? 0.95 : 0.8}
        />

        {/* Secondary Mid-Mountain Silhouette */}
        <path
          d="M 0 240 L 0 200 Q 90 170 180 195 Q 270 218 360 185 Q 450 160 540 195 Q 630 220 720 185 L 800 205 L 800 260 L 0 260 Z"
          fill={terrainPalette.mountainsMid}
          opacity="0.9"
        />

        {/* Midground Rolling Green/Purple Hills */}
        {/* Left Hill */}
        <path
          d="M 0 245 Q 140 220 290 250 Q 380 270 420 295 L 0 295 Z"
          fill={terrainPalette.hillLeft}
        />

        {/* Right Hill */}
        <path
          d="M 380 255 Q 520 220 660 235 Q 740 240 800 255 L 800 320 L 380 320 Z"
          fill={terrainPalette.hillRight}
        />

        {/* ------------------------------------------------------------- */}
        {/* 4. WINDING RIVER WITH WATER REFLECTIONS                       */}
        {/* ------------------------------------------------------------- */}
        <path
          d="M 405 230 C 420 245, 455 255, 445 275 C 430 300, 340 305, 345 340 C 350 375, 480 380, 470 415 C 460 450, 330 460, 290 480 L 580 480 C 560 455, 520 440, 525 415 C 535 375, 420 370, 420 340 C 420 310, 465 295, 445 270 C 435 255, 422 245, 419 230 Z"
          fill={`url(#riverGrad-${uid})`}
        />

        {/* Animated River Ripples / Currents */}
        <motion.path
          d="M 412 250 Q 425 256 438 252"
          stroke={`url(#waterShimmer-${uid})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={{ opacity: [0.3, 0.8, 0.3], x: [-2, 2, -2] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 365 330 Q 385 338 410 332"
          stroke={`url(#waterShimmer-${uid})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          animate={{ opacity: [0.4, 0.9, 0.4], x: [2, -3, 2] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 420 395 Q 450 404 485 396"
          stroke={`url(#waterShimmer-${uid})`}
          strokeWidth="2.8"
          strokeLinecap="round"
          animate={{ opacity: [0.35, 0.85, 0.35], x: [-3, 3, -3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 330 455 Q 380 466 440 457"
          stroke={`url(#waterShimmer-${uid})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          animate={{ opacity: [0.3, 0.8, 0.3], x: [3, -3, 3] }}
          transition={{ duration: 4.0, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* --- AFTERNOON WATER: Glistening Sunlit Water under the Bridge --- */}
        {isAfternoon && (
          <g key="afternoon-water-sparkles">
            {WATER_GLISTENS.map((sp) => (
              <motion.g
                key={`water-sparkle-${sp.id}`}
                animate={{
                  scale: [0.4, 1.25, 0.4],
                  opacity: [0.15, 1, 0.15],
                }}
                transition={{
                  duration: sp.dur,
                  delay: sp.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: `${sp.x}px ${sp.y}px` }}
              >
                <path
                  d={`M ${sp.x} ${sp.y - sp.size} Q ${sp.x} ${sp.y} ${sp.x + sp.size} ${
                    sp.y
                  } Q ${sp.x} ${sp.y} ${sp.x} ${sp.y + sp.size} Q ${sp.x} ${sp.y} ${
                    sp.x - sp.size
                  } ${sp.y} Z`}
                  fill="#FFFFFF"
                />
              </motion.g>
            ))}
          </g>
        )}

        {/* --- NIGHT WATER: Drifting River Mist Ribbons --- */}
        {isNight && (
          <g key="night-river-mist">
            <motion.path
              d="M 340 345 Q 390 338 440 348 Q 470 340 500 346"
              stroke={`url(#mistGrad-${uid})`}
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
              animate={{ x: [-15, 20, -15], opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.path
              d="M 310 420 Q 370 410 440 425 Q 490 415 540 422"
              stroke={`url(#mistGrad-${uid})`}
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
              animate={{ x: [18, -15, 18], opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 5. ARCHED STONE BRIDGE OVER THE RIVER                         */}
        {/* ------------------------------------------------------------- */}
        {/* Bridge Water Shadow Reflection Underneath */}
        <path
          d="M 324 316 Q 375 338 426 316 Q 375 304 324 316 Z"
          fill={`url(#bridgeShadow-${uid})`}
        />

        {/* Bridge Main Masonry Structure */}
        <g id="arched-bridge">
          {/* Bridge Spandrel Wall */}
          <path
            d="M 305 312 Q 375 284 445 312 L 445 322 Q 375 294 305 322 Z"
            fill={terrainPalette.bridgeShade}
          />

          {/* Bridge Arch Opening (River visible flowing through) */}
          <path
            d="M 322 320 Q 375 292 428 320 Z"
            fill="none"
            stroke={terrainPalette.bridgeShade}
            strokeWidth="3.5"
          />

          {/* Upper Bridge Roadway Deck */}
          <path
            d="M 302 310 Q 375 282 448 310"
            stroke={terrainPalette.bridgeStone}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Bridge Stone Parapet Posts */}
          {[310, 335, 360, 385, 410, 435].map((px) => {
            // Parabolic curve calculation for balustrade posts
            const norm = (px - 375) / 70;
            const py = 286 + norm * norm * 24;
            return (
              <rect
                key={`post-${px}`}
                x={px - 2}
                y={py - 7}
                width="4"
                height="8"
                rx="1"
                fill={terrainPalette.bridgeStone}
              />
            );
          })}

          {/* Bridge Railing Bar */}
          <path
            d="M 308 304 Q 375 276 442 304"
            stroke={terrainPalette.bridgeStone}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Keystone in Arch Center */}
          <polygon
            points="372,284 378,284 377,293 373,293"
            fill={terrainPalette.bridgeStone}
          />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 6. COZY RIVERSIDE COTTAGE                                     */}
        {/* ------------------------------------------------------------- */}
        <g id="cozy-cottage">
          {/* Warm Window Light Exterior Bloom onto Grass & Wall (Evening & Night) */}
          {isWindowLightOn && (
            <motion.ellipse
              cx="220"
              cy="306"
              rx="46"
              ry="34"
              fill={`url(#windowBloom-${uid})`}
              animate={{
                opacity: [0.72, 0.98, 0.72],
                scale: [0.96, 1.05, 0.96],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '220px 306px' }}
            />
          )}

          {/* Cottage Foundation & Main Wall */}
          <rect
            x="162"
            y="284"
            width="82"
            height="46"
            rx="2"
            fill={terrainPalette.cottageWall}
            stroke={isNight ? '#22253B' : '#8A7A68'}
            strokeWidth="1.2"
          />

          {/* Stone Chimney */}
          <rect
            x="172"
            y="224"
            width="13"
            height="32"
            rx="1"
            fill={terrainPalette.bridgeShade}
          />
          <rect
            x="170"
            y="222"
            width="17"
            height="4"
            rx="1"
            fill={terrainPalette.bridgeStone}
          />

          {/* Animated Translucent Chimney Smoke Puffs */}
          {[0, 1.1, 2.2].map((delay, idx) => (
            <motion.circle
              key={`smoke-${idx}`}
              cx="178"
              cy="218"
              r="4.5"
              fill={isNight ? '#C9B8FF' : '#FFFFFF'}
              animate={{
                y: [-3, -28],
                x: [0, 8],
                scale: [0.7, 1.6],
                opacity: [0.65, 0],
              }}
              transition={{
                duration: 3.3,
                delay,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Pitch Gable Thatch / Cedar Roof with Overhang */}
          <polygon
            points="152,286 203,234 254,286"
            fill={terrainPalette.cottageRoof}
          />
          {/* Eaves Shadow */}
          <line
            x1="154"
            y1="286"
            x2="252"
            y2="286"
            stroke="#000000"
            strokeOpacity="0.25"
            strokeWidth="2"
          />

          {/* Cottage Front Door */}
          <path
            d="M 174 330 L 174 306 Q 183 298 192 306 L 192 330 Z"
            fill={terrainPalette.cottageRoof}
            opacity="0.9"
          />
          {/* Brass Door Knob */}
          <circle cx="189" cy="316" r="1.3" fill="#FFC83D" />

          {/* Cozy Cottage Window */}
          <rect
            x="208"
            y="294"
            width="22"
            height="22"
            rx="3"
            fill={isWindowLightOn ? '#FFC83D' : '#768B9E'}
            stroke={terrainPalette.cottageRoof}
            strokeWidth="1.8"
          />

          {/* Warm Window Glow Internal Core */}
          {isWindowLightOn && (
            <motion.rect
              x="210"
              y="296"
              width="18"
              height="18"
              rx="2"
              fill="#FFF2A8"
              animate={{ opacity: [0.82, 1, 0.82] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Window Pane Mullions (Cross) */}
          <line
            x1="219"
            y1="294"
            x2="219"
            y2="316"
            stroke={terrainPalette.cottageRoof}
            strokeWidth="1.6"
          />
          <line
            x1="208"
            y1="305"
            x2="230"
            y2="305"
            stroke={terrainPalette.cottageRoof}
            strokeWidth="1.6"
          />

          {/* Little Stone Footpath from Door towards Bridge */}
          <ellipse cx="183" cy="336" rx="4" ry="2" fill={terrainPalette.bridgeStone} opacity="0.75" />
          <ellipse cx="192" cy="341" rx="5" ry="2.2" fill={terrainPalette.bridgeStone} opacity="0.75" />
          <ellipse cx="204" cy="345" rx="5.5" ry="2.5" fill={terrainPalette.bridgeStone} opacity="0.75" />
          <ellipse cx="218" cy="347" rx="6" ry="2.5" fill={terrainPalette.bridgeStone} opacity="0.75" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* 7. FOREGROUND NATURE & FOLIAGE FRAMING                        */}
        {/* ------------------------------------------------------------- */}
        {/* Left Riverside Foliage & Tree */}
        <circle cx="140" cy="275" r="18" fill={terrainPalette.hillLeft} />
        <circle cx="152" cy="265" r="14" fill={terrainPalette.hillLeft} />
        <circle cx="132" cy="262" r="12" fill={terrainPalette.hillRight} />

        {/* Flower Bushes near Cottage */}
        <circle cx="160" cy="332" r="5" fill={colors.accent} opacity="0.85" />
        <circle cx="166" cy="335" r="4" fill={colors.primary} opacity="0.85" />
        <circle cx="240" cy="332" r="6" fill={colors.accent} opacity="0.85" />
        <circle cx="247" cy="336" r="4.5" fill={colors.secondary} opacity="0.85" />

        {/* Foreground Bank Slopes framing lower border */}
        <path
          d="M 0 380 Q 140 350 290 480 L 0 480 Z"
          fill={terrainPalette.foreground}
        />
        <path
          d="M 525 415 Q 640 370 800 395 L 800 480 L 580 480 Z"
          fill={terrainPalette.foreground}
        />

        {/* Right Foreground Friendly Pine / Deciduous Trees */}
        <circle cx="680" cy="370" r="26" fill={terrainPalette.hillRight} />
        <circle cx="660" cy="355" r="20" fill={terrainPalette.hillLeft} />
        <circle cx="705" cy="360" r="22" fill={terrainPalette.foreground} />
      </svg>

      {/* ============================================================== */}
      {/* 8. RADIAL ORBITAL ARC CELESTIAL TRANSITION                     */}
      {/* ============================================================== */}
      {showCelestial && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={`${period}-${replayKey}`}
              className="absolute pointer-events-auto"
              style={{
                right: '15%',
                top: '9%',
                width: 96,
                height: 96,
                transformOrigin: 'center center',
              }}
              // Radial Orbital Arc:
              // Departing body curves down along natural sky horizon arc;
              // Incoming body arcs smoothly up into zenith sky (~1.0 - 1.2s duration).
              initial={{
                x: -115,
                y: 85,
                scale: 0.42,
                opacity: 0,
                rotate: -32,
              }}
              animate={{
                x: [-115, -45, 0],
                y: [85, -12, 0],
                scale: [0.42, 1.06, 1],
                opacity: [0, 1, 1],
                rotate: [-32, -6, 0],
                transition: {
                  duration: 1.15,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              exit={{
                x: [0, 55, 125],
                y: [0, 20, 95],
                scale: [1, 0.82, 0.35],
                opacity: [1, 0.7, 0],
                rotate: [0, 14, 34],
                transition: {
                  duration: 1.0,
                  ease: [0.32, 0, 0.67, 0],
                },
              }}
            >
              <CelestialCharacter
                period={period}
                size={96}
                inkColor={colors.ink}
                interactive={interactive}
                onTap={onCelestialTap}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default ScenicLandscape;
