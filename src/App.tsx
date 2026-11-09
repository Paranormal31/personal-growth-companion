import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MoodPhase } from './types/mood';
import {
  MOOD_THEMES,
  getMoodPhaseFromValue,
  interpolateMoodColor,
  interpolateInkColor,
} from './constants/moods';
import { MoodFace } from './components/MoodFace';
import { StepSlider } from './components/StepSlider';
import { TopNav } from './components/TopNav';
import { MoodLabel } from './components/MoodLabel';
import { MainAppPlaceholder } from './components/MainAppPlaceholder';
import { DesktopTimeDock } from './components/dev/DesktopTimeDock';
import { CelestialSceneryViewer } from './components/scenery/CelestialSceneryViewer';
import { useTimeOfDay } from './hooks/useTimeOfDay';
import { Sparkles, Smile, SunMedium } from 'lucide-react';

/**
 * App — Personal Growth Companion
 *
 * Implements:
 * - Default View: CelestialSceneryViewer — pure custom vector 4-phase scenery & orbital animation
 * - Phase 1: Minimalist Mood Meter UI (character face, mood text, 4-step magnetic slider)
 * - Stage 2: Fabulous-inspired Dashboard with Living Scenic Landscape & Daily Rituals
 */
export function App() {
  // 'celestial' is default primary view showcasing pure vector 4-phase CelestialSceneryViewer
  const [viewMode, setViewMode] = useState<'celestial' | 'mood' | 'dashboard'>('celestial');
  const [currentPhase, setCurrentPhase] = useState<MoodPhase>('not_bad');
  const [continuousValue, setContinuousValue] = useState<number | undefined>(undefined);

  // Time-of-day orchestration hook
  const timeControls = useTimeOfDay();
  const {
    currentTime,
    theme: timeTheme,
    replayKey,
    triggerReplay,
  } = timeControls;

  // Active phase derived from continuous scrub position or settled discrete phase
  const activePhase: MoodPhase =
    typeof continuousValue === 'number'
      ? getMoodPhaseFromValue(continuousValue)
      : currentPhase;

  const activeTheme = MOOD_THEMES[activePhase] ?? MOOD_THEMES.not_bad;

  // Real-time continuous color interpolation during scrubbing; exact hex when settled
  const activeBgColor =
    typeof continuousValue === 'number'
      ? interpolateMoodColor(continuousValue)
      : activeTheme.color;

  const activeInkColor =
    typeof continuousValue === 'number'
      ? interpolateInkColor(continuousValue)
      : activeTheme.inkColor;

  // Primary Default View: CelestialSceneryViewer
  if (viewMode === 'celestial') {
    return (
      <div className="relative w-full h-[100dvh]">
        <CelestialSceneryViewer />

        {/* Floating Quick View Mode Switcher */}
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/15 p-1.5 rounded-full shadow-2xl">
          <button
            type="button"
            onClick={() => setViewMode('celestial')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'celestial'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <SunMedium size={14} />
            Celestial Animation
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mood')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 text-white/60 hover:text-white transition cursor-pointer"
          >
            <Smile size={14} />
            Mood UI
          </button>
          <button
            type="button"
            onClick={() => setViewMode('dashboard')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 text-white/60 hover:text-white transition cursor-pointer"
          >
            <Sparkles size={14} />
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Desktop ambient backdrop & phone canvas background mapping
  const isNight = currentTime === 'night';
  const activeDashboardBg = isNight
    ? '#13112A'
    : timeTheme.colors.surface || timeTheme.colors.background || '#FAF7F2';

  const viewportBgColor = viewMode === 'mood'
    ? activeBgColor
    : isNight
      ? '#0B0A1B'
      : timeTheme.colors.background;

  const phoneFrameBgColor = viewMode === 'mood' ? activeBgColor : activeDashboardBg;

  return (
    <main
      className="relative min-h-[100dvh] w-full flex flex-col lg:flex-row items-center justify-center gap-8 p-4 md:p-8 transition-colors ease-out overflow-y-auto font-['Outfit']"
      style={{
        backgroundColor: viewportBgColor,
        transitionDuration: typeof continuousValue === 'number' ? '0ms' : '500ms',
      }}
    >
      {/* Floating Quick View Mode Switcher */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/15 p-1.5 rounded-full shadow-2xl">
        <button
          type="button"
          onClick={() => setViewMode('celestial')}
          className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 text-white/60 hover:text-white transition cursor-pointer"
        >
          <SunMedium size={14} />
          Celestial Animation
        </button>
        <button
          type="button"
          onClick={() => setViewMode('mood')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            viewMode === 'mood'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Smile size={14} />
          Mood UI
        </button>
        <button
          type="button"
          onClick={() => setViewMode('dashboard')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            viewMode === 'dashboard'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Sparkles size={14} />
          Dashboard
        </button>
      </div>

      {/* Centered Mobile Canvas Frame (100% Unobstructed) */}
      <div
        className="w-full h-[100dvh] md:h-[844px] md:max-h-[92vh] md:max-w-[412px] md:rounded-[48px] md:border-[10px] md:border-black/20 md:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35),0_0_50px_rgba(0,0,0,0.12)] md:ring-1 md:ring-white/20 overflow-hidden relative flex flex-col shrink-0 transition-colors ease-out"
        style={{
          backgroundColor: phoneFrameBgColor,
          transitionDuration: typeof continuousValue === 'number' ? '0ms' : '500ms',
        }}
      >
        {/* Subtle Desktop Device Notch */}
        <div className="hidden md:flex absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black/25 rounded-full z-50 pointer-events-none items-center justify-end pr-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-black/40 ring-1 ring-white/10" />
        </div>

        {/* Subtle Desktop Home Indicator Bar */}
        <div className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full z-50 pointer-events-none" />

        {/* View Transitions: Mood Meter <-> Dashboard */}
        <AnimatePresence mode="wait">
          {viewMode === 'mood' ? (
            <motion.div
              key="mood-meter"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex flex-col justify-between overflow-hidden relative select-none"
              style={{ color: activeInkColor }}
            >
              {/* Minimal Top Bar with Dismiss (✕) Button */}
              <TopNav
                onClose={() => setViewMode('celestial')}
                inkColor={activeInkColor}
              />

              {/* Expressive Face & Single Animated Mood Label */}
              <section className="flex-1 flex flex-col items-center justify-center w-full px-6 py-2 my-auto z-10 gap-2">
                <MoodFace
                  phase={currentPhase}
                  theme={activeTheme}
                  continuousValue={continuousValue}
                  className="w-56 h-56 sm:w-64 sm:h-64"
                />

                <MoodLabel
                  phase={activePhase}
                  inkColor={activeInkColor}
                />
              </section>

              {/* Minimal 4-Step Magnetic Snapping Slider */}
              <footer className="w-full px-6 pb-8 pt-2 z-10">
                <StepSlider
                  currentPhase={currentPhase}
                  onChange={(phase) => {
                    setCurrentPhase(phase);
                    setContinuousValue(undefined);
                  }}
                  onContinuousChange={(val) => {
                    setContinuousValue(val);
                  }}
                  theme={activeTheme}
                />
              </footer>
            </motion.div>
          ) : (
            <motion.div
              key="main-app"
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full overflow-hidden relative"
            >
              <MainAppPlaceholder
                currentPhase={currentPhase}
                onOpenMoodMeter={() => setViewMode('mood')}
                period={currentTime}
                timeTheme={timeTheme}
                replayKey={replayKey}
                onReplay={triggerReplay}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Companion Desktop Time Dock (Positioned OUTSIDE / BESIDE / BELOW the phone container) */}
      <div className="w-full max-w-[412px] lg:w-[380px] shrink-0 z-30">
        <DesktopTimeDock
          timeControls={timeControls}
          defaultCollapsed={false}
          className="relative w-full"
        />
      </div>
    </main>
  );
}

export default App;
