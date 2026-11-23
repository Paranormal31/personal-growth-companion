import React from 'react'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Habit } from '../types/habit'

interface ProgressCardProps {
  habits: Habit[]
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ habits }) => {
  const total = habits.length
  const completed = habits.filter((h) => h.completed).length

  return (
    <div className="w-full bg-[#D4F972] neo-border neo-shadow rounded-2xl pl-3.5 pr-4 py-2.5 overflow-hidden shrink-0">
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Progress Label and Completion Counter */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-black/70 block leading-tight">
              Today&apos;s Progress
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <motion.span
                key={completed}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-black text-black tracking-tight leading-none"
              >
                {completed}/{total}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Right Side: Individual Completion Indicator Tiles */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
          {total === 0 ? (
            <span className="text-[11px] font-extrabold text-black/50">Add your first habit</span>
          ) : (
            habits.map((habit) => (
              <motion.div
                key={habit.id}
                layout
                initial={false}
                animate={{
                  backgroundColor: habit.completed ? '#FDE047' : '#FFFFFF',
                  scale: habit.completed ? [1, 1.15, 1] : 1,
                }}
                transition={{ duration: 0.18 }}
                className="w-6 h-6 rounded-md border-2 border-black flex items-center justify-center neo-shadow-sm shrink-0"
                title={`${habit.name}: ${habit.completed ? 'Completed' : 'Pending'}`}
              >
                {habit.completed && (
                  <Check className="w-3.5 h-3.5 text-black stroke-[3.5] overflow-visible" />
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
