import { useState, useEffect, useId, useRef } from 'react';
import { motion, useAnimationControls, animate as fmAnimate } from 'framer-motion';
import { getParabolicSunCoords, interpolateHex } from './sunMath';

export type SunPhase = 'morning' | 'afternoon';

export interface SunPhaseTransitionProps {
  /**
   * Continuous progress from 0 (Morning) to 1 (Afternoon).
   * When provided, takes precedence over `phase` for smooth scrubbing.
   */
  progress?: number;
  /**
   * Discrete phase: 'morning' | 'afternoon' (default: 'morning').
   * Used when `progress` is undefined to drive a spring transition along the orbital arc.
   */
  phase?: SunPhase;
  /**
   * Size in pixels for the sun character disc and rays container (default: 104px).
   */
  size?: number;
  /**
   * Whether rays and auras animate with ambient pulse and rotation loops (default: true).
   */
  animated?: boolean;
  /**
   * Whether the sun responds to hover and tap with playful spring squash-and-stretch (default: true).
   */
  interactive?: boolean;
  /**
   * Optional click/tap callback.
   */
  onTap?: () => void;
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
 * Minimalist SunCharacter matching user reference:
 * - Morning Sun: Soft cream-yellow (#FFF2A8), amber outline (#F4A871, 1.8px), warm peach aura,
 *   12 thin straight pill rays (#FFE58F), two solid dark dot eyes (● ●), clean cute curved smile (⌣).
 * - Afternoon Sun: Vibrant golden-yellow (#FFC83D), darker gold outline (#E59E20, 1.8px),
 *   soft cyan/sky-blue aura, 12 thin straight golden rays (#FFC83D), solid dark dot eyes (● ●), cheerful curved smile (⌣).
 */
export function SunCharacter({
  t,
  size = 104,
  animated = true,
  interactive = true,
  onTap,
  className = '',
}: {
  t: number;
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

  // -------------------------------------------------------------
  // CONTINUOUS MINIMALIST COLOR & GEOMETRY INTERPOLATION
  // -------------------------------------------------------------
  // Body fill: Morning cream-yellow #FFF2A8 -> Afternoon vibrant gold #FFC83D
  const bodyColor = interpolateHex('#FFF2A8', '#FFC83D', t);

  // Outline stroke (1.8px): Morning amber #F4A871 -> Afternoon dark gold #E59E20
  const strokeColor = interpolateHex('#F4A871', '#E59E20', t);

  // Aura glow: Morning warm peach #FFA07A -> Afternoon cyan/sky-blue #76C5FF
  const auraColor = interpolateHex('#FFA07A', '#76C5FF', t);
  const auraOpacity = 0.35 - 0.03 * t;

  // 12 Thin straight pill rays color: Morning #FFE58F -> Afternoon #FFC83D
  const rayColor = interpolateHex('#FFE58F', '#FFC83D', t);

  // Facial ink color: Morning dark umber #3D2214 -> Afternoon dark brown #2B180A
  const inkColor = interpolateHex('#3D2214', '#2B180A', t);

  // Mouth Bezier Path (clean cute curved smile):
  // Morning: M 42 56 Q 50 64 58 56
  // Afternoon: M 40 55 Q 50 66 60 55
  const mouthX1 = 42 - 2 * t;
  const mouthY1 = 56 - 1 * t;
  const mouthCY = 64 + 2 * t;
  const mouthX2 = 58 + 2 * t;
  const mouthY2 = 56 - 1 * t;
  const mouthStroke = 2.4 + 0.2 * t;
  const mouthPath = `M ${mouthX1.toFixed(1)} ${mouthY1.toFixed(1)} Q 50.0 ${mouthCY.toFixed(1)} ${mouthX2.toFixed(1)} ${mouthY2.toFixed(1)}`;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
      }}
      onClick={handleTap}
      whileHover={interactive ? { scale: 1.08 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      role="img"
      aria-label={`Minimalist Sun character at altitude ${(t * 100).toFixed(0)}%`}
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
        {/* 4. TWO SIMPLE SOLID DARK DOT EYES (● ●)                       */}
        {/* ------------------------------------------------------------- */}
        <circle cx="39" cy="45.5" r="3.5" fill={inkColor} />
        <circle cx="61" cy="45.5" r="3.5" fill={inkColor} />

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
 * SunPhaseTransition
 *
 * Minimalist Morning & Afternoon Sun characters travelling along a natural
 * Parabolic Sky Orbital Arc across the 430x844 canvas:
 *
 * - Morning Sun:
 *   Placed on right horizon (x: ~76%, y: 56%, emerging from y: 68%)
 *   Soft cream-yellow body (#FFF2A8), amber outline (#F4A871, 1.8px),
 *   soft warm peach radial glow, exactly 12 thin straight pill rays (#FFE58F),
 *   two solid dark dot eyes (● ●), clean cute curved smile (⌣).
 *
 * - Afternoon Sun:
 *   Placed at high noon top-center (x: 50%, y: 19%)
 *   Vibrant golden-yellow body (#FFC83D), darker gold outline (#E59E20, 1.8px),
 *   soft cyan/sky-blue radial glow, exactly 12 thin straight golden rays (#FFC83D),
 *   two solid dark dot eyes (● ●), cheerful curved smile (⌣).
 *
 * - Parabolic Sky Orbital Arc:
 *   x(t): sweeps from ~76% to 50%
 *   y(t): climbs from 56% to 19%
 *   Supports both continuous scrubbing (`progress`: 0 to 1) and discrete spring transitions when toggled.
 *   Physical mountain occlusion: keeps opacity = 1.0.
 */
export function SunPhaseTransition({
  progress,
  phase = 'morning',
  size = 104,
  animated = true,
  interactive = true,
  onTap,
  className = '',
  style,
}: SunPhaseTransitionProps) {
  const isContinuous = typeof progress === 'number';

  // State for discrete phase animation
  const [internalT, setInternalT] = useState<number>(() => (phase === 'afternoon' ? 1 : 0));
  const animProgressRef = useRef(phase === 'afternoon' ? 1 : 0);

  // Discrete spring / cinematic transition when toggling phase
  useEffect(() => {
    if (isContinuous) return;

    const targetT = phase === 'afternoon' ? 1 : 0;
    const fromT = animProgressRef.current;

    if (Math.abs(fromT - targetT) < 0.001) return;

    const controls = fmAnimate(fromT, targetT, {
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        animProgressRef.current = latest;
        setInternalT(latest);
      },
    });

    return () => controls.stop();
  }, [phase, isContinuous]);

  const effectiveT = isContinuous ? Math.max(0, Math.min(1, progress)) : internalT;
  const coords = getParabolicSunCoords(effectiveT);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-10 ${className}`}
      style={style}
    >
      {/* Sun Character positioned along the Parabolic Orbital Arc with opacity = 1.0 */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        style={{
          left: `${coords.x}%`,
          top: `${coords.y}%`,
          transition: isContinuous ? 'none' : undefined,
        }}
      >
        <SunCharacter
          t={effectiveT}
          size={size}
          animated={animated}
          interactive={interactive}
          onTap={onTap}
        />
      </div>
    </div>
  );
}

export default SunPhaseTransition;
