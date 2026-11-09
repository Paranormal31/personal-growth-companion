import { useState, useEffect, useId, useRef } from 'react';
import { motion, useAnimationControls, animate as fmAnimate } from 'framer-motion';
import {
  getCelestial24hState,
  interpolateHex,
} from './sunMath';

export type CelestialPhase = 'morning' | 'afternoon' | 'evening' | 'night';

export interface CelestialPhaseTransitionProps {
  /**
   * Continuous 24h cycle progress [0..4] (0=morning, 1=afternoon, 2=evening, 3=night).
   * When provided, takes precedence over `phase` for real-time scrubbers and auto-players.
   */
  progress?: number;
  /**
   * Discrete phase: 'morning' | 'afternoon' | 'evening' | 'night' (default: 'morning').
   * Used when `progress` is undefined to drive a spring transition along the orbital arc.
   */
  phase?: CelestialPhase;
  /**
   * Size in pixels for celestial body discs and rays (default: 104px).
   */
  size?: number;
  /**
   * Whether rays and auras animate with ambient pulse and rotation (default: true).
   */
  animated?: boolean;
  /**
   * Whether celestial bodies respond to hover and tap with bouncy squash-and-stretch (default: true).
   */
  interactive?: boolean;
  /**
   * Optional click/tap callback, passes whether sun or moon was tapped.
   */
  onTap?: (body: 'sun' | 'moon') => void;
  /**
   * Extra CSS class names for the container.
   */
  className?: string;
  /**
   * Inline styles for the container.
   */
  style?: React.CSSProperties;
}

/** Exactly 12 angles for thin straight pill rays across all sun phases */
const SUN_RAY_ANGLES_12 = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

/**
 * Minimalist Crescent Moon with sleepy closed eyes.
 */
export function MoonCharacter({
  size = 104,
  animated = true,
  interactive = true,
  onTap,
  className = '',
}: {
  size?: number;
  animated?: boolean;
  interactive?: boolean;
  onTap?: () => void;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const squashControls = useAnimationControls();

  const handleTap = () => {
    if (!interactive) return;
    squashControls.start({
      scaleX: [1, 1.22, 0.94, 1.05, 1],
      scaleY: [1, 0.78, 1.15, 0.97, 1],
      transition: {
        duration: 0.52,
        times: [0, 0.22, 0.55, 0.8, 1],
        ease: [0.34, 1.56, 0.64, 1],
      },
    });
    onTap?.();
  };

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      onClick={handleTap}
      whileHover={interactive ? { scale: 1.08 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      role="img"
      aria-label="Minimalist Crescent Moon with sleepy eyes"
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        animate={squashControls}
        style={{ transformOrigin: '50px 50px' }}
      >
        <defs>
          {/* Lunar Starlight Glow Blur Filter */}
          <filter id={`moonAura-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Floating Moon Group */}
        <motion.g
          animate={
            animated
              ? {
                  y: [0, -5, 0],
                  rotate: [-2, 2, -2],
                }
              : undefined
          }
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '40px 50px' }}
        >
          {/* Soft Starlight Lavender Radial Glow */}
          <circle
            cx="42"
            cy="50"
            r="44"
            fill="#A78BFA"
            opacity="0.32"
            filter={`url(#moonAura-${uid})`}
          />

          {/* Clean Glowing Crescent Moon Body */}
          <path
            d="M 64 15 C 32 18, 14 32, 14 50 C 14 68, 32 82, 64 85 C 48 72, 44 62, 44 50 C 44 38, 48 28, 64 15 Z"
            fill="#FFFBEB"
            stroke="#FDE68A"
            strokeWidth="1.6"
          />

          {/* Sleepy Closed Curved Eyes (⌒ ⌒) */}
          <path
            d="M 22 47 Q 26 42 30 47"
            stroke="#2E1065"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 34 47 Q 38 42 42 47"
            stroke="#2E1065"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Sweet Minimal Smile (⌣) */}
          <path
            d="M 27 57 Q 31 62 35 57"
            stroke="#2E1065"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}

/**
 * Minimalist Sun Character matching the user reference:
 * - Morning: Soft cream-yellow (#FFF2A8), amber outline (#F4A871, 1.8px), warm peach aura, 12 thin straight pill rays (#FFE58F), solid dot eyes, cute curved smile.
 * - Afternoon: Vibrant golden-yellow (#FFC83D), dark gold outline (#E59E20, 1.8px), cyan/sky-blue aura, 12 thin straight rays (#FFC83D), solid dot eyes, cheerful smile.
 * - Evening: Warm deep orange-coral (#FF8542), crimson outline (#C94A1F, 1.8px), twilight purple aura, 12 thin straight rays (#E85A3F), sleepy closed eyes (⌒ ⌒), sweet smile.
 */
export function SunCharacter({
  dayProgress,
  size = 104,
  animated = true,
  interactive = true,
  onTap,
  className = '',
}: {
  dayProgress: number; // [0..2]: 0=morning, 1=afternoon, 2=evening
  size?: number;
  animated?: boolean;
  interactive?: boolean;
  onTap?: () => void;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const squashControls = useAnimationControls();

  // Normalize dayProgress [0..2]
  const dp = Math.max(0, Math.min(2, dayProgress));

  const isAfternoonToEvening = dp > 1;
  const tMorningAfternoon = Math.min(1, dp);
  const pAfternoonEvening = Math.max(0, dp - 1);

  const handleTap = () => {
    if (!interactive) return;
    squashControls.start({
      scaleX: [1, 1.22, 0.94, 1.05, 1],
      scaleY: [1, 0.78, 1.15, 0.97, 1],
      transition: {
        duration: 0.52,
        times: [0, 0.22, 0.55, 0.8, 1],
        ease: [0.34, 1.56, 0.64, 1],
      },
    });
    onTap?.();
  };

  // -------------------------------------------------------------
  // MINIMALIST COLOR & GEOMETRY INTERPOLATION
  // -------------------------------------------------------------
  // Body fill:
  // Morning #FFF2A8 -> Afternoon #FFC83D -> Evening #FF8542
  const bodyColor = !isAfternoonToEvening
    ? interpolateHex('#FFF2A8', '#FFC83D', tMorningAfternoon)
    : interpolateHex('#FFC83D', '#FF8542', pAfternoonEvening);

  // Outline stroke (1.8px):
  // Morning #F4A871 -> Afternoon #E59E20 -> Evening #C94A1F
  const strokeColor = !isAfternoonToEvening
    ? interpolateHex('#F4A871', '#E59E20', tMorningAfternoon)
    : interpolateHex('#E59E20', '#C94A1F', pAfternoonEvening);

  // Aura glow color:
  // Morning warm peach #FFA07A -> Afternoon cyan/sky-blue #76C5FF -> Evening twilight purple #A855F7
  const auraColor = !isAfternoonToEvening
    ? interpolateHex('#FFA07A', '#76C5FF', tMorningAfternoon)
    : interpolateHex('#76C5FF', '#A855F7', pAfternoonEvening);
  const auraOpacity = !isAfternoonToEvening
    ? 0.35 - 0.03 * tMorningAfternoon
    : 0.32 + 0.04 * pAfternoonEvening;

  // 12 Thin straight pill rays color:
  // Morning #FFE58F -> Afternoon #FFC83D -> Evening #E85A3F
  const rayColor = !isAfternoonToEvening
    ? interpolateHex('#FFE58F', '#FFC83D', tMorningAfternoon)
    : interpolateHex('#FFC83D', '#E85A3F', pAfternoonEvening);

  // Facial ink color:
  // Morning dark umber #3D2214 -> Afternoon dark brown #2B180A -> Evening deep crimson #3B1208
  const inkColor = !isAfternoonToEvening
    ? interpolateHex('#3D2214', '#2B180A', tMorningAfternoon)
    : interpolateHex('#2B180A', '#3B1208', pAfternoonEvening);

  // Mouth Bezier Path (clean cute curved smile):
  // Morning: M 42 56 Q 50 64 58 56
  // Afternoon: M 40 55 Q 50 66 60 55
  // Evening: M 43 56 Q 50 63 57 56
  let mouthX1: number;
  let mouthY1: number;
  let mouthCY: number;
  let mouthX2: number;
  let mouthY2: number;
  let mouthStroke: number;

  if (!isAfternoonToEvening) {
    mouthX1 = 42 - 2 * tMorningAfternoon;
    mouthY1 = 56 - 1 * tMorningAfternoon;
    mouthCY = 64 + 2 * tMorningAfternoon;
    mouthX2 = 58 + 2 * tMorningAfternoon;
    mouthY2 = 56 - 1 * tMorningAfternoon;
    mouthStroke = 2.4 + 0.2 * tMorningAfternoon;
  } else {
    mouthX1 = 40 + 3 * pAfternoonEvening;
    mouthY1 = 55 + 1 * pAfternoonEvening;
    mouthCY = 66 - 3 * pAfternoonEvening;
    mouthX2 = 60 - 3 * pAfternoonEvening;
    mouthY2 = 55 + 1 * pAfternoonEvening;
    mouthStroke = 2.6 - 0.2 * pAfternoonEvening;
  }

  const mouthPath = `M ${mouthX1.toFixed(1)} ${mouthY1.toFixed(1)} Q 50.0 ${mouthCY.toFixed(1)} ${mouthX2.toFixed(1)} ${mouthY2.toFixed(1)}`;

  // Sleepy eye transition for evening (weight in [0..1] as afternoon transitions to evening)
  const eveningSleepyEyeWeight = pAfternoonEvening;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ width: size, height: size }}
      onClick={handleTap}
      whileHover={interactive ? { scale: 1.08 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      role="img"
      aria-label={`Minimalist Sun character at daytime progress ${dp.toFixed(2)}`}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        animate={squashControls}
        style={{ transformOrigin: '50px 50px' }}
      >
        <defs>
          {/* Soft Radial Glow Filter */}
          <filter id={`auraGlow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* 1. SOFT CIRCULAR RADIAL GLOW AURA                             */}
        {/* ------------------------------------------------------------- */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill={auraColor}
          opacity={auraOpacity}
          filter={`url(#auraGlow-${uid})`}
        />

        {/* ------------------------------------------------------------- */}
        {/* 2. EXACTLY 12 THIN STRAIGHT PILL RAYS (width ~2.5px)          */}
        {/* ------------------------------------------------------------- */}
        <motion.g
          animate={
            animated
              ? {
                  scale: [1, 1.05, 1],
                }
              : undefined
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '50px 50px' }}
        >
          {SUN_RAY_ANGLES_12.map((angle) => (
            <rect
              key={`ray-${angle}`}
              x="48.75"
              y="12"
              width="2.5"
              height="10"
              rx="1.25"
              fill={rayColor}
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </motion.g>

        {/* ------------------------------------------------------------- */}
        {/* 3. CLEAN FLAT SUN BODY DISC WITH THIN 1.8px OUTLINE           */}
        {/* ------------------------------------------------------------- */}
        <circle
          cx="50"
          cy="50"
          r="26"
          fill={bodyColor}
          stroke={strokeColor}
          strokeWidth="1.8"
        />

        {/* ------------------------------------------------------------- */}
        {/* 4. MINIMALIST EYES                                            */}
        {/* ------------------------------------------------------------- */}
        {/* Morning & Afternoon: Two Simple Solid Dark Dot Eyes (● ●) */}
        {1 - eveningSleepyEyeWeight > 0.02 && (
          <g opacity={1 - eveningSleepyEyeWeight}>
            <circle cx="39" cy="45.5" r="3.5" fill={inkColor} />
            <circle cx="61" cy="45.5" r="3.5" fill={inkColor} />
          </g>
        )}

        {/* Evening: Sleepy Closed Curved Eyes (⌒ ⌒) */}
        {eveningSleepyEyeWeight > 0.02 && (
          <g opacity={eveningSleepyEyeWeight}>
            <path
              d="M 35 46 Q 39 40.5 43 46"
              stroke={inkColor}
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 57 46 Q 61 40.5 65 46"
              stroke={inkColor}
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 5. CLEAN CUTE CURVED SMILE (⌣)                                */}
        {/* ------------------------------------------------------------- */}
        <path
          d={mouthPath}
          stroke={inkColor}
          strokeWidth={mouthStroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.svg>
    </motion.div>
  );
}

/**
 * CelestialPhaseTransition
 *
 * Full 4-Phase Celestial System with 360° Continuous 24h Orbital Arc & Physical Mountain Occlusion:
 *
 * - Day Cycle (T = 0 to 2.3):
 *   * Morning Sun (T = 0): Rising on right (x: ~76%, y: 56%, emerging from y: 68%).
 *   * Afternoon Sun (T = 1): High noon top-center (x: 50%, y: 19%).
 *   * Evening Sun (T = 2): Setting on left (x: 25%, y: 57%).
 *   * Sinking (T = 2 to 2.3): Sun sinks physically behind left mountain ridge (y -> 72%).
 *
 * - Night Cycle (T = 2.3 to 4.0):
 *   * Moon Emergence (T = 2.3 to 2.8): Moon emerges from behind right mountain ridge (rises from y: 70% to y: 54%).
 *   * Night Travel (T = 2.8 to 3.4): Moon travels across upper night sky (x: 70% -> 48%, y: 28%).
 *   * Moon Descent (T = 3.4 to 4.0): Moon descends and sinks physically behind left mountain ridge (x -> 24%, y -> 72%).
 *   * Dawn (T = 4.0 / 0.0): Moon is completely behind left mountain, and Morning Sun emerges from right mountain!
 *
 * - NO FADE OUT: Both Sun and Moon maintain opacity = 1.0 throughout their journey,
 *   relying on physical occlusion by the solid mountain layers.
 */
export function CelestialPhaseTransition({
  progress,
  phase = 'morning',
  size = 104,
  animated = true,
  interactive = true,
  onTap,
  className = '',
  style,
}: CelestialPhaseTransitionProps) {
  const isContinuous = typeof progress === 'number';

  const getPhaseIndex = (p: CelestialPhase): number => {
    switch (p) {
      case 'morning':
        return 0;
      case 'afternoon':
        return 1;
      case 'evening':
        return 2;
      case 'night':
        return 3;
    }
  };

  const [internalProgress, setInternalProgress] = useState<number>(() => getPhaseIndex(phase));
  const progressAnimRef = useRef(getPhaseIndex(phase));

  // Discrete spring / cinematic transition when toggling phase
  useEffect(() => {
    if (isContinuous) return;

    const target = getPhaseIndex(phase);
    const from = progressAnimRef.current;

    // Handle wrapping around 3 -> 0 if going from night to morning
    if (from === 3 && target === 0) {
      const controls = fmAnimate(3, 4, {
        duration: 1.15,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          progressAnimRef.current = latest >= 4 ? 0 : latest;
          setInternalProgress(latest >= 4 ? 0 : latest);
        },
      });
      return () => controls.stop();
    }

    if (Math.abs(from - target) < 0.001) return;

    const controls = fmAnimate(from, target, {
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        progressAnimRef.current = latest;
        setInternalProgress(latest);
      },
    });

    return () => controls.stop();
  }, [phase, isContinuous]);

  const effectiveProgress = isContinuous ? progress : internalProgress;
  const celestialState = getCelestial24hState(effectiveProgress);
  const { sun, moon } = celestialState;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-10 ${className}`}
      style={style}
    >
      {/* ------------------------------------------------------------- */}
      {/* SUN BODY (Active across Daytime & Sunrise/Sunset Transitions) */}
      {/* Opacity = 1.0 (Physically occluded by mountains)              */}
      {/* ------------------------------------------------------------- */}
      {sun.visible && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          style={{
            left: `${sun.x}%`,
            top: `${sun.y}%`,
            transform: `translate(-50%, -50%) scale(${sun.scale})`,
            transition: isContinuous ? 'none' : undefined,
          }}
        >
          <SunCharacter
            dayProgress={sun.dayProgress}
            size={size}
            animated={animated}
            interactive={interactive}
            onTap={() => onTap?.('sun')}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CRESCENT MOON BODY (Active during Night Cycle & Transitions)  */}
      {/* Opacity = 1.0 (Physically occluded by mountains)              */}
      {/* ------------------------------------------------------------- */}
      {moon.visible && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          style={{
            left: `${moon.x}%`,
            top: `${moon.y}%`,
            transform: `translate(-50%, -50%) scale(${moon.scale})`,
            transition: isContinuous ? 'none' : undefined,
          }}
        >
          <MoonCharacter
            size={size}
            animated={animated}
            interactive={interactive}
            onTap={() => onTap?.('moon')}
          />
        </div>
      )}
    </div>
  );
}

export default CelestialPhaseTransition;
