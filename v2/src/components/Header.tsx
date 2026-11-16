import React, { useState } from 'react'
import { User, Bell, RotateCcw, CheckCheck, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  onResetDemo: () => void
  onCompleteAll: () => void
  onClearAll: () => void
  onNotify: (msg: string) => void
}

export const Header: React.FC<HeaderProps> = ({
  onResetDemo,
  onCompleteAll,
  onClearAll,
  onNotify,
}) => {
  const [profileOpen, setProfileOpen] = useState(false)
  const [isDayTime, setIsDayTime] = useState(true)

  const greeting = isDayTime ? 'Good Morning.' : 'Good Evening.'

  const toggleDayNight = () => {
    const nextDay = !isDayTime
    setIsDayTime(nextDay)
    onNotify(nextDay ? 'Switched to Day Mode (Good Morning) ☀️' : 'Switched to Night Mode (Good Evening) 🌙')
  }

  return (
    <header className="relative w-full pt-1 pb-3 shrink-0">
      {/* Top action row */}
      <div className="flex items-center justify-between mb-2.5">
        {/* Profile Button */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 bg-white neo-border neo-shadow rounded-xl flex items-center justify-center neo-pressable cursor-pointer"
            aria-label="User Profile"
          >
            <User className="w-5 h-5 text-black stroke-[2.2]" />
          </button>

          {/* Quick Settings / State Reset Popover */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                className="absolute left-0 mt-2 z-50 w-56 bg-white neo-border neo-shadow-lg rounded-2xl p-3"
              >
                <div className="text-xs font-black uppercase tracking-wider text-black/60 mb-2">
                  Demo Controls
                </div>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      onResetDemo()
                      setProfileOpen(false)
                      onNotify('Reset to Reference Image (3/4)!')
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-black hover:bg-[#FDE047] flex items-center gap-2 neo-border transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Default (3/4)
                  </button>
                  <button
                    onClick={() => {
                      onCompleteAll()
                      setProfileOpen(false)
                      onNotify('Celebration time! 4/4 habits done! 🎉')
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-black hover:bg-[#D4F972] flex items-center gap-2 neo-border transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Complete All (4/4)
                  </button>
                  <button
                    onClick={() => {
                      onClearAll()
                      setProfileOpen(false)
                      onNotify('All habits cleared (0/4)!')
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-black hover:bg-[#DDD6FE] flex items-center gap-2 neo-border transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear All (0/4)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Button */}
        <button
          onClick={() => onNotify('🔔 You have 1 habit left to complete today!')}
          className="relative w-10 h-10 bg-white neo-border neo-shadow rounded-xl flex items-center justify-center neo-pressable cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-black stroke-[2.2]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF70A6] border border-black rounded-full" />
        </button>
      </div>

      {/* Greeting and Sun Tile Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-black text-black leading-none tracking-tight">
            {greeting}
          </h1>
          <p className="text-[13px] font-bold text-black/80 mt-1 flex items-center gap-1">
            Let&apos;s make today count! <span className="text-sm">✨</span>
          </p>
        </div>

        {/* Yellow Sun / Celestial Neo-Brutalist Tile (Click to toggle day/night) */}
        <motion.button
          type="button"
          whileHover={{ rotate: 8, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDayNight}
          className="w-14 h-14 bg-[#FDE047] neo-border neo-shadow rounded-2xl flex items-center justify-center select-none cursor-pointer"
          title="Click to toggle Day/Night greeting"
          aria-label="Toggle Sun/Moon greeting"
        >
          {isDayTime ? (
            /* Custom Line Art Sun matching reference exactly */
            <svg
              width="34"
              height="34"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black"
            >
              <circle cx="18" cy="18" r="7" stroke="#000000" strokeWidth="2.4" />
              {/* Rays */}
              <line x1="18" y1="3" x2="18" y2="7.5" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="18" y1="28.5" x2="18" y2="33" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="3" y1="18" x2="7.5" y2="18" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="28.5" y1="18" x2="33" y2="18" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="7.4" y1="7.4" x2="10.5" y2="10.5" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="25.5" y1="25.5" x2="28.6" y2="28.6" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="7.4" y1="28.6" x2="10.5" y2="25.5" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="25.5" y1="10.5" x2="28.6" y2="7.4" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          ) : (
            /* Moon variant */
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </motion.button>
      </div>
    </header>
  )
}
