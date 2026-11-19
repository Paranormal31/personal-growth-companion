import React, { useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { Habit, Weekday } from '../types/habit'
import { HabitItem } from './HabitItem'

interface HabitListProps {
  habits: Habit[]
  isViewingAll?: boolean
  onReorder: (newOrder: Habit[]) => void
  onToggle: (id: string) => void
  onToggleDay: (habitId: string, day: Weekday) => void
  onViewAllClick: () => void
  onEditHabit?: (habit: Habit) => void
}

interface ReorderableHabitRowProps {
  habit: Habit
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleComplete: () => void
  onToggleDay: (day: Weekday) => void
  onEdit?: () => void
}

const ReorderableHabitRow: React.FC<ReorderableHabitRowProps> = ({
  habit,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  onToggleDay,
  onEdit,
}) => {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={habit}
      dragListener={false}
      dragControls={dragControls}
      className="select-none shrink-0"
      whileDrag={{
        scale: 1.025,
        zIndex: 50,
        boxShadow: '6px 6px 0px #000000',
      }}
    >
      <HabitItem
        habit={habit}
        isExpanded={isExpanded}
        dragControls={dragControls}
        onToggleExpand={onToggleExpand}
        onToggleComplete={onToggleComplete}
        onToggleDay={onToggleDay}
        onEdit={onEdit}
      />
    </Reorder.Item>
  )
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  isViewingAll = false,
  onReorder,
  onToggle,
  onToggleDay,
  onViewAllClick,
  onEditHabit,
}) => {
  // Default first habit expanded as shown in the reference image
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(
    habits[0]?.id || null
  )

  const handleToggleExpand = (id: string) => {
    setExpandedHabitId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="w-full mt-2 flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1.5 px-0.5 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[17px] font-black text-black tracking-tight">
            {isViewingAll ? 'All Habits' : "Today's Habits"}
          </h2>
          <span className="text-[10px] font-black uppercase tracking-wider text-black/40">
            Hold &amp; drag
          </span>
        </div>
        <button
          onClick={onViewAllClick}
          className="text-xs font-extrabold text-black hover:underline flex items-center gap-1 cursor-pointer"
        >
          {isViewingAll ? '← Show Today' : 'View All →'}
        </button>
      </div>

      {/* Reorderable Habit items stack (drag-and-drop ordering via handle only) */}
      <Reorder.Group
        axis="y"
        values={habits}
        onReorder={onReorder}
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-2 py-0.5 pb-8 pr-0.5"
      >
        {habits.map((habit) => (
          <ReorderableHabitRow
            key={habit.id}
            habit={habit}
            isExpanded={expandedHabitId === habit.id}
            onToggleExpand={() => handleToggleExpand(habit.id)}
            onToggleComplete={() => onToggle(habit.id)}
            onToggleDay={(day) => onToggleDay(habit.id, day)}
            onEdit={() => onEditHabit?.(habit)}
          />
        ))}
      </Reorder.Group>
    </div>
  )
}
