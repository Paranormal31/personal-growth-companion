import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Weekday } from '../../types/habit'

interface HabitSchedulesCardProps {
  selectedWeekday: Weekday
  onSelectWeekday: (day: Weekday) => void
  onOpenScheduleDrawer: () => void
}

const ALL_WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const HabitSchedulesCard: React.FC<HabitSchedulesCardProps> = ({
  selectedWeekday,
  onSelectWeekday,
  onOpenScheduleDrawer,
}) => {
  return (
    <div className="w-full bg-[#DDD6FE] neo-border neo-shadow rounded-2xl p-3 mt-3 shrink-0 select-none">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h3 className="text-[15px] font-black text-black tracking-tight leading-tight">
            Habit Schedules
          </h3>
          <p className="text-[11.5px] font-bold text-black/75 mt-0.5">
            Set which days each habit is active.
          </p>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={onOpenScheduleDrawer}
          className="w-7 h-7 rounded-full bg-white neo-border flex items-center justify-center neo-pressable cursor-pointer neo-shadow-sm"
          aria-label="View all habit schedules"
        >
          <ChevronRight className="w-4 h-4 text-black stroke-[2.8]" />
        </button>
      </div>

      {/* 7 Weekday Pills Row */}
      <div className="flex items-center justify-between gap-1">
        {ALL_WEEKDAYS.map((day) => {
          const isSelected = day === selectedWeekday
          return (
            <button
              key={day}
              onClick={() => onSelectWeekday(day)}
              className={`flex-1 py-1 rounded-xl flex flex-col items-center justify-center cursor-pointer neo-pressable transition-all ${
                isSelected
                  ? 'bg-[#FDE047] border-2 border-black neo-shadow-sm font-black'
                  : 'bg-white border-[1.8px] border-black text-black/85 font-extrabold hover:bg-black/5'
              }`}
            >
              <span className="text-[11px] leading-tight">{day}</span>
              {isSelected ? (
                <span className="w-1.5 h-1.5 bg-black rounded-full mt-0.5" />
              ) : (
                <span className="w-1.5 h-1.5 opacity-0 mt-0.5" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
