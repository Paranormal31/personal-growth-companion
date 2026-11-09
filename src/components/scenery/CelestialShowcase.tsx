import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { ProceduralLandscape } from './ProceduralLandscape';
import { CelestialPhaseTransition } from './CelestialPhaseTransition';

export type TimePhase = 'morning' | 'afternoon' | 'evening' | 'night';

const PHASES: readonly TimePhase[] = ['morning', 'afternoon', 'evening', 'night'] as const;

interface PhaseConfig {
  id: TimePhase;
  label: string;
  tag: string;
  sunPosition: { x: number; y: number }; // percentages (0-100)
  celestialType: 'sun' | 'moon';
  celestialState: 'awake' | 'high' | 'sleepy' | 'moon';
  skyColors: [string, string, string];
  houseLight: boolean;
}

const PHASE_CONFIGS: Record<TimePhase, PhaseConfig> = {
  morning: {
    id: 'morning',
    label: 'Morning',
    tag: 'Bright Beginnings',
    sunPosition: { x: 80, y: 58 },
    celestialType: 'sun',
    celestialState: 'awake',
    skyColors: ['#FBA486', '#FFC399', '#FFE6BE'],
    houseLight: false,
  },
  afternoon: {
    id: 'afternoon',
    label: 'Afternoon',
    tag: 'Steady Progress',
    sunPosition: { x: 50, y: 19 },
    celestialType: 'sun',
    celestialState: 'high',
    skyColors: ['#4DA8F5', '#76C5FF', '#BFE7FF'],
    houseLight: false,
  },
  evening: {
    id: 'evening',
    label: 'Evening',
    tag: 'Unwind & Reflect',
    sunPosition: { x: 25, y: 57 },
    celestialType: 'sun',
    celestialState: 'sleepy',
    skyColors: ['#422464', '#8E3E63', '#F27B35'],
    houseLight: true,
  },
  night: {
    id: 'night',
    label: 'Night',
    tag: 'Rest & Recharge',
    sunPosition: { x: 82, y: 51 },
    celestialType: 'moon',
    celestialState: 'moon',
    skyColors: ['#0E1438', '#171E4A', '#252F6B'],
    houseLight: true,
  },
};

/**
 * CelestialShowcase
 *
 * Full-screen, butter-smooth fluid animation of the Sun and the Moon
 * matching the 4 reference artworks with continuous orbital arc movement,
 * living weather effects, fireflies, and auto-cycle player.
 */
export function CelestialShowcase() {
  const [currentPhase, setCurrentPhase] = useState<TimePhase>('morning');
  const [isPlaying, setIsPlaying] = useState(false);
  const [cycleProgress, setCycleProgress] = useState(0); // 0 to 4
  const [isScrubbing, setIsScrubbing] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Helper to map 0..4 progress into TimePhase
  const getPhaseFromProgress = (val: number): TimePhase => {
    const wrapped = ((val % 4) + 4) % 4;
    if (wrapped < 1) return 'morning';
    if (wrapped < 2) return 'afternoon';
    if (wrapped < 3) return 'evening';
    return 'night';
  };

  // Sync phase with cycle progress
  const activePhase = isScrubbing ? getPhaseFromProgress(cycleProgress) : currentPhase;
  const config = PHASE_CONFIGS[activePhase];

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (timestamp - lastTimeRef.current) / 1000;
        // Complete full 4-phase cycle in 12 seconds
        setCycleProgress((prev) => {
          const next = (prev + delta / 3) % 4;
          const newPhase = getPhaseFromProgress(next);
          setCurrentPhase(newPhase);
          return next;
        });
      }
      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  // Handle phase jump
  const handleSelectPhase = (phase: TimePhase) => {
    setIsPlaying(false);
    setCurrentPhase(phase);
    const index = PHASES.indexOf(phase);
    setCycleProgress(index);
  };


  return (
    <div className="relative w-full h-[100dvh] flex items-center justify-center bg-black overflow-hidden select-none font-['Outfit']">
      {/* Phone Canvas Container */}
      <div className="relative w-full h-full md:h-[90vh] md:max-h-[880px] md:max-w-[430px] md:rounded-[44px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.6)] md:border-[8px] md:border-stone-900 bg-slate-950 flex flex-col">
        
        {/* ============================================================== */}
        {/* 1. SEAMLESS PROCEDURAL VECTOR LANDSCAPE (ZERO RASTER IMAGES)  */}
        {/* Celestial body rendered inside Layer 2 slot behind mountains   */}
        {/* ============================================================== */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <ProceduralLandscape
            progress={isScrubbing || isPlaying ? cycleProgress : undefined}
            phase={activePhase}
            celestialHtml={
              <CelestialPhaseTransition
                progress={isScrubbing || isPlaying ? cycleProgress : undefined}
                phase={activePhase}
                onTap={() => {
                  const nextIndex = (PHASES.indexOf(activePhase) + 1) % PHASES.length;
                  handleSelectPhase(PHASES[nextIndex]);
                }}
              />
            }
          />
        </div>

        {/* ============================================================== */}
        {/* 4. OVERLAY HEADER & TITLE                                      */}
        {/* ============================================================== */}
        <div className="relative z-30 p-6 pt-10 flex flex-col items-start pointer-events-none">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-start"
          >
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm backdrop-blur-md mb-2 ${
                activePhase === 'night'
                  ? 'bg-indigo-950/70 text-indigo-200 border border-indigo-700/40'
                  : activePhase === 'evening'
                  ? 'bg-purple-950/60 text-rose-200 border border-rose-500/30'
                  : activePhase === 'afternoon'
                  ? 'bg-sky-900/40 text-sky-100 border border-sky-400/30'
                  : 'bg-amber-950/40 text-amber-100 border border-amber-500/30'
              }`}
            >
              {config.label}
            </span>
            <h1
              className={`text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm ${
                activePhase === 'night'
                  ? 'text-white'
                  : activePhase === 'evening'
                  ? 'text-white'
                  : activePhase === 'afternoon'
                  ? 'text-sky-950'
                  : 'text-amber-950'
              }`}
            >
              {config.tag}
            </h1>
          </motion.div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ============================================================== */}
        {/* 5. BUTTER-SMOOTH CONTROLS DOCK AT BOTTOM                       */}
        {/* ============================================================== */}
        <div className="relative z-30 p-4 pb-6 flex flex-col gap-3">
          {/* 4-Phase Switcher Pills */}
          <div className="w-full bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/15 flex items-center justify-between shadow-lg">
            {PHASES.map((p) => {
              const isSelected = p === activePhase;
              return (
                <button
                  key={p}
                  onClick={() => handleSelectPhase(p)}
                  className={`relative flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 capitalize flex items-center justify-center gap-1.5 ${
                    isSelected ? 'text-white shadow-md' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activePhasePill"
                      className={`absolute inset-0 rounded-xl ${
                        p === 'morning'
                          ? 'bg-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                          : p === 'afternoon'
                          ? 'bg-sky-500/80 shadow-[0_0_15px_rgba(14,165,233,0.5)]'
                          : p === 'evening'
                          ? 'bg-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                          : 'bg-indigo-600/80 shadow-[0_0_15px_rgba(79,70,229,0.5)]'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{p}</span>
                </button>
              );
            })}
          </div>

          {/* Continuous Cycle Player Bar */}
          <div className="w-full bg-black/40 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/15 flex items-center gap-3 shadow-lg">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition flex items-center justify-center text-white shrink-0"
              title={isPlaying ? 'Pause Cycle' : 'Play 24h Cycle'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>

            {/* Continuous Scrubber */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-medium text-white/50 tracking-wider uppercase">
                <span>Sunrise</span>
                <span>Noon</span>
                <span>Sunset</span>
                <span>Moon</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="0.02"
                value={cycleProgress}
                onMouseDown={() => {
                  setIsPlaying(false);
                  setIsScrubbing(true);
                }}
                onTouchStart={() => {
                  setIsPlaying(false);
                  setIsScrubbing(true);
                }}
                onMouseUp={() => setIsScrubbing(false)}
                onTouchEnd={() => setIsScrubbing(false)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCycleProgress(val);
                  setCurrentPhase(getPhaseFromProgress(val));
                }}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white transition-all"
              />
            </div>

            {/* Reset / Loop indicator */}
            <button
              onClick={() => handleSelectPhase('morning')}
              className="w-8 h-8 rounded-lg hover:bg-white/10 active:scale-95 transition flex items-center justify-center text-white/70 hover:text-white shrink-0"
              title="Reset to Morning"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
