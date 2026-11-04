import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { MoodPhase, MoodTheme } from '../types/mood';
import { MOOD_PHASES, MOOD_THEMES } from '../constants/moods';

export interface StepSliderProps {
  currentPhase: MoodPhase;
  onChange: (phase: MoodPhase) => void;
  onContinuousChange?: (continuousValue: number) => void;
  theme: MoodTheme;
  className?: string;
}

const THUMB_SIZE = 44; // Apple iOS minimum touch target 44px
const PADDING = 6; // Inner pill padding (6px on each side)

/**
 * StepSlider — Touch-friendly, 4-step magnetic snapping horizontal slider
 *
 * Designed for the Personal Growth Companion Mood Meter UI.
 * Features:
 * - 4 discrete stops: 'bad' (0), 'not_good' (1), 'not_bad' (2), 'good' (3)
 * - Direct tap on any step marker or label to snap
 * - 60/120fps fluid dragging with pointer capture (touch & mouse)
 * - Velocity-assisted magnetic snapping with Framer Motion spring physics
 * - Real-time continuous scrubbing callback (0..3) for live facial morphing
 * - Minimalist tone-on-tone styling with theme colors
 * - Full mobile touch optimization with touch-action isolation
 * - Accessible keyboard navigation (Arrow keys, Home, End, 1..4)
 */
export function StepSlider({
  currentPhase,
  onChange,
  onContinuousChange,
  theme,
  className = '',
}: StepSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Gesture tracking refs
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const lastPointerXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const isInitialMountRef = useRef(true);
  const prevTrackWidthRef = useRef(0);

  const currentIndex = Math.max(0, MOOD_PHASES.indexOf(currentPhase));

  // Framer Motion motion value for the thumb's left coordinate
  const thumbX = useMotionValue(0);

  // Fill line width follows thumb in real-time without re-rendering
  const fillWidth = useTransform(thumbX, (latest) => Math.max(0, latest));

  // Measure track width synchronously on mount and observe resize/orientation changes
  useLayoutEffect(() => {
    if (!trackRef.current) return;
    const updateWidth = () => {
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setTrackWidth(rect.width);
        }
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  // Snap with spring physics to a discrete stop index
  const handleSnapToIndex = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(3, Math.round(index)));
      const targetPhase = MOOD_PHASES[clampedIndex];
      const travel = Math.max(0, trackWidth - THUMB_SIZE - PADDING * 2);
      const targetX = travel > 0 ? (clampedIndex / 3) * travel : 0;

      animate(thumbX, targetX, {
        type: 'spring',
        stiffness: 420,
        damping: 30,
        mass: 0.8,
      });

      onChange(targetPhase);
      onContinuousChange?.(clampedIndex);
    },
    [trackWidth, thumbX, onChange, onContinuousChange]
  );

  // Sync external currentPhase prop to thumbX position with spring animation
  useEffect(() => {
    if (isDraggingRef.current) return;
    const targetIndex = MOOD_PHASES.indexOf(currentPhase);
    if (targetIndex >= 0 && trackWidth > 0) {
      const travel = Math.max(0, trackWidth - THUMB_SIZE - PADDING * 2);
      const targetX = (targetIndex / 3) * travel;

      if (isInitialMountRef.current) {
        thumbX.set(targetX);
        isInitialMountRef.current = false;
        prevTrackWidthRef.current = trackWidth;
      } else if (prevTrackWidthRef.current !== trackWidth) {
        // Window resized, instantly update position without animation
        thumbX.set(targetX);
        prevTrackWidthRef.current = trackWidth;
      } else {
        animate(thumbX, targetX, {
          type: 'spring',
          stiffness: 420,
          damping: 30,
          mass: 0.8,
        });
      }
    }
  }, [currentPhase, trackWidth, thumbX]);

  // Pointer Down — start tracking gesture
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    track.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    lastPointerXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setIsActive(true);
  };

  // Pointer Move — smooth 60/120fps continuous scrubbing with touch isolation
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const dx = e.clientX - pointerDownPosRef.current.x;
    if (!hasMovedRef.current && Math.abs(dx) > 3) {
      hasMovedRef.current = true;
    }

    if (hasMovedRef.current) {
      const rect = track.getBoundingClientRect();
      const travel = Math.max(0, rect.width - THUMB_SIZE - PADDING * 2);
      const currentPointerX = e.clientX - rect.left - PADDING - THUMB_SIZE / 2;
      const clampedX = Math.max(0, Math.min(travel, currentPointerX));

      thumbX.set(clampedX);

      const continuousVal = travel > 0 ? (clampedX / travel) * 3 : 0;
      onContinuousChange?.(continuousVal);

      // Measure pointer velocity for natural flick physics
      const now = performance.now();
      const dt = now - lastTimeRef.current;
      if (dt > 8) {
        velocityRef.current = (e.clientX - lastPointerXRef.current) / dt;
        lastPointerXRef.current = e.clientX;
        lastTimeRef.current = now;
      }
    }
  };

  // Pointer Up — magnetic snapping to closest stop or direct tap execution
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if capture was already released
    }
    isDraggingRef.current = false;
    setIsActive(false);

    const rect = trackRef.current?.getBoundingClientRect();
    const currentWidth = rect ? rect.width : trackWidth;
    const travel = Math.max(0, currentWidth - THUMB_SIZE - PADDING * 2);

    if (!hasMovedRef.current) {
      // Direct tap on the track: jump to tapped stop with spring physics
      const tapX = e.clientX - (rect?.left ?? 0) - PADDING - THUMB_SIZE / 2;
      const continuousVal = travel > 0 ? Math.max(0, Math.min(3, (tapX / travel) * 3)) : 0;
      const targetIndex = Math.max(0, Math.min(3, Math.round(continuousVal)));
      handleSnapToIndex(targetIndex);
    } else {
      // Drag release: snap to nearest stop, biased by release flick velocity
      const currentX = thumbX.get();
      let continuousVal = travel > 0 ? (currentX / travel) * 3 : 0;

      if (Math.abs(velocityRef.current) > 0.35) {
        const bias = velocityRef.current > 0 ? 0.35 : -0.35;
        continuousVal = Math.max(0, Math.min(3, continuousVal + bias));
      }

      const targetIndex = Math.max(0, Math.min(3, Math.round(continuousVal)));
      handleSnapToIndex(targetIndex);
    }
  };

  // Keyboard accessibility handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      handleSnapToIndex(Math.min(3, currentIndex + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleSnapToIndex(Math.max(0, currentIndex - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleSnapToIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleSnapToIndex(3);
    } else if (['1', '2', '3', '4'].includes(e.key)) {
      e.preventDefault();
      handleSnapToIndex(parseInt(e.key, 10) - 1);
    }
  };

  return (
    <div className={`w-full max-w-sm mx-auto flex flex-col select-none ${className}`}>
      {/* Pill Slider Track Container */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="Mood Meter Slider"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={currentIndex}
        aria-valuetext={theme.label}
        className="relative w-full h-14 rounded-full select-none touch-none cursor-pointer flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-black/5 dark:border-white/10 backdrop-blur-md transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          backgroundColor: theme.softBgColor || 'rgba(0, 0, 0, 0.08)',
          touchAction: 'none',
        }}
      >
        {/* Recessed Groove Line connecting Stop 0 to Stop 3 */}
        <div
          className="absolute h-1.5 rounded-full pointer-events-none"
          style={{
            left: PADDING + THUMB_SIZE / 2,
            right: PADDING + THUMB_SIZE / 2,
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          }}
        />

        {/* Dynamic active progress bar following thumb */}
        <motion.div
          className="absolute h-1.5 rounded-full pointer-events-none"
          style={{
            left: PADDING + THUMB_SIZE / 2,
            width: fillWidth,
            backgroundColor: theme.inkColor,
            opacity: 0.25,
          }}
        />

        {/* 4 Step Stop Indicators along the track */}
        <div
          className="absolute inset-y-0 flex items-center justify-between pointer-events-none"
          style={{
            left: PADDING + THUMB_SIZE / 2,
            right: PADDING + THUMB_SIZE / 2,
          }}
        >
          {MOOD_PHASES.map((phase, idx) => {
            const isCurrent = currentIndex === idx;
            return (
              <div
                key={phase}
                className="relative flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.3 : 1,
                    opacity: isCurrent ? 0.9 : 0.35,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: isCurrent ? theme.inkColor : 'rgba(0, 0, 0, 0.4)',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Slider Thumb / Knob */}
        <motion.div
          style={{
            x: thumbX,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            top: PADDING,
            left: PADDING,
          }}
          animate={{
            scale: isActive ? 1.08 : 1,
            boxShadow: isActive
              ? '0 10px 25px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.1)'
              : '0 4px 14px -1px rgba(0, 0, 0, 0.16), 0 2px 4px -1px rgba(0, 0, 0, 0.08)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute rounded-full bg-white flex items-center justify-center cursor-grab active:cursor-grabbing select-none z-20 ring-1 ring-black/5"
        >
          {/* Mood theme color indicator dot */}
          <motion.div
            className="w-4 h-4 rounded-full transition-colors duration-300 shadow-inner"
            style={{ backgroundColor: theme.color }}
            animate={{
              scale: isActive ? 1.25 : 1,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          />
        </motion.div>
      </div>

      {/* 4 Step Stop Labels below the track */}
      <div className="flex justify-between items-center px-4 mt-3 select-none">
        {MOOD_PHASES.map((phase, idx) => {
          const isSelected = currentPhase === phase;
          const itemTheme = MOOD_THEMES[phase];
          return (
            <button
              key={phase}
              type="button"
              onClick={() => handleSnapToIndex(idx)}
              className={`transition-all duration-200 cursor-pointer text-xs font-semibold focus:outline-none focus-visible:underline ${
                isSelected
                  ? 'font-bold scale-105 opacity-100'
                  : 'opacity-55 hover:opacity-85'
              }`}
              style={{ color: theme.inkColor }}
            >
              {itemTheme.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StepSlider;
