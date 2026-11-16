import React, { useState } from 'react'
import { User, Bell, RotateCcw, CheckCheck, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PlanHeaderProps {
  onResetDemo: () => void
  onCompleteAll: () => void
  onClearAll: () => void
  onNotify: (msg: string) => void
}

export const PlanHeader: React.FC<PlanHeaderProps> = ({
  onResetDemo,
  onCompleteAll,
  onClearAll,
  onNotify,
}) => {
  const [profileOpen, setProfileOpen] = useState(false)

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
                      onNotify('Reset to default habits!')
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
                    Complete All
                  </button>
                  <button
                    onClick={() => {
                      onClearAll()
                      setProfileOpen(false)
                      onNotify('All habits cleared!')
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-black hover:bg-[#DDD6FE] flex items-center gap-2 neo-border transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Button */}
        <button
          onClick={() => onNotify('🔔 Plan update: 3 tasks and 1 event scheduled today.')}
          className="relative w-10 h-10 bg-white neo-border neo-shadow rounded-xl flex items-center justify-center neo-pressable cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-black stroke-[2.2]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF70A6] border border-black rounded-full" />
        </button>
      </div>

      {/* Heading and Yellow Calendar Tile */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-black text-black leading-none tracking-tight">
            Your Plan.
          </h1>
          <p className="text-[13px] font-bold text-black/80 mt-1">
            Manage your habits &amp; schedule.
          </p>
        </div>

        {/* Yellow Calendar Neo-Brutalist Tile */}
        <motion.div
          whileHover={{ rotate: 6, scale: 1.05 }}
          className="w-14 h-14 bg-[#FDE047] neo-border neo-shadow rounded-2xl flex items-center justify-center select-none"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-black"
          >
            {/* Calendar Outer Box */}
            <rect
              x="3"
              y="5"
              width="22"
              height="20"
              rx="4"
              stroke="#000000"
              strokeWidth="2.4"
            />
            {/* Top Binder Rings */}
            <path d="M8 2.5 L8 6.5" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M20 2.5 L20 6.5" stroke="#000000" strokeWidth="2.4" strokeLinecap="round" />
            {/* Divider Line */}
            <path d="M3 10.5 L25 10.5" stroke="#000000" strokeWidth="2" />
            {/* Date Grid Dots */}
            <circle cx="8" cy="15" r="1.2" fill="#000000" />
            <circle cx="14" cy="15" r="1.2" fill="#000000" />
            <circle cx="20" cy="15" r="1.2" fill="#000000" />
            <circle cx="8" cy="19" r="1.2" fill="#000000" />
            <circle cx="14" cy="19" r="1.2" fill="#000000" />
            <circle cx="20" cy="19" r="1.2" fill="#000000" />
          </svg>
        </motion.div>
      </div>
    </header>
  )
}
