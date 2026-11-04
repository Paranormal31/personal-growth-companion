import { useState } from 'react';
import { X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TopNavProps {
  onClose: () => void;
  inkColor: string;
  className?: string;
}

/**
 * TopNav — Minimalist header for the Mood Meter UI.
 * Features a tone-on-tone dismiss (✕) button and an optional subtle info tooltip.
 */
export function TopNav({ onClose, inkColor, className = '' }: TopNavProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header
      className={`w-full flex items-center justify-between px-6 pt-5 pb-2 z-30 relative select-none ${className}`}
    >
      {/* Dismiss (✕) Button — Left aligned matching reference image */}
      <button
        type="button"
        onClick={onClose}
        className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer hover:bg-black/10 active:scale-90 active:bg-black/20 focus:outline-none focus-visible:ring-2"
        style={{ color: inkColor }}
        aria-label="Dismiss Mood Meter"
      >
        <X className="w-6 h-6 stroke-[2.4]" />
      </button>

      {/* Subtle Info Button / Tooltip — Right aligned matching reference image */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowInfo((prev) => !prev)}
          className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer hover:bg-black/8 active:scale-92 focus:outline-none focus-visible:ring-2"
          style={{ color: inkColor }}
          aria-label="Mood Meter Information"
          aria-expanded={showInfo}
        >
          <Info className="w-5 h-5 opacity-40 hover:opacity-80 transition-opacity" />
        </button>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute right-0 mt-2 w-64 p-3 rounded-2xl bg-black/15 backdrop-blur-md shadow-lg border border-white/10 text-xs font-medium leading-relaxed z-40 pointer-events-auto"
              style={{ color: inkColor }}
            >
              <p>
                Slide to tune how you feel right now. No judgments, just honoring your current state.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default TopNav;
