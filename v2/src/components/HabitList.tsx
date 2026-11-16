import React from 'react'
import { Habit } from '../types/habit'
import { HabitItem } from './HabitItem'

interface HabitListProps {
  habits: Habit[]
  onToggle: (id: string) => void
  onViewAllClick: () => void
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  onToggle,
  onViewAllClick,
}) => {
  return (
    <div className="w-full mt-2.5 flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Section Header (Fixed) */}
      <div className="flex items-center justify-between mb-1.5 px-0.5 shrink-0">
        <h2 className="text-[16px] font-black text-black tracking-tight">
          Today&apos;s Habits
        </h2>
        <button
          onClick={onViewAllClick}
          className="text-xs font-extrabold text-black hover:underline flex items-center gap-1 cursor-pointer"
        >
          View All &rarr;
        </button>
      </div>

      {/* Habit items stack (Scrollable only if overflowing) */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-2 py-0.5 pr-0.5">
        {habits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} onToggle={onToggle} />
        ))}
      </div>
    </div>
  )
}
