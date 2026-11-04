import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import type { MoodPhase, MoodTheme } from '../types/mood';
import { MOOD_THEMES } from '../constants/moods';
import {
  FACE_GEOMETRIES,
  FACE_SPRING_TRANSITION,
  interpolateFaceGeometry,
} from '../constants/faceGeometries';

export interface MoodFaceProps {
  /** Current mood phase */
  phase: MoodPhase;
  /** Optional theme override (defaults to MOOD_THEMES[phase]) */
  theme?: MoodTheme;
  /** Optional CSS class for the SVG element */
  className?: string;
  /** Interactive mode (allows clicking or hovering for playful micro-reactions) */
  interactive?: boolean;
  /** Optional callback fired when the character face is clicked/tapped */
  onTap?: () => void;
  /** Optional continuous slider progress (0..3) for fluid real-time morphing */
  continuousValue?: number;
}

export function MoodFace({
  phase,
  theme: customTheme,
  className = '',
  interactive = true,
  onTap,
  continuousValue,
}: MoodFaceProps) {
  const activeTheme = customTheme ?? MOOD_THEMES[phase] ?? MOOD_THEMES.not_bad;
  const inkColor = activeTheme.inkColor;

  // Geometry: continuous if scrubbing, discrete otherwise
  const geo =
    typeof continuousValue === 'number'
      ? interpolateFaceGeometry(continuousValue)
      : FACE_GEOMETRIES[phase] ?? FACE_GEOMETRIES.not_bad;

  // Mouth SVG Quadratic Bezier path
  const mouthPath = `M ${geo.mouth.x1.toFixed(1)} ${geo.mouth.y1.toFixed(1)} Q ${geo.mouth.cx.toFixed(1)} ${geo.mouth.cy.toFixed(1)} ${geo.mouth.x2.toFixed(1)} ${geo.mouth.y2.toFixed(1)}`;

  // Controls for bouncy squash & stretch spring pop
  const squashControls = useAnimationControls();
  const prevPhaseRef = useRef<MoodPhase | null>(null);

  // Trigger squash-and-stretch pop on phase change
  useEffect(() => {
    if (prevPhaseRef.current !== null && prevPhaseRef.current !== phase) {
      squashControls.start({
        scaleX: [1, 1.25, 0.94, 1.04, 1],
        scaleY: [1, 0.72, 1.16, 0.97, 1],
        y: [0, 8, -12, 3, 0],
        transition: {
          duration: 0.52,
          times: [0, 0.22, 0.55, 0.8, 1],
          ease: [0.34, 1.56, 0.64, 1],
        },
      });
    }
    prevPhaseRef.current = phase;
  }, [phase, squashControls]);

  // Idle blinking state and loop
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let closeTimer: ReturnType<typeof setTimeout>;
    let reopenTimer: ReturnType<typeof setTimeout>;

    const triggerBlink = () => {
      if (!active) return;
      setIsBlinking(true);

      closeTimer = setTimeout(() => {
        if (!active) return;
        setIsBlinking(false);

        // 25% chance of an organic double-blink
        const isDoubleBlink = Math.random() < 0.25;
        if (isDoubleBlink) {
          reopenTimer = setTimeout(() => {
            if (!active) return;
            setIsBlinking(true);
            setTimeout(() => {
              if (!active) return;
              setIsBlinking(false);
              scheduleBlink();
            }, 80);
          }, 110);
        } else {
          scheduleBlink();
        }
      }, 110);
    };

    const scheduleBlink = () => {
      if (!active) return;
      // Natural interval every 4 to 5.2 seconds
      const interval = 4000 + Math.random() * 1200;
      timer = setTimeout(triggerBlink, interval);
    };

    scheduleBlink();

    return () => {
      active = false;
      clearTimeout(timer);
      clearTimeout(closeTimer);
      clearTimeout(reopenTimer);
    };
  }, []);

  const handleTap = () => {
    if (!interactive) return;
    squashControls.start({
      scaleX: [1, 1.25, 0.94, 1.04, 1],
      scaleY: [1, 0.72, 1.16, 0.97, 1],
      y: [0, 8, -12, 3, 0],
      transition: {
        duration: 0.52,
        times: [0, 0.22, 0.55, 0.8, 1],
        ease: [0.34, 1.56, 0.64, 1],
      },
    });
    onTap?.();
  };

  return (
    <motion.svg
      viewBox="0 0 320 280"
      className={`w-full max-w-[280px] sm:max-w-[320px] h-auto select-none overflow-visible cursor-pointer ${className}`}
      style={{ touchAction: 'none' }}
      onClick={handleTap}
      whileHover={interactive ? { scale: 1.03 } : undefined}
      whileTap={interactive ? { scale: 0.96 } : undefined}
      aria-label={`Mood face: ${activeTheme.label}`}
      role="img"
    >
      <defs>
        {/* Soft radial glow for subtle cheek blush */}
        <radialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={inkColor} stopOpacity="0.22" />
          <stop offset="100%" stopColor={inkColor} stopOpacity="0.0" />
        </radialGradient>
      </defs>

      {/* Head rotation container with spring tilt */}
      <motion.g
        animate={{ rotate: geo.headTilt }}
        transition={FACE_SPRING_TRANSITION}
        style={{ transformOrigin: '160px 140px' }}
      >
        {/* Squash and stretch spring pop group */}
        <motion.g
          animate={squashControls}
          style={{ transformOrigin: '160px 140px' }}
        >
          {/* Subtle Cheek Blush (emerges on Not Bad and Good) */}
          <motion.ellipse
            cx={82}
            cy={148}
            rx={18}
            ry={10}
            fill="url(#blushGradient)"
            animate={{ opacity: geo.blushOpacity }}
            transition={FACE_SPRING_TRANSITION}
          />
          <motion.ellipse
            cx={238}
            cy={148}
            rx={18}
            ry={10}
            fill="url(#blushGradient)"
            animate={{ opacity: geo.blushOpacity }}
            transition={FACE_SPRING_TRANSITION}
          />

          {/* Left Eye */}
          <motion.g
            key="left-eye-pos"
            animate={{
              x: geo.leftEye.x,
              y: geo.leftEye.y,
            }}
            transition={FACE_SPRING_TRANSITION}
          >
            <motion.g
              animate={{
                scaleY: isBlinking ? 0.08 : 1,
                scaleX: isBlinking ? 1.08 : 1,
              }}
              transition={{
                duration: isBlinking ? 0.08 : 0.12,
                ease: 'easeInOut',
              }}
            >
              <motion.circle
                cx={0}
                cy={0}
                animate={{
                  r: geo.leftEye.r,
                  fill: inkColor,
                }}
                transition={{
                  r: FACE_SPRING_TRANSITION,
                  fill: { duration: 0.35 },
                }}
              />
            </motion.g>
          </motion.g>

          {/* Right Eye */}
          <motion.g
            key="right-eye-pos"
            animate={{
              x: geo.rightEye.x,
              y: geo.rightEye.y,
            }}
            transition={FACE_SPRING_TRANSITION}
          >
            <motion.g
              animate={{
                scaleY: isBlinking ? 0.08 : 1,
                scaleX: isBlinking ? 1.08 : 1,
              }}
              transition={{
                duration: isBlinking ? 0.08 : 0.12,
                ease: 'easeInOut',
              }}
            >
              <motion.circle
                cx={0}
                cy={0}
                animate={{
                  r: geo.rightEye.r,
                  fill: inkColor,
                }}
                transition={{
                  r: FACE_SPRING_TRANSITION,
                  fill: { duration: 0.35 },
                }}
              />
            </motion.g>
          </motion.g>

          {/* Expressive Bezier Mouth */}
          <motion.path
            d={mouthPath}
            animate={{
              d: mouthPath,
              strokeWidth: geo.mouth.strokeWidth,
              stroke: inkColor,
            }}
            transition={{
              d: FACE_SPRING_TRANSITION,
              strokeWidth: FACE_SPRING_TRANSITION,
              stroke: { duration: 0.35 },
            }}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tear particle for 'bad' phase */}
          <motion.path
            d="M 98 132 C 98 132 91 143 91 147 C 91 151 94 154 98 154 C 102 154 105 151 105 147 C 105 143 98 132 98 132 Z"
            fill={inkColor}
            animate={{
              opacity: geo.tearOpacity * 0.28,
              y: geo.tearOpacity > 0 ? [0, 4, 0] : 0,
            }}
            transition={{
              opacity: FACE_SPRING_TRANSITION,
              y: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
            }}
          />

          {/* Sparkles / Twinkle for 'good' phase */}
          <motion.g
            animate={{
              opacity: geo.sparkleOpacity,
              scale: geo.sparkleOpacity > 0 ? 1 : 0.4,
            }}
            transition={FACE_SPRING_TRANSITION}
          >
            {/* Top-right sparkle */}
            <motion.path
              d="M 264 54 Q 264 64 274 64 Q 264 64 264 74 Q 264 64 254 64 Q 264 64 264 54 Z"
              fill={inkColor}
              opacity={0.35}
              animate={{
                scale: [0.85, 1.15, 0.85],
                rotate: [0, 90, 180],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '264px 64px' }}
            />
            {/* Top-left small sparkle */}
            <motion.path
              d="M 56 68 Q 56 74 62 74 Q 56 74 56 80 Q 56 74 50 74 Q 56 74 56 68 Z"
              fill={inkColor}
              opacity={0.25}
              animate={{
                scale: [1.1, 0.85, 1.1],
                rotate: [0, -90, -180],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.6,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '56px 74px' }}
            />
          </motion.g>
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}

export default MoodFace;
