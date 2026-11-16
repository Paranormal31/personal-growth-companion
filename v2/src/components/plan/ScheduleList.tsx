import React from 'react'
import { Habit } from '../../types/habit'
import { ScheduleItem } from './ScheduleItem'

interface ScheduleListProps {
  habits: Habit[]
  selectedDateStr: string
  onToggle: (id: string) => void
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  habits,
  selectedDateStr,
  onToggle,
}) => {
  const taskCount = habits.filter((h) => h.type !== 'event').length
  const eventCount = habits.filter((h) => h.type === 'event').length

  return (
    <div className="w-full mt-2.5 flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Section Header (Fixed) */}
      <div className="flex items-center justify-between mb-1.5 px-0.5 shrink-0">
        <h2 className="text-[16px] font-black text-black tracking-tight">
          Today&apos;s Schedule
        </h2>
        <span className="text-[12px] font-extrabold text-black/70">
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'} • {eventCount}{' '}
          {eventCount === 1 ? 'event' : 'events'}
        </span>
      </div>

      {/* Schedule Items Stack (Only this region scrolls) */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-2 py-0.5 pr-0.5">
        {habits.length === 0 ? (
          <div className="w-full bg-white neo-border neo-shadow rounded-2xl p-4 text-center my-auto">
            <p className="text-sm font-extrabold text-black/70">
              No habits scheduled for this day.
            </p>
            <span className="text-xs font-bold text-black/50 block mt-1">
              Tap &quot;+ Add Habit&quot; below to schedule one!
            </span>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompleted =
              habit.completedDates?.[selectedDateStr] ?? habit.completed
            return (
              <ScheduleItem
                key={habit.id}
                habit={habit}
                isCompleted={isCompleted}
                onToggle={onToggle}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
