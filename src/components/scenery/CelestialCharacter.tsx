import { useEffect, useRef, useState, useId } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import type { TimeOfDay } from '../../types/theme';
import { TIME_THEMES } from '../../constants/timeThemes';

export interface CelestialCharacterProps {
  /** Time of day period determining character variant ('morning' | 'afternoon' | 'evening' | 'night') */
  period: TimeOfDay;
  /** Explicit override for celestial type (defaults to period's celestial) */
  celestialType?: 'sun' | 'moon';
  /** Size in pixels (width and height), defaults to 96 */
  size?: number | string;
  /** Optional ink color override for eyes and mouth */
  inkColor?: string;
  /** Whether character reacts to taps and hover with bouncy squash/stretch physics */
  interactive?: boolean;
  /** Callback fired when character is clicked/tapped */
  onTap?: () => void;
  /** Optional custom CSS class name */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * CelestialCharacter
 *
 * Expressive living Sun & Moon characters created using the Phase 1 Mood UI design language:
 * - Two circular dot eyes with organic blinking physics
 * - Smooth quadratic SVG Bezier mouth (`M x1 y1 Q cx cy x2 y2`)
 * - Bouncy squash-and-stretch spring micro-interactions on click/tap
 * - 4 distinct facial expressions & animation modes:
 *   1. Morning Sun: Waking up, happy energetic smile, soft ray pulses, organic blinks
 *   2. Afternoon Sun: Focused, cheerful beaming smile, steady glowing aura, sparkling catchlights
 *   3. Evening Sun: Relaxed, calm gentle smile, soft dusk tone and twilight haze
 *   4. Night Moon: Cozy crescent moon, sleepy closed/crescent eyes, sweet peaceful smile, gentle float
 */
export function CelestialCharacter({
  period,
  celestialType,
  size = 96,
  inkColor: customInk,
  interactive = true,
  onTap,
  className = '',
  style,
}: CelestialCharacterProps) {
  const theme = TIME_THEMES[period] ?? TIME_THEMES.morning;
  const isNight = period === 'night' || celestialType === 'moon';
  const resolvedInk = customInk ?? (isNight ? '#FAF8FF' : theme.colors.ink);

  const uid = useId().replace(/:/g, '');
  const squashControls = useAnimationControls();
  const [isBlinking, setIsBlinking] = useState(false);
  const [moonAwake, setMoonAwake] = useState(false);
  const prevPeriodRef = useRef<TimeOfDay | null>(null);

  // Trigger bouncy squash pop on period change
  useEffect(() => {
    if (prevPeriodRef.current !== null && prevPeriodRef.current !== period) {
      squashControls.start({
        scaleX: [1, 1.22, 0.94, 1.05, 1],
        scaleY: [1, 0.78, 1.15, 0.97, 1],
        transition: {
          duration: 0.55,
          times: [0, 0.22, 0.55, 0.8, 1],
          ease: [0.34, 1.56, 0.64, 1],
        },
      });
    }
    prevPeriodRef.current = period;
  }, [period, squashControls]);

  // Organic idle blinking loop
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let closeTimer: ReturnType<typeof setTimeout>;
    let doubleTimer: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      if (!active) return;
      // Interval between 3.6s and 5.4s for natural organic feel
      const delay = 3600 + Math.random() * 1800;
      timer = setTimeout(() => {
        if (!active) return;
        setIsBlinking(true);

        closeTimer = setTimeout(() => {
          if (!active) return;
          setIsBlinking(false);

          // 25% chance of charming double-blink
          if (Math.random() < 0.25) {
            doubleTimer = setTimeout(() => {
              if (!active) return;
              setIsBlinking(true);
              setTimeout(() => {
                if (!active) return;
                setIsBlinking(false);
                scheduleBlink();
              }, 80);
            }, 100);
          } else {
            scheduleBlink();
          }
        }, 110);
      }, delay);
    };

    scheduleBlink();

    return () => {
      active = false;
      clearTimeout(timer);
      clearTimeout(closeTimer);
      clearTimeout(doubleTimer);
    };
  }, []);

  const handleTap = () => {
    if (!interactive) return;

    // Wake moon temporarily on tap if night
    if (isNight) {
      setMoonAwake(true);
      setTimeout(() => setMoonAwake(false), 2400);
    }

    squashControls.start({
      scaleX: [1, 1.25, 0.92, 1.06, 1],
      scaleY: [1, 0.75, 1.18, 0.96, 1],
      transition: {
        duration: 0.52,
        times: [0, 0.22, 0.55, 0.8, 1],
        ease: [0.34, 1.56, 0.64, 1],
      },
    });

    onTap?.();
  };

  // 8 soft rays for Morning Sun
  const morningRays = [0, 45, 90, 135, 180, 225, 270, 315];

  // 12 starburst rays for Afternoon Sun
  const afternoonRays = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      onClick={handleTap}
      whileHover={interactive ? { scale: 1.06 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      role="img"
      aria-label={`${period} celestial character`}
    >
      <motion.svg
        viewBox="0 0 120 120"
        className="w-full h-full overflow-visible"
        animate={squashControls}
        style={{ transformOrigin: 'center center' }}
      >
        <defs>
          {/* Morning Sun Gradient */}
          <radialGradient id={`morningSunGrad-${uid}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF2A8" />
            <stop offset="55%" stopColor="#FFC83D" />
            <stop offset="100%" stopColor="#FFA07A" />
          </radialGradient>

          {/* Afternoon Sun Gradient */}
          <radialGradient id={`afternoonSunGrad-${uid}`} cx="38%" cy="35%" r="68%">
            <stop offset="0%" stopColor="#FFFDF0" />
            <stop offset="35%" stopColor="#FFE066" />
            <stop offset="85%" stopColor="#FFB800" />
            <stop offset="100%" stopColor="#FF8C00" />
          </radialGradient>

          {/* Evening Sun Gradient */}
          <radialGradient id={`eveningSunGrad-${uid}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFE2D1" />
            <stop offset="45%" stopColor="#FFA07A" />
            <stop offset="85%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#C9B8FF" />
          </radialGradient>

          {/* Night Moon Gradient */}
          <radialGradient id={`nightMoonGrad-${uid}`} cx="32%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F5E8FF" />
            <stop offset="80%" stopColor="#D8B4FE" />
            <stop offset="100%" stopColor="#A78BFA" />
          </radialGradient>

          {/* Soft Dusk / Moon Glow Aura Filter */}
          <filter id={`celestialGlow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ------------------------------------------------------------- */}
        {/* VARIANT 1: MORNING SUN                                        */}
        {/* Waking up, happy energetic smile, soft ray pulses, blinks     */}
        {/* ------------------------------------------------------------- */}
        {period === 'morning' && (
          <motion.g
            key="morning-sun"
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '60px 60px' }}
          >
            {/* Soft Ambient Warm Glow */}
            <circle
              cx="60"
              cy="60"
              r="44"
              fill="#FFA07A"
              opacity="0.22"
              filter={`url(#celestialGlow-${uid})`}
            />

            {/* 8 Soft Pulsing Radiating Rays */}
            <motion.g
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.82, 1, 0.82],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '60px 60px' }}
            >
              {morningRays.map((angle) => (
                <rect
                  key={`ray-${angle}`}
                  x="56"
                  y="12"
                  width="8"
                  height="12"
                  rx="4"
                  fill="#FFC83D"
                  opacity="0.9"
                  transform={`rotate(${angle} 60 60)`}
                />
              ))}
            </motion.g>

            {/* Main Sun Body */}
            <circle
              cx="60"
              cy="60"
              r="34"
              fill={`url(#morningSunGrad-${uid})`}
              stroke="#FFE899"
              strokeWidth="1.5"
            />

            {/* Morning Cheerful Rosy Blush */}
            <ellipse cx="43" cy="67" rx="5.5" ry="3.2" fill="#FF6B6B" opacity="0.4" />
            <ellipse cx="77" cy="67" rx="5.5" ry="3.2" fill="#FF6B6B" opacity="0.4" />

            {/* Eyes with Organic Blinks */}
            <motion.g
              animate={{
                scaleY: isBlinking ? 0.08 : 1,
                scaleX: isBlinking ? 1.08 : 1,
              }}
              transition={{ duration: 0.08 }}
              style={{ transformOrigin: '60px 56px' }}
            >
              {/* Left Eye */}
              <circle cx="49" cy="56" r="4.2" fill={resolvedInk} />
              <circle cx="50.6" cy="54.4" r="1.3" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="71" cy="56" r="4.2" fill={resolvedInk} />
              <circle cx="72.6" cy="54.4" r="1.3" fill="#FFFFFF" />
            </motion.g>

            {/* Happy Energetic Smile (M x1 y1 Q cx cy x2 y2) */}
            <path
              d="M 50 67 Q 60 77 70 67"
              stroke={resolvedInk}
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </motion.g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VARIANT 2: AFTERNOON SUN                                      */}
        {/* Focused, cheerful beaming smile, steady glowing aura          */}
        {/* ------------------------------------------------------------- */}
        {period === 'afternoon' && (
          <motion.g
            key="afternoon-sun"
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 3.0,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '60px 60px' }}
          >
            {/* Steady Glowing Outer Aura Ring */}
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="#FFD200"
              animate={{
                opacity: [0.18, 0.28, 0.18],
                scale: [0.98, 1.03, 0.98],
              }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '60px 60px' }}
              filter={`url(#celestialGlow-${uid})`}
            />

            {/* Inner Concentric Aura Ring */}
            <circle cx="60" cy="60" r="44" fill="#FFA500" opacity="0.25" />

            {/* 12 Sharp Cheerful Diamond Rays */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{
                duration: 48,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: '60px 60px' }}
            >
              {afternoonRays.map((angle) => (
                <path
                  key={`afternoon-ray-${angle}`}
                  d="M 60 10 L 63.5 19 L 60 22 L 56.5 19 Z"
                  fill="#FFB800"
                  opacity="0.92"
                  transform={`rotate(${angle} 60 60)`}
                />
              ))}
            </motion.g>

            {/* Sun Disc */}
            <circle
              cx="60"
              cy="60"
              r="34"
              fill={`url(#afternoonSunGrad-${uid})`}
              stroke="#FFF8D6"
              strokeWidth="1.5"
            />

            {/* Peachy Cheek Blush */}
            <ellipse cx="43" cy="67" rx="5.5" ry="3.2" fill="#FF8C00" opacity="0.38" />
            <ellipse cx="77" cy="67" rx="5.5" ry="3.2" fill="#FF8C00" opacity="0.38" />

            {/* Focused, Cheerful Sparkling Eyes */}
            <motion.g
              animate={{
                scaleY: isBlinking ? 0.08 : 1,
                scaleX: isBlinking ? 1.08 : 1,
              }}
              transition={{ duration: 0.08 }}
              style={{ transformOrigin: '60px 55px' }}
            >
              {/* Left Eye with dual catchlights */}
              <circle cx="48" cy="55" r="4.6" fill={resolvedInk} />
              <circle cx="49.8" cy="53.2" r="1.5" fill="#FFFFFF" />
              <circle cx="46.8" cy="56.5" r="0.8" fill="#FFFFFF" />

              {/* Right Eye with dual catchlights */}
              <circle cx="72" cy="55" r="4.6" fill={resolvedInk} />
              <circle cx="73.8" cy="53.2" r="1.5" fill="#FFFFFF" />
              <circle cx="70.8" cy="56.5" r="0.8" fill="#FFFFFF" />
            </motion.g>

            {/* Wide Cheerful Beaming Smile */}
            <path
              d="M 48 66 Q 60 80 72 66"
              stroke={resolvedInk}
              strokeWidth="4.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Playful Floating Micro-Sparkle */}
            <motion.path
              d="M 88 32 Q 91 35 94 35 Q 91 35 91 38 Q 91 35 88 35 Q 91 35 91 32 Z"
              fill="#FFF275"
              animate={{
                scale: [0.8, 1.25, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VARIANT 3: EVENING SUN                                        */}
        {/* Relaxed, calm gentle smile, soft dusk tone                    */}
        {/* ------------------------------------------------------------- */}
        {period === 'evening' && !isNight && (
          <motion.g
            key="evening-sun"
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '60px 60px' }}
          >
            {/* Soft Twilight Dusk Bloom Ring */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="#F4A7C6"
              opacity="0.25"
              filter={`url(#celestialGlow-${uid})`}
            />

            {/* Gentle Secondary Dusk Halo */}
            <circle cx="60" cy="60" r="41" fill="#C9B8FF" opacity="0.32" />

            {/* Soft Dusk Pill Rays */}
            <motion.g
              animate={{
                opacity: [0.7, 0.95, 0.7],
                scale: [0.98, 1.03, 0.98],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '60px 60px' }}
            >
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <rect
                  key={`evening-ray-${angle}`}
                  x="57"
                  y="15"
                  width="6"
                  height="9"
                  rx="3"
                  fill="#F4A7C6"
                  opacity="0.8"
                  transform={`rotate(${angle} 60 60)`}
                />
              ))}
            </motion.g>

            {/* Sun Disc */}
            <circle
              cx="60"
              cy="60"
              r="34"
              fill={`url(#eveningSunGrad-${uid})`}
              stroke="#FFE4EC"
              strokeWidth="1.5"
            />

            {/* Soft Twilight Violet/Rose Blush */}
            <ellipse cx="44" cy="67" rx="5.5" ry="3" fill="#C9B8FF" opacity="0.55" />
            <ellipse cx="76" cy="67" rx="5.5" ry="3" fill="#C9B8FF" opacity="0.55" />

            {/* Relaxed, Calm Peaceful Eyes */}
            <motion.g
              animate={{
                scaleY: isBlinking ? 0.08 : 1,
                scaleX: isBlinking ? 1.08 : 1,
              }}
              transition={{ duration: 0.1 }}
              style={{ transformOrigin: '60px 56px' }}
            >
              {/* Left Eye */}
              <circle cx="49" cy="56" r="4.0" fill={resolvedInk} />
              <circle cx="50.4" cy="54.6" r="1.2" fill="#FFFFFF" />

              {/* Right Eye */}
              <circle cx="71" cy="56" r="4.0" fill={resolvedInk} />
              <circle cx="72.4" cy="54.6" r="1.2" fill="#FFFFFF" />
            </motion.g>

            {/* Relaxed, Calm Gentle Smile */}
            <path
              d="M 52 67 Q 60 74 68 67"
              stroke={resolvedInk}
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </motion.g>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VARIANT 4: NIGHT MOON                                         */}
        {/* Cozy crescent moon, sleepy crescent eyes, peaceful smile, float*/}
        {/* ------------------------------------------------------------- */}
        {isNight && (
          <motion.g
            key="night-moon"
            animate={{
              y: [0, -6, 0],
              rotate: [-2.5, 2.5, -2.5],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '48px 60px' }}
          >
            {/* Soft Luminescent Lunar Bloom */}
            <path
              d="M 58.57 18.08 A 42 42 0 1 0 89.57 85.24 A 38 38 0 0 1 58.57 18.08 Z"
              fill="#A78BFA"
              opacity="0.32"
              filter={`url(#celestialGlow-${uid})`}
            />

            {/* Cozy Crescent Moon Body */}
            <path
              d="M 58.57 18.08 A 42 42 0 1 0 89.57 85.24 A 38 38 0 0 1 58.57 18.08 Z"
              fill={`url(#nightMoonGrad-${uid})`}
              stroke="#F3E8FF"
              strokeWidth="1.6"
            />

            {/* Soft Starlight Lavender Cheeks */}
            <ellipse cx="26" cy="62" rx="4.5" ry="2.5" fill="#C084FC" opacity="0.45" />
            <ellipse cx="44" cy="62" rx="4.5" ry="2.5" fill="#C084FC" opacity="0.45" />

            {/* Eyes: Sleepy Closed Crescents by default (or open dots if awakened on tap) */}
            {!moonAwake ? (
              <g>
                {/* Left Sleepy Closed Crescent Eye */}
                <path
                  d="M 24 55 Q 28 60 32 55"
                  stroke={resolvedInk}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Right Sleepy Closed Crescent Eye */}
                <path
                  d="M 38 55 Q 42 60 46 55"
                  stroke={resolvedInk}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : (
              <motion.g
                animate={{
                  scaleY: isBlinking ? 0.08 : 1,
                  scaleX: isBlinking ? 1.08 : 1,
                }}
                transition={{ duration: 0.08 }}
                style={{ transformOrigin: '35px 55px' }}
              >
                {/* Left Awake Dot Eye */}
                <circle cx="28" cy="55" r="3.8" fill={resolvedInk} />
                <circle cx="29.2" cy="53.8" r="1.1" fill="#FFFFFF" />

                {/* Right Awake Dot Eye */}
                <circle cx="42" cy="55" r="3.8" fill={resolvedInk} />
                <circle cx="43.2" cy="53.8" r="1.1" fill="#FFFFFF" />
              </motion.g>
            )}

            {/* Sweet Peaceful Smile (M x1 y1 Q cx cy x2 y2) */}
            <path
              d="M 30 65 Q 35 71 40 65"
              stroke={resolvedInk}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </motion.g>
        )}
      </motion.svg>
    </motion.div>
  );
}

export default CelestialCharacter;
