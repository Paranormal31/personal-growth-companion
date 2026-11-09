import { useState, useEffect, useRef, useCallback, useId, useMemo } from 'react';
import { motion, animate as fmAnimate } from 'framer-motion';
import {
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { ProceduralLandscape } from './ProceduralLandscape';
import {
  CelestialPhaseTransition,
  type CelestialPhase,
} from './CelestialPhaseTransition';
import { getCelestial24hState } from './sunMath';

export interface CelestialSceneryViewerProps {
  /** Initial progress along 24h cycle [0..4] (0=morning, 1=afternoon, 2=evening, 3=night). Default: 0 */
  initialProgress?: number;
  /** Initial discrete phase: 'morning' | 'afternoon' | 'evening' | 'night'. Default: 'morning' */
  initialPhase?: CelestialPhase;
  /** Whether 24h auto-play loop starts active immediately. Default: false */
  autoPlay?: boolean;
  /** Duration in seconds for full 24h cycle in auto-play. Default: 16s */
  cycleDuration?: number;
  /** Whether to show the top-left period badge and coordinates on the phone screen. Default: false */
  showPhoneBadge?: boolean;
  /** Direct children rendered inside the phone frame on top of the living scenery */
  children?: React.ReactNode;
  /** Render prop alternative for injecting content into the phone frame with live controls state */
  renderContent?: (props: {
    progress: number;
    phase: CelestialPhase;
    isPlaying: boolean;
  }) => React.ReactNode;
  /** Custom wrapper CSS classes */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

interface PhaseInfo {
  id: CelestialPhase;
  label: string;
  marker: string;
  tag: string;
  targetProgress: number;
  icon: typeof Sun;
  color: string;
  glow: string;
  gradient: string;
  border: string;
}

const PHASES: PhaseInfo[] = [
  {
    id: 'morning',
    label: 'Morning',
    marker: 'Dawn',
    tag: 'Morning • Bright Beginnings',
    targetProgress: 0.0,
    icon: Sun,
    color: '#FBA486',
    glow: 'rgba(251, 164, 134, 0.45)',
    gradient:
      'linear-gradient(135deg, rgba(251, 164, 134, 0.45) 0%, rgba(255, 195, 153, 0.25) 100%)',
    border: 'rgba(255, 230, 190, 0.55)',
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    marker: 'Noon',
    tag: 'Afternoon • Steady Progress',
    targetProgress: 1.0,
    icon: SunMedium,
    color: '#4DA8F5',
    glow: 'rgba(77, 168, 245, 0.45)',
    gradient:
      'linear-gradient(135deg, rgba(77, 168, 245, 0.45) 0%, rgba(118, 197, 255, 0.25) 100%)',
    border: 'rgba(191, 231, 255, 0.55)',
  },
  {
    id: 'evening',
    label: 'Evening',
    marker: 'Sunset',
    tag: 'Evening • Unwind & Reflect',
    targetProgress: 2.0,
    icon: Sunset,
    color: '#F27B35',
    glow: 'rgba(242, 123, 53, 0.45)',
    gradient:
      'linear-gradient(135deg, rgba(242, 123, 53, 0.45) 0%, rgba(142, 62, 99, 0.3) 100%)',
    border: 'rgba(255, 190, 150, 0.55)',
  },
  {
    id: 'night',
    label: 'Night',
    marker: 'Night',
    tag: 'Night • Rest & Recharge',
    targetProgress: 3.0,
    icon: Moon,
    color: '#818CF8',
    glow: 'rgba(129, 140, 248, 0.45)',
    gradient:
      'linear-gradient(135deg, rgba(129, 140, 248, 0.4) 0%, rgba(37, 47, 107, 0.4) 100%)',
    border: 'rgba(199, 210, 254, 0.55)',
  },
];

/** Map continuous progress [0..4] to nearest discrete phase */
function getPhaseFromProgress(val: number): CelestialPhase {
  const norm = ((val % 4) + 4) % 4;
  if (norm >= 3.5 || norm < 0.5) return 'morning';
  if (norm >= 0.5 && norm < 1.5) return 'afternoon';
  if (norm >= 1.5 && norm < 2.5) return 'evening';
  return 'night';
}

/**
 * CelestialSceneryViewer
 *
 * Unified interactive showcase combining:
 * 1. ProceduralLandscape (100% SVG vector scenery with 4-phase day/night lighting)
 * 2. CelestialPhaseTransition (100% SVG minimalist Sun & Crescent Moon with star friend)
 *
 * Architecture:
 * - Phone Frame: 0% obstruction clean living landscape canvas + children content.
 *   Celestial bodies are rendered physically behind the mountains via `celestialHtml`.
 * - Companion Controls Panel: Extracted outside the phone frame into an `<aside>` companion dock,
 *   sitting side-by-side on desktop (`lg:flex-row gap-8 p-4 lg:p-8 min-h-[100dvh]`).
 *
 * Features:
 * - 4-pill toggle: [Morning] | [Afternoon] | [Evening] | [Night] with smooth animated layout indicator
 * - Continuous 0.0 to 4.0 scrubber with markers (Dawn, Noon, Sunset, Night, Loop)
 * - 24h Auto-Play / Pause loop button to smoothly cycle through the full day/night continuous orbital arc
 * - Reset button (smoothly jumps back to Dawn)
 * - Zero raster images from References/ imported or rendered
 */
export function CelestialSceneryViewer({
  initialProgress,
  initialPhase = 'morning',
  autoPlay = false,
  cycleDuration = 16,
  showPhoneBadge = false,
  children,
  renderContent,
  className = '',
  style,
}: CelestialSceneryViewerProps) {
  const sliderId = useId();

  // Progress along the 24h cycle: 0 (Morning) -> 1 (Afternoon) -> 2 (Evening) -> 3 (Night) -> 4 (Loop)
  const [progress, setProgress] = useState<number>(() => {
    if (typeof initialProgress === 'number') {
      return ((initialProgress % 4) + 4) % 4;
    }
    switch (initialPhase) {
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
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  // Expose clean displayProgress and activePhaseInfo
  const displayProgress = progress;
  const activePhase = useMemo(
    () => getPhaseFromProgress(displayProgress),
    [displayProgress]
  );
  const activePhaseInfo = useMemo(
    () => PHASES.find((p) => p.id === activePhase) ?? PHASES[0],
    [activePhase]
  );

  // Animation controller refs
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const smoothAnimRef = useRef<ReturnType<typeof fmAnimate> | null>(null);

  // Stop any programmatic transition
  const stopSmoothAnim = useCallback(() => {
    if (smoothAnimRef.current) {
      smoothAnimRef.current.stop();
      smoothAnimRef.current = null;
    }
  }, []);

  // Smoothly transition progress to a target phase
  const transitionToProgress = useCallback(
    (targetProgress: number) => {
      stopSmoothAnim();
      setIsPlaying(false);

      const fromVal = progress;
      let diff = targetProgress - fromVal;

      // Handle wrap-around shortest circular path
      if (diff > 2) diff -= 4;
      if (diff < -2) diff += 4;

      if (Math.abs(diff) < 0.005) {
        setProgress(targetProgress);
        return;
      }

      const endVal = fromVal + diff;

      smoothAnimRef.current = fmAnimate(fromVal, endVal, {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          const wrapped = ((latest % 4) + 4) % 4;
          setProgress(wrapped);
        },
        onComplete: () => {
          setProgress(((targetProgress % 4) + 4) % 4);
          smoothAnimRef.current = null;
        },
      });
    },
    [progress, stopSmoothAnim]
  );

  // 24h Auto-Play continuous loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const speed = 4 / Math.max(2, cycleDuration); // progress units per second

    const animateLoop = (timestamp: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSeconds = (timestamp - lastTimeRef.current) / 1000;
        setProgress((prev) => {
          const next = prev + deltaSeconds * speed;
          return next >= 4 ? next % 4 : next;
        });
      }
      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(animateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(animateLoop);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, cycleDuration]);

  // Scrub slider change handler
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    stopSmoothAnim();
    setIsPlaying(false);
    const val = parseFloat(e.target.value);
    setProgress(val);
  };

  // Toggle play/pause
  const handleTogglePlay = () => {
    stopSmoothAnim();
    setIsPlaying((prev) => !prev);
  };

  // Reset to Dawn
  const handleReset = () => {
    transitionToProgress(0.0);
  };

  // Live 24h celestial state & coordinates
  const celestialState = useMemo(() => getCelestial24hState(displayProgress), [displayProgress]);
  const activeCelestialCoords = useMemo(() => {
    const { sun, moon } = celestialState;
    if (moon.visible && !sun.visible) {
      return {
        label: 'Moon',
        x: Math.round(moon.x),
        y: Math.round(moon.y),
      };
    }
    if (sun.visible && !moon.visible) {
      return {
        label: 'Sun',
        x: Math.round(sun.x),
        y: Math.round(sun.y),
      };
    }
    // Transition period: pick the one closest to zenith or visible
    if (moon.visible && moon.y < sun.y) {
      return {
        label: 'Moon',
        x: Math.round(moon.x),
        y: Math.round(moon.y),
      };
    }
    return {
      label: 'Sun',
      x: Math.round(sun.x),
      y: Math.round(sun.y),
    };
  }, [celestialState]);

  return (
    <div
      className={`relative w-full min-h-[100dvh] flex flex-col lg:flex-row items-center justify-center gap-8 p-4 lg:p-8 bg-stone-950 overflow-y-auto font-['Outfit'] select-none ${className}`}
      style={style}
    >
      {/* ================================================================ */}
      {/* 1. CENTERED PHONE CANVAS FRAME (0% OBSTRUCTION LIVING LANDSCAPE) */}
      {/* ================================================================ */}
      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:max-h-[92vh] sm:max-w-[430px] sm:rounded-[44px] sm:border-[8px] sm:border-black/30 sm:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.65),0_0_50px_rgba(0,0,0,0.35)] sm:ring-1 sm:ring-white/15 overflow-hidden flex flex-col shrink-0">
        {/* Desktop Phone Dynamic Island / Speaker cutout */}
        <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black/40 rounded-full z-40 pointer-events-none items-center justify-end pr-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-black/60 ring-1 ring-white/10" />
        </div>

        {/* Desktop Phone Home Bar */}
        <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/25 rounded-full z-40 pointer-events-none" />

        {/* Procedural Landscape with Mountain Occlusion (Slot Layer 2) */}
        <div className="absolute inset-0 z-0">
          <ProceduralLandscape
            progress={displayProgress}
            phase={activePhaseInfo.id}
            animateClouds={true}
            className="w-full h-full object-cover pointer-events-auto"
            celestialHtml={
              <CelestialPhaseTransition
                progress={displayProgress}
                phase={activePhaseInfo.id}
                size={106}
                animated={true}
                interactive={true}
              />
            }
          />
        </div>

        {/* Optional Phone Frame Header Badge (only when showPhoneBadge is true) */}
        {showPhoneBadge && (
          <header className="absolute top-4 sm:top-6 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
            <motion.div
              key={activePhaseInfo.id}
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg border text-white transition-colors duration-500"
              style={{
                backgroundColor: activePhaseInfo.glow,
                borderColor: activePhaseInfo.border,
              }}
            >
              <activePhaseInfo.icon className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="text-xs font-bold tracking-tight">
                {activePhaseInfo.tag}
              </span>
            </motion.div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-stone-200 shadow-sm pointer-events-auto">
              <span style={{ color: activePhaseInfo.color }}>
                {activeCelestialCoords.label} ({activeCelestialCoords.x}%, {activeCelestialCoords.y}%)
              </span>
              <span className="text-stone-400">t={displayProgress.toFixed(2)}</span>
            </div>
          </header>
        )}

        {/* Child / Dashboard Content Layer (0% Obstruction from Controls) */}
        <div className="relative z-10 w-full h-full pointer-events-auto overflow-hidden">
          {children}
          {renderContent?.({
            progress: displayProgress,
            phase: activePhaseInfo.id,
            isPlaying,
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. COMPANION 4-PHASE CONTROLS DOCK (PLACED OUTSIDE PHONE FRAME)   */}
      {/* ================================================================ */}
      <aside
        aria-label="Celestial Controls Companion Panel"
        className="w-full max-w-[430px] lg:w-[380px] shrink-0 z-30 flex flex-col gap-3"
      >
        {/* Companion Header Card with Live Celestial Status */}
        <div className="rounded-3xl bg-stone-900/85 backdrop-blur-xl border border-white/15 text-stone-100 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <motion.div
              key={activePhaseInfo.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2.5"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center border shadow-xs"
                style={{
                  backgroundColor: activePhaseInfo.glow,
                  borderColor: activePhaseInfo.border,
                }}
              >
                <activePhaseInfo.icon className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight leading-snug">
                  {activePhaseInfo.label}
                </h2>
                <p className="text-[11px] text-stone-400 leading-none">
                  {activePhaseInfo.tag}
                </p>
              </div>
            </motion.div>

            {/* Coordinates Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-mono text-stone-200 shadow-sm">
              <span style={{ color: activePhaseInfo.color }} className="font-semibold">
                {activeCelestialCoords.label} ({activeCelestialCoords.x}%, {activeCelestialCoords.y}%)
              </span>
              <span className="text-stone-400 font-medium">t={displayProgress.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 4-Phase Controls Dock Card */}
        <div className="rounded-3xl bg-stone-900/85 backdrop-blur-xl border border-white/15 text-stone-100 p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/10 flex flex-col gap-3.5">
          {/* Row 1: 4-Pill Toggle [Morning] | [Afternoon] | [Evening] | [Night] */}
          <div className="grid grid-cols-4 p-1 rounded-2xl bg-black/40 border border-white/10 relative">
            {PHASES.map((phase) => {
              const Icon = phase.icon;
              const isActive = activePhaseInfo.id === phase.id;

              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => transitionToProgress(phase.targetProgress)}
                  className={`relative flex flex-col items-center justify-center gap-0.5 py-2 px-1 rounded-xl text-xs font-bold transition-colors z-10 cursor-pointer ${
                    isActive ? 'text-white' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="celestial4PillActive"
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{
                        background: phase.gradient,
                        border: `1px solid ${phase.border}`,
                        boxShadow: `0 0 16px ${phase.glow}`,
                      }}
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}

                  <Icon
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'scale-110' : 'opacity-70'
                    }`}
                    style={{ color: isActive ? phase.color : undefined }}
                  />
                  <span className="text-[11px] leading-tight truncate">
                    {phase.label}
                  </span>
                  <span className="text-[9px] font-mono opacity-60 leading-none">
                    {phase.marker}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Continuous 0.0 to 4.0 Scrubber */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-300 px-0.5">
              <label
                htmlFor={sliderId}
                className="flex items-center gap-1.5 cursor-pointer text-stone-300 hover:text-white"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>24h Celestial Orbital Scrubber</span>
              </label>
              <div className="flex items-center gap-1 font-mono text-[10px] text-stone-400">
                <span className="text-white font-bold">{displayProgress.toFixed(2)}</span>
                <span>/ 4.00</span>
                <span>•</span>
                <span>{Math.round((displayProgress / 4) * 100)}%</span>
              </div>
            </div>

            {/* Slider Track with 4-Phase Full Day/Night Gradient */}
            <div className="relative flex items-center h-7">
              {/* Visual Gradient Track */}
              <div
                className="absolute inset-x-0 h-2.5 rounded-full overflow-hidden border border-white/10"
                style={{
                  background:
                    'linear-gradient(90deg, #FBA486 0%, #4DA8F5 25%, #F27B35 50%, #0E1438 75%, #FBA486 100%)',
                }}
              >
                {/* Subtle active fill overlay */}
                <div
                  className="h-full bg-white/20 transition-all"
                  style={{ width: `${(displayProgress / 4) * 100}%` }}
                />
              </div>

              {/* Range Input element */}
              <input
                id={sliderId}
                type="range"
                min="0"
                max="4"
                step="0.01"
                value={displayProgress}
                onChange={handleSliderChange}
                onMouseDown={() => setIsScrubbing(true)}
                onMouseUp={() => setIsScrubbing(false)}
                onTouchStart={() => setIsScrubbing(true)}
                onTouchEnd={() => setIsScrubbing(false)}
                aria-label="24-hour celestial cycle scrubber"
                className="w-full h-7 opacity-0 cursor-ew-resize relative z-10"
              />

              {/* Visual Glowing Custom Thumb Indicator */}
              <div
                className="absolute -translate-x-1/2 pointer-events-none transition-transform duration-75 flex items-center justify-center"
                style={{
                  left: `${(displayProgress / 4) * 100}%`,
                  transform: `translate(-50%, 0) scale(${isScrubbing ? 1.25 : 1})`,
                }}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.7)] flex items-center justify-center transition-colors"
                  style={{ backgroundColor: activePhaseInfo.color }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            </div>

            {/* Slider Phase Markers (Dawn, Noon, Sunset, Night, Loop) */}
            <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 px-0.5">
              <span className={displayProgress < 0.5 || displayProgress >= 3.5 ? 'text-amber-300 font-bold' : ''}>
                0.0 Dawn
              </span>
              <span className={displayProgress >= 0.5 && displayProgress < 1.5 ? 'text-sky-300 font-bold' : ''}>
                1.0 Noon
              </span>
              <span className={displayProgress >= 1.5 && displayProgress < 2.5 ? 'text-orange-400 font-bold' : ''}>
                2.0 Sunset
              </span>
              <span className={displayProgress >= 2.5 && displayProgress < 3.5 ? 'text-indigo-300 font-bold' : ''}>
                3.0 Night
              </span>
              <span className="opacity-70">4.0 Loop</span>
            </div>
          </div>

          {/* Row 3: Action Buttons (24h Auto-Play / Pause Loop & Reset to Dawn) */}
          <div className="flex items-center gap-2 pt-0.5">
            {/* 24h Auto-Play / Pause Button */}
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
                  <span>Pause 24h Loop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play 24h Loop</span>
                </>
              )}
            </motion.button>

            {/* Reset to Dawn Button */}
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Reset back to Morning (Dawn 0.0)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden xs:inline">Dawn</span>
            </button>
          </div>

          {/* Mountain Occlusion Info Hint */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 pt-0.5 text-center">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Physical mountain occlusion with zero fading</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default CelestialSceneryViewer;
