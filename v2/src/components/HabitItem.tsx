import React from 'react'
import { Check, RefreshCw, ChevronDown, GripVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Habit, Weekday } from '../types/habit'
import { getHabitIconComponent } from '../constants/icons'

interface HabitItemProps {
  habit: Habit
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleComplete: () => void
  onToggleDay: (day: Weekday) => void
}

const ALL_WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  isExpanded,
  onToggleExpand,
  onToggleComplete,
  onToggleDay,
}) => {
  const IconComponent = getHabitIconComponent(habit.iconName)

  // Calculate completed days in this week
  const completedDaysCount = ALL_WEEKDAYS.filter(
    (d) => habit.weeklyCompletions?.[d]
  ).length

  return (
    <div className="w-full bg-white neo-border neo-shadow rounded-2xl overflow-hidden select-none shrink-0">
      {/* Habit Card Header Row */}
      <div
        onClick={onToggleExpand}
        className="px-3 py-3 flex items-center justify-between cursor-pointer neo-pressable"
      >
        {/* Left: Drag Handle, Icon Tile & Details */}
        <div className="flex items-center gap-2.5">
          <div
            className="cursor-grab active:cursor-grabbing text-black/35 hover:text-black transition-colors py-1 shrink-0"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 stroke-[2.4]" />
          </div>

          <div
            className="w-11 h-11 rounded-xl border-2 border-black neo-shadow-sm flex items-center justify-center shrink-0"
            style={{ backgroundColor: habit.accentColor }}
          >
            <IconComponent className="w-5 h-5 text-black stroke-[2.4]" />
          </div>

          <div className="flex flex-col">
            <span className="text-[16px] font-black text-black tracking-tight leading-tight">
              {habit.name}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-black/75 mt-0.5">
              <RefreshCw className="w-3.5 h-3.5 text-black stroke-[2.2]" />
              <span>{habit.streak} day streak</span>
            </div>
          </div>
        </div>

        {/* Right: Checkbox & Expand Chevron */}
        <div className="flex items-center gap-2">
          {/* Completion Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleComplete()
            }}
            className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center neo-pressable shrink-0 cursor-pointer"
            style={{
              backgroundColor: habit.completed ? '#FDE047' : '#FFFFFF',
              boxShadow: habit.completed ? '2px 2px 0px #000000' : 'none',
            }}
            aria-label={`Mark ${habit.name} as ${habit.completed ? 'incomplete' : 'complete'}`}
          >
            <motion.div
              initial={false}
              animate={{
                scale: habit.completed ? 1 : 0,
                opacity: habit.completed ? 1 : 0,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Check className="w-4.5 h-4.5 text-black stroke-[3.5]" />
            </motion.div>
          </button>

          {/* Expand/Collapse Chevron Indicator */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="w-6 h-6 flex items-center justify-center text-black"
          >
            <ChevronDown className="w-5 h-5 stroke-[2.6]" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Weekly Checklist Panel (Lavender Background) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t-2 border-black bg-[#DDD6FE] px-3.5 pt-2.5 pb-3">
              {/* Weekly Header Row */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-black tracking-tight">
                  This Week
                </span>
                <span className="text-xs font-black text-black tracking-tight">
                  {completedDaysCount}/7 days
                </span>
              </div>

              {/* 7 Days Row: Mon - Sun */}
              <div className="flex items-center justify-between gap-1">
                {ALL_WEEKDAYS.map((day) => {
                  const isDayChecked = habit.weeklyCompletions?.[day] ?? false
                  return (
                    <div key={day} className="flex flex-col items-center flex-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleDay(day)
                        }}
                        className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center neo-pressable cursor-pointer ${
                          isDayChecked
                            ? 'bg-[#FDE047] neo-shadow-sm'
                            : 'bg-white hover:bg-black/5'
                        }`}
                        aria-label={`${day}: ${isDayChecked ? 'Completed' : 'Incomplete'}`}
                      >
                        {isDayChecked && (
                          <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />
                        )}
                      </button>
                      <span className="text-[10px] font-bold text-black/80 mt-1">
                        {day}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
