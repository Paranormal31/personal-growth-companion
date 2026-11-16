import React from 'react'
import { Calendar, Layers, BarChart2 } from 'lucide-react'

interface TopNavTabsProps {
  onPlaceholderClick: (tab: string) => void
}

export const TopNavTabs: React.FC<TopNavTabsProps> = ({ onPlaceholderClick }) => {
  return (
    <div className="w-full bg-white neo-border neo-shadow rounded-2xl p-1.5 flex items-center justify-between mt-1 shrink-0">
      {/* Schedule Tab (Active) */}
      <button
        className="flex-1 py-2 px-3 bg-[#FDE047] neo-border rounded-xl flex items-center justify-center gap-1.5 neo-pressable neo-shadow-sm cursor-pointer"
        aria-label="Schedule tab (Active)"
      >
        <Calendar className="w-4 h-4 text-black stroke-[2.4]" />
        <span className="text-[13px] font-black text-black tracking-tight">
          Schedule
        </span>
      </button>

      {/* Habits Tab (Placeholder) */}
      <button
        onClick={() => onPlaceholderClick('Habits')}
        className="flex-1 py-2 px-2.5 flex items-center justify-center gap-1.5 neo-pressable cursor-pointer text-black hover:opacity-75"
        aria-label="Habits tab (Placeholder)"
      >
        <Layers className="w-4 h-4 text-black stroke-[2.2]" />
        <span className="text-[13px] font-extrabold text-black tracking-tight">
          Habits
        </span>
      </button>

      {/* Vertical divider */}
      <div className="w-[1.5px] h-5 bg-black/20 my-auto" />

      {/* Calendar Tab (Placeholder) */}
      <button
        onClick={() => onPlaceholderClick('Calendar')}
        className="flex-1 py-2 px-2.5 flex items-center justify-center gap-1.5 neo-pressable cursor-pointer text-black hover:opacity-75"
        aria-label="Calendar tab (Placeholder)"
      >
        <BarChart2 className="w-4 h-4 text-black stroke-[2.2]" />
        <span className="text-[13px] font-extrabold text-black tracking-tight">
          Calendar
        </span>
      </button>
    </div>
  )
}
