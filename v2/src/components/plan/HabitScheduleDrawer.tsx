import React from 'react'
import { X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Habit, Weekday } from '../../types/habit'

interface HabitScheduleDrawerProps {
  isOpen: boolean
  onClose: () => void
  habits: Habit[]
}

const ALL_WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const HabitScheduleDrawer: React.FC<HabitScheduleDrawerProps> = ({
  isOpen,
  onClose,
  habits,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="w-full max-w-sm bg-[#FFFDF5] neo-border-thick neo-shadow-phone rounded-t-[32px] sm:rounded-[28px] p-5 relative select-none max-h-[85vh] overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-3">
              <div>
                <h2 className="text-lg font-black text-black tracking-tight">
                  Habit Weekly Schedules
                </h2>
                <p className="text-xs font-bold text-black/70">
                  Active days configured for each habit
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white neo-border flex items-center justify-center neo-pressable cursor-pointer neo-shadow-sm"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4 text-black stroke-[3]" />
              </button>
            </div>

            {/* Habits List */}
            <div className="space-y-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="bg-white neo-border neo-shadow-sm rounded-xl p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-sm text-black">
                      {habit.name}
                    </span>
                    <span className="text-[11px] font-bold text-black/70">
                      {habit.startTime} – {habit.endTime}
                    </span>
                  </div>

                  {/* Days pills */}
                  <div className="flex items-center gap-1">
                    {ALL_WEEKDAYS.map((day) => {
                      const isActive = habit.activeDays.includes(day)
                      return (
                        <span
                          key={day}
                          className={`flex-1 py-1 text-center rounded-md text-[10px] font-black border ${
                            isActive
                              ? 'bg-[#FDE047] border-black text-black'
                              : 'bg-black/5 border-transparent text-black/30'
                          }`}
                        >
                          {day}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Done button */}
            <button
              onClick={onClose}
              className="w-full mt-4 py-2.5 bg-[#FDE047] neo-border neo-shadow-sm rounded-xl font-black text-xs text-black neo-pressable flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Done
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
