import React from 'react'
import { motion } from 'framer-motion'

interface SummaryCardsProps {
  currentStreakDays?: number
  completionPercentage?: number
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  currentStreakDays = 7,
  completionPercentage = 86,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 w-full mt-3 shrink-0">
      {/* Current Streak Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-[#FDE047] neo-border neo-shadow rounded-2xl px-3.5 py-3 flex items-center justify-between select-none"
      >
        <div>
          <span className="text-[12px] font-extrabold text-black tracking-tight block">
            Current Streak
          </span>
          <span className="text-xl font-black text-black tracking-tight block mt-0.5 leading-none">
            {currentStreakDays} days
          </span>
        </div>

        {/* Retro Cartoon Flame Graphic */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            width="30"
            height="34"
            viewBox="0 0 32 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 2 C16 2 24 10 24 18 C24 24.6 19.5 29 14 29 C8.5 29 5 24.6 5 18 C5 12 11 6 16 2 Z"
              fill="#FF7A59"
              stroke="#000000"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M15 13 C15 13 19 18 19 21.5 C19 24.5 17 26.5 14 26.5 C11 26.5 9.5 24.5 9.5 21.5 C9.5 18 13 15 15 13 Z"
              fill="#FDE047"
              stroke="#000000"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>

      {/* This Week Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-[#DDD6FE] neo-border neo-shadow rounded-2xl px-3.5 py-3 flex items-center justify-between select-none"
      >
        <div>
          <span className="text-[12px] font-extrabold text-black tracking-tight block">
            This Week
          </span>
          <span className="text-xl font-black text-black tracking-tight block mt-0.5 leading-none">
            {completionPercentage}%
          </span>
        </div>

        {/* Mini 4-Bar Chart Graphic */}
        <div className="flex items-end gap-1.5 h-6 shrink-0 pr-1">
          <div className="w-1.5 h-2 bg-black rounded-full" />
          <div className="w-1.5 h-3.5 bg-black rounded-full" />
          <div className="w-1.5 h-5 bg-black rounded-full" />
          <div className="w-1.5 h-6.5 bg-black rounded-full" />
        </div>
      </motion.div>
    </div>
  )
}
