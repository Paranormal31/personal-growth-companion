import React from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeaderProps {
  onOpenAddHabit: () => void
  onResetDemo?: () => void
  onCompleteAll?: () => void
  onClearAll?: () => void
  onNotify?: (msg: string) => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddHabit }) => {
  return (
    <header className="relative w-full pt-0.5 pb-2 pr-1 shrink-0">
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] sm:text-[28px] font-black text-black leading-none tracking-tight">
          Habit Tracker<span className="text-[#FDE047]">.</span>
        </h1>

        {/* Top-Right Yellow Plus Button for Adding Habits */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAddHabit}
          className="w-10 h-10 bg-[#FDE047] neo-border neo-shadow rounded-xl flex items-center justify-center select-none cursor-pointer shrink-0"
          title="Add New Habit"
          aria-label="Add New Habit"
        >
          <Plus className="w-5 h-5 text-black stroke-[3] overflow-visible" />
        </motion.button>
      </div>
    </header>
  )
}
