import React from 'react'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Habit } from '../types/habit'
import { MascotFlower } from './MascotFlower'

interface ProgressCardProps {
  habits: Habit[]
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ habits }) => {
  const total = habits.length
  const completed = habits.filter((h) => h.completed).length

  return (
    <div className="relative w-full bg-[#D4F972] neo-border neo-shadow-lg rounded-[22px] px-4.5 py-4 overflow-hidden shrink-0">
      <div className="flex items-center justify-between">
        {/* Left Side: Stats and Mini Checkbox Indicators */}
        <div className="flex flex-col justify-between z-10">
          <div>
            <span className="text-[13px] font-extrabold text-black tracking-tight">
              Today&apos;s Progress
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <motion.span
                key={completed}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-black text-black tracking-tight"
              >
                {completed}/{total}
              </motion.span>
            </div>
          </div>

          {/* Row of Mini Habit Indicators */}
          <div className="flex items-center gap-1.5 mt-3">
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                layout
                initial={false}
                animate={{
                  backgroundColor: habit.completed ? '#FDE047' : '#FFFFFF',
                  scale: habit.completed ? [1, 1.15, 1] : 1,
                }}
                transition={{ duration: 0.2 }}
                className="w-6.5 h-6.5 rounded-md border-2 border-black flex items-center justify-center neo-shadow-sm"
              >
                {habit.completed && (
                  <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Retro Cartoon Mascot Illustration */}
        <div className="relative -mr-2 flex items-center justify-center">
          <MascotFlower completed={completed} total={total} />
        </div>
      </div>
    </div>
  )
}
