import React from 'react'
import { motion } from 'framer-motion'

interface PlanHeaderProps {
  onResetDemo?: () => void
  onCompleteAll?: () => void
  onClearAll?: () => void
  onNotify?: (msg: string) => void
}

export const PlanHeader: React.FC<PlanHeaderProps> = () => {
  return (
    <header className="relative w-full pt-1 pb-3 shrink-0">

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
