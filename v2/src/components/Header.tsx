import React, { useState } from 'react'
import { User, Bell, Plus, RotateCcw, CheckCheck, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  onOpenAddHabit: () => void
  onResetDemo: () => void
  onCompleteAll: () => void
  onClearAll: () => void
  onNotify: (msg: string) => void
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddHabit,
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
                      onNotify('Reset to default habits (3/4)!')
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

      {/* Heading and Yellow Plus Button Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-black text-black leading-none tracking-tight">
            Habit Tracker<span className="text-[#FDE047]">.</span>
          </h1>
          <p className="text-[13px] font-bold text-black/80 mt-1">
            Build consistency, one day at a time.
          </p>
        </div>

        {/* Top-Right Yellow Plus Button for Adding Habits */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAddHabit}
          className="w-12 h-12 bg-[#FDE047] neo-border neo-shadow rounded-2xl flex items-center justify-center select-none cursor-pointer"
          title="Add New Habit"
          aria-label="Add New Habit"
        >
          <Plus className="w-6 h-6 text-black stroke-[3]" />
        </motion.button>
      </div>
    </header>
  )
}
