import React, { useState } from 'react'
import { Reorder } from 'framer-motion'
import { Habit, Weekday } from '../types/habit'
import { HabitItem } from './HabitItem'

interface HabitListProps {
  habits: Habit[]
  onReorder: (newOrder: Habit[]) => void
  onToggle: (id: string) => void
  onToggleDay: (habitId: string, day: Weekday) => void
  onViewAllClick: () => void
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  onReorder,
  onToggle,
  onToggleDay,
  onViewAllClick,
}) => {
  // Default first habit expanded as shown in the reference image
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(
    habits[0]?.id || null
  )

  const handleToggleExpand = (id: string) => {
    setExpandedHabitId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="w-full mt-2.5 flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1.5 px-0.5 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-black text-black tracking-tight">
            Today&apos;s Habits
          </h2>
          <span className="text-[10px] font-black uppercase tracking-wider text-black/40">
            Hold &amp; drag
          </span>
        </div>
        <button
          onClick={onViewAllClick}
          className="text-xs font-extrabold text-black hover:underline flex items-center gap-1 cursor-pointer"
        >
          View All &rarr;
        </button>
      </div>

      {/* Reorderable Habit items stack (drag-and-drop ordering) */}
      <Reorder.Group
        axis="y"
        values={habits}
        onReorder={onReorder}
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-2 py-0.5 pb-2 pr-0.5"
      >
        {habits.map((habit) => (
          <Reorder.Item
            key={habit.id}
            value={habit}
            className="select-none cursor-grab active:cursor-grabbing shrink-0"
            whileDrag={{
              scale: 1.025,
              zIndex: 50,
              boxShadow: '6px 6px 0px #000000',
            }}
          >
            <HabitItem
              habit={habit}
              isExpanded={expandedHabitId === habit.id}
              onToggleExpand={() => handleToggleExpand(habit.id)}
              onToggleComplete={() => onToggle(habit.id)}
              onToggleDay={(day) => onToggleDay(habit.id, day)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
}
