import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { motion, animate as fmAnimate } from 'framer-motion';
import {
  Sun,
  SunMedium,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { ProceduralLandscape } from './ProceduralLandscape';
import { SunPhaseTransition, type SunPhase } from './SunPhaseTransition';
import { getParabolicSunCoords } from './sunMath';

export interface SunSceneryViewerProps {
  /** Initial progress along the arc: 0.0 (Morning) to 1.0 (Afternoon). Default: 0 */
  initialProgress?: number;
  /** Initial discrete phase: 'morning' | 'afternoon'. Default: 'morning' */
  initialPhase?: SunPhase;
  /** Whether auto-play loop starts active immediately. Default: false */
  autoPlay?: boolean;
  /** Custom wrapper CSS classes */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

/**
 * SunSceneryViewer
 *
 * Interactive showcase viewer combining:
 * 1. ProceduralLandscape (viewBox="0 0 430 844" pure SVG vector scenery)
 * 2. SunPhaseTransition (Morning & Afternoon Sun along Parabolic Sky Orbital Arc)
 *
 * Features:
 * - 2-pill toggle: [Morning] vs [Afternoon] with smooth animated layout indicator
 * - Continuous scrub slider (0.0 to 1.0) allowing real-time dragging across the orbital arc
 * - Play/Pause loop button with buttery cosine breathing oscillation (Morning <-> Afternoon)
 * - Period tag badge at top left ("Morning • Bright Beginnings" / "Afternoon • Steady Progress")
 * - Clean, distraction-free floating frosted glass controls at the bottom of the canvas
 */
export function SunSceneryViewer({
  initialProgress,
  initialPhase = 'morning',
  autoPlay = false,
  className = '',
  style,
}: SunSceneryViewerProps) {
  const sliderId = useId();

  // Progress along the arc: 0.0 (Morning right horizon) to 1.0 (Afternoon zenith top-center)
  const [progress, setProgress] = useState<number>(() => {
    if (typeof initialProgress === 'number') {
      return Math.max(0, Math.min(1, initialProgress));
    }
    return initialPhase === 'afternoon' ? 1.0 : 0.0;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  // Active phase derived from progress midpoint
  const activePhase: SunPhase = progress < 0.5 ? 'morning' : 'afternoon';

  // Animation controller refs for auto-play loop and smooth pill transitions
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const angleRef = useRef<number>(
    // Initialize angle such that (1 - cos(angle)) / 2 === initial progress
    Math.acos(Math.max(-1, Math.min(1, 1 - 2 * (initialProgress ?? (initialPhase === 'afternoon' ? 1 : 0)))))
  );
  const directionRef = useRef<1 | -1>(1);
  const smoothAnimRef = useRef<ReturnType<typeof fmAnimate> | null>(null);

  // Stop any active programmatic transition
  const stopSmoothAnim = useCallback(() => {
    if (smoothAnimRef.current) {
      smoothAnimRef.current.stop();
      smoothAnimRef.current = null;
    }
  }, []);

  // Smoothly transition progress to target value (e.g. from 2-pill clicks)
  const transitionToProgress = useCallback(
    (targetProgress: number) => {
      stopSmoothAnim();
      setIsPlaying(false);

      const fromVal = progress;
      if (Math.abs(fromVal - targetProgress) < 0.002) {
        setProgress(targetProgress);
        return;
      }

      smoothAnimRef.current = fmAnimate(fromVal, targetProgress, {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setProgress(latest);
          // Sync angle ref for seamless play loop resumption
          angleRef.current = Math.acos(Math.max(-1, Math.min(1, 1 - 2 * latest)));
        },
        onComplete: () => {
          smoothAnimRef.current = null;
        },
      });
    },
    [progress, stopSmoothAnim]
  );

  // Play/pause smooth cosine loop animation
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    // Full loop period: 5.5 seconds (2.75s sunrise up to noon, 2.75s setting back to morning)
    const LOOP_PERIOD_MS = 5500;
    const ANGULAR_SPEED = (2 * Math.PI) / LOOP_PERIOD_MS;

    const animateLoop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Advance oscillation angle
      angleRef.current = (angleRef.current + delta * ANGULAR_SPEED * directionRef.current) % (2 * Math.PI);

      // (1 - cos(angle)) / 2 oscillates smoothly between 0.0 and 1.0 with deceleration at bounds
      const computedProgress = (1 - Math.cos(angleRef.current)) / 2;
      const clamped = Math.max(0, Math.min(1, computedProgress));

      setProgress(clamped);

      animationFrameRef.current = requestAnimationFrame(animateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(animateLoop);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying]);

  // Scrub slider change handler
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stopSmoothAnim();
    setIsPlaying(false);
    const val = parseFloat(e.target.value);
    setProgress(val);
    // Align angle ref so playing will continue smoothly
    angleRef.current = Math.acos(Math.max(-1, Math.min(1, 1 - 2 * val)));
  };

  // Toggle play/pause
  const handleTogglePlay = () => {
    stopSmoothAnim();
    setIsPlaying((prev) => !prev);
  };

  // Reset to Morning
  const handleReset = () => {
    transitionToProgress(0.0);
  };

  // Compute current sun coordinates for diagnostics/badge
  const sunCoords = getParabolicSunCoords(progress);

  return (
    <div
      className={`relative w-full min-h-[100dvh] flex items-center justify-center p-0 sm:p-4 bg-stone-950 overflow-hidden ${className}`}
      style={style}
    >
      {/* Centered Phone Canvas Frame (Matches 430x844 aspect ratio) */}
      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:max-h-[92vh] sm:max-w-[430px] sm:rounded-[44px] sm:border-[8px] sm:border-black/30 sm:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6),0_0_50px_rgba(0,0,0,0.3)] sm:ring-1 sm:ring-white/15 overflow-hidden flex flex-col select-none">
        {/* Desktop Phone Dynamic Island / Speaker cutout */}
        <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black/40 rounded-full z-40 pointer-events-none items-center justify-end pr-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-black/60 ring-1 ring-white/10" />
        </div>

        {/* Desktop Phone Home Bar */}
        <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/25 rounded-full z-40 pointer-events-none" />

        {/* LAYER 1: Procedural Vector Landscape (Pure SVG viewBox="0 0 430 844") */}
        <div className="absolute inset-0 z-0">
          <ProceduralLandscape
            progress={progress}
            phase={activePhase}
            animateClouds={true}
            className="w-full h-full object-cover"
          />
        </div>

        {/* LAYER 2: SunPhaseTransition (Morning & Afternoon Sun along Parabolic Orbital Arc) */}
        <SunPhaseTransition
          progress={progress}
          phase={activePhase}
          size={110}
          animated={true}
          interactive={true}
          className="z-10"
        />

        {/* LAYER 3: TOP BAR - Period Tag Badge */}
        <header className="absolute top-4 sm:top-6 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Period Tag Badge */}
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg border text-white"
            style={{
              backgroundColor:
                activePhase === 'morning'
                  ? 'rgba(251, 164, 134, 0.35)'
                  : 'rgba(77, 168, 245, 0.35)',
              borderColor:
                activePhase === 'morning'
                  ? 'rgba(255, 230, 190, 0.45)'
                  : 'rgba(191, 231, 255, 0.45)',
            }}
          >
            {activePhase === 'morning' ? (
              <Sun className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40 animate-pulse" />
            ) : (
              <SunMedium className="w-3.5 h-3.5 text-amber-200 fill-amber-200/40" />
            )}
            <span className="text-xs font-bold tracking-tight">
              {activePhase === 'morning'
                ? 'Morning • Bright Beginnings'
                : 'Afternoon • Steady Progress'}
            </span>
          </motion.div>

          {/* Sun Orbital Coordinates Pill */}
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-[10px] font-mono text-stone-200 shadow-sm">
            <span className="text-amber-300">({Math.round(sunCoords.x)}%, {Math.round(sunCoords.y)}%)</span>
            <span className="text-stone-400">t={progress.toFixed(2)}</span>
          </div>
        </header>

        {/* LAYER 4: FLOATING CONTROLS DOCK AT BOTTOM */}
        <section
          aria-label="Scenery & Sun Orbital Controls"
          className="absolute bottom-4 sm:bottom-6 inset-x-3 sm:inset-x-4 z-30 pointer-events-auto"
        >
          <div className="relative rounded-3xl bg-stone-900/85 backdrop-blur-xl border border-white/15 text-stone-100 p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/10 flex flex-col gap-3">
            {/* Row 1: 2-Pill Toggle [Morning] vs [Afternoon] */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/40 border border-white/10 relative">
              {/* Morning Pill Button */}
              <button
                type="button"
                onClick={() => transitionToProgress(0.0)}
                className={`relative flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-colors z-10 cursor-pointer ${
                  activePhase === 'morning'
                    ? 'text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {activePhase === 'morning' && (
                  <motion.div
                    layoutId="sunSceneryPillActive"
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(251, 164, 134, 0.45) 0%, rgba(255, 195, 153, 0.25) 100%)',
                      border: '1px solid rgba(255, 230, 190, 0.5)',
                      boxShadow: '0 0 16px rgba(251, 164, 134, 0.35)',
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Sun
                  className={`w-4 h-4 transition-transform ${
                    activePhase === 'morning'
                      ? 'text-amber-300 scale-110'
                      : 'text-stone-400'
                  }`}
                />
                <span>Morning</span>
                <span className="text-[10px] font-mono opacity-60">(Dawn)</span>
              </button>

              {/* Afternoon Pill Button */}
              <button
                type="button"
                onClick={() => transitionToProgress(1.0)}
                className={`relative flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-colors z-10 cursor-pointer ${
                  activePhase === 'afternoon'
                    ? 'text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {activePhase === 'afternoon' && (
                  <motion.div
                    layoutId="sunSceneryPillActive"
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(77, 168, 245, 0.45) 0%, rgba(118, 197, 255, 0.25) 100%)',
                      border: '1px solid rgba(191, 231, 255, 0.5)',
                      boxShadow: '0 0 16px rgba(77, 168, 245, 0.35)',
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <SunMedium
                  className={`w-4 h-4 transition-transform ${
                    activePhase === 'afternoon'
                      ? 'text-sky-300 scale-110'
                      : 'text-stone-400'
                  }`}
                />
                <span>Afternoon</span>
                <span className="text-[10px] font-mono opacity-60">(Zenith)</span>
              </button>
            </div>

            {/* Row 2: Continuous Scrub Slider (0.0 to 1.0) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-300 px-0.5">
                <label
                  htmlFor={sliderId}
                  className="flex items-center gap-1.5 cursor-pointer text-stone-300 hover:text-white"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Continuous Arc Scrubber</span>
                </label>
                <div className="flex items-center gap-1 font-mono text-[10px] text-stone-400">
                  <span className="text-white font-bold">{progress.toFixed(2)}</span>
                  <span>•</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
              </div>

              {/* Slider Track with Dynamic Morning-to-Afternoon Gradient */}
              <div className="relative flex items-center h-7">
                {/* Visual Gradient Track */}
                <div
                  className="absolute inset-x-0 h-2.5 rounded-full overflow-hidden border border-white/10"
                  style={{
                    background:
                      'linear-gradient(90deg, #FBA486 0%, #FFC399 35%, #76C5FF 70%, #4DA8F5 100%)',
                  }}
                >
                  {/* Subtle active fill overlay */}
                  <div
                    className="h-full bg-white/20 transition-all"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>

                {/* Range Input element */}
                <input
                  id={sliderId}
                  type="range"
                  min="0"
                  max="1"
                  step="0.005"
                  value={progress}
                  onChange={handleSliderChange}
                  onMouseDown={() => setIsScrubbing(true)}
                  onMouseUp={() => setIsScrubbing(false)}
                  onTouchStart={() => setIsScrubbing(true)}
                  onTouchEnd={() => setIsScrubbing(false)}
                  aria-label="Orbital sun progress scrubber"
                  className="w-full h-7 opacity-0 cursor-ew-resize relative z-10"
                />

                {/* Visual Glowing Custom Thumb Indicator */}
                <div
                  className="absolute -translate-x-1/2 pointer-events-none transition-transform duration-75 flex items-center justify-center"
                  style={{
                    left: `${progress * 100}%`,
                    transform: `translate(-50%, 0) scale(${isScrubbing ? 1.25 : 1})`,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.7)] flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor:
                        progress < 0.5 ? '#FF9A76' : '#3B9EEA',
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              {/* Slider Edge Labels */}
              <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 px-0.5">
                <span>0.0 Dawn (80%, 58%)</span>
                <span>1.0 High Noon (50%, 19%)</span>
              </div>
            </div>

            {/* Row 3: Action Buttons (Play/Pause Loop & Reset) */}
            <div className="flex items-center gap-2 pt-0.5">
              {/* Play / Pause Loop Button */}
              <motion.button
                type="button"
                onClick={handleTogglePlay}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                  isPlaying
                    ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                    : 'bg-white/10 hover:bg-white/15 text-stone-100 border-white/10'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Orbital Loop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Orbital Loop</span>
                  </>
                )}
              </motion.button>

              {/* Reset to Dawn Button */}
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Reset to Morning (Dawn)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subtle Interactive Hint */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 pt-0.5 text-center">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Tap the Sun character on the landscape for joyful bounce &amp; wink</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SunSceneryViewer;
