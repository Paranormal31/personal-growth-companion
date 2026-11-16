import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Dumbbell, Footprints, Flower2, Zap, Clock, Flame, Calendar, Trash2 } from 'lucide-react'
import { Workout } from '../../types/workout'

interface WorkoutDetailModalProps {
  workout: Workout | null
  onClose: () => void
  onDelete?: (id: string) => void
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  workout,
  onClose,
  onDelete,
}) => {
  if (!workout) return null

  const getIcon = () => {
    switch (workout.type) {
      case 'Strength':
        return <Dumbbell className="w-6 h-6 text-black stroke-[2.4]" />
      case 'Cardio':
        return <Footprints className="w-6 h-6 text-black stroke-[2.4]" />
      case 'Mobility':
        return <Flower2 className="w-6 h-6 text-black stroke-[2.4]" />
      default:
        return <Zap className="w-6 h-6 text-black stroke-[2.4]" />
    }
  }

  const getBgColor = () => {
    switch (workout.type) {
      case 'Strength':
        return 'bg-[#FF85A2]'
      case 'Cardio':
        return 'bg-[#7DD3FC]'
      case 'Mobility':
        return 'bg-[#D4F972]'
      default:
        return 'bg-[#DDD6FE]'
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-[360px] bg-[#FFFDF5] neo-border-thick neo-shadow-lg rounded-[28px] p-5 select-none"
        >
          {/* Top handle */}
          <div className="w-12 h-1 bg-black/25 rounded-full mx-auto mb-3" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.6]" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-xl neo-border flex items-center justify-center ${getBgColor()} shrink-0`}
            >
              {getIcon()}
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase rounded-md tracking-wider mb-1">
                {workout.type}
              </div>
              <h2 className="text-xl font-black text-black leading-tight">
                {workout.name}
              </h2>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white neo-border rounded-xl p-2 text-center">
              <div className="flex justify-center mb-1 text-black/60">
                <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-black/50 uppercase block">
                Duration
              </span>
              <span className="text-xs font-black text-black">
                {workout.duration}
              </span>
            </div>

            <div className="bg-white neo-border rounded-xl p-2 text-center">
              <div className="flex justify-center mb-1 text-black/60">
                <Flame className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-black/50 uppercase block">
                Burned
              </span>
              <span className="text-xs font-black text-black">
                {workout.calories ? `${workout.calories} kcal` : '—'}
              </span>
            </div>

            <div className="bg-white neo-border rounded-xl p-2 text-center">
              <div className="flex justify-center mb-1 text-black/60">
                <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-black/50 uppercase block">
                Logged
              </span>
              <span className="text-xs font-black text-black">
                {workout.date}
              </span>
            </div>
          </div>

          {/* Notes & Exercises */}
          {workout.notes && (
            <div className="bg-white neo-border rounded-xl p-3 mb-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-black/50 block mb-1">
                Workout Notes & Exercises
              </span>
              <p className="text-xs font-bold text-black/90 leading-relaxed whitespace-pre-wrap">
                {workout.notes}
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(workout.id)
                  onClose()
                }}
                className="px-3 py-2.5 bg-[#FF85A2] neo-border rounded-xl flex items-center justify-center text-black font-bold text-xs neo-pressable cursor-pointer"
                title="Delete workout"
              >
                <Trash2 className="w-4 h-4 stroke-[2.4]" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-[#FDE047] neo-border neo-shadow py-2.5 rounded-xl font-black text-xs text-black text-center cursor-pointer neo-pressable"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
