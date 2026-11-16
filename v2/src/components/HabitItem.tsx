import React from 'react'
import { Check, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { Habit } from '../types/habit'
import { getHabitIconComponent } from '../constants/icons'

interface HabitItemProps {
  habit: Habit
  onToggle: (id: string) => void
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle }) => {
  const IconComponent = getHabitIconComponent(habit.iconName)

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="w-full bg-white neo-border neo-shadow rounded-2xl px-3 py-2.5 flex items-center justify-between cursor-pointer select-none neo-pressable"
      onClick={() => onToggle(habit.id)}
    >
      {/* Left: Icon Tile & Habit Details */}
      <div className="flex items-center gap-3">
        <div
          className="w-10.5 h-10.5 rounded-xl border-2 border-black neo-shadow-sm flex items-center justify-center shrink-0"
          style={{ backgroundColor: habit.accentColor }}
        >
          <IconComponent className="w-5 h-5 text-black stroke-[2.4]" />
        </div>

        <div className="flex flex-col">
          <span className="text-[15px] font-extrabold text-black tracking-tight leading-tight">
            {habit.name}
          </span>
          <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-black/75 mt-0.5">
            <RefreshCw className="w-3 h-3 text-black stroke-[2.2]" />
            <span>{habit.streak} day streak</span>
          </div>
        </div>
      </div>

      {/* Right: Neo-Brutalist Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggle(habit.id)
        }}
        className="w-7.5 h-7.5 rounded-lg border-2 border-black flex items-center justify-center neo-pressable shrink-0 cursor-pointer"
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
          <Check className="w-4 h-4 text-black stroke-[3.5]" />
        </motion.div>
      </button>
    </motion.div>
  )
}
