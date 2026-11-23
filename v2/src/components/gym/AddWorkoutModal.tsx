import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Dumbbell,
  Footprints,
  Flame,
  Clock,
  FileText,
  Check,
  Zap,
  ChevronDown,
  Flower2,
} from 'lucide-react'
import { Workout, WorkoutType } from '../../types/workout'

interface AddWorkoutModalProps {
  isOpen: boolean
  onClose: () => void
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void
  editingWorkout?: Workout | null
  onUpdateWorkout?: (workout: Workout) => void
}

const DURATION_OPTIONS = [
  '15 min',
  '30 min',
  '45 min',
  '60 min',
  '75 min',
  '90 min',
]

export const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({
  isOpen,
  onClose,
  onAddWorkout,
  editingWorkout,
  onUpdateWorkout,
}) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<WorkoutType>('Strength')
  const [duration, setDuration] = useState('45 min')
  const [calories, setCalories] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingWorkout) {
      setName(editingWorkout.name || '')
      setType(editingWorkout.type || 'Strength')
      setDuration(editingWorkout.duration || '45 min')
      setCalories(
        editingWorkout.calories !== undefined ? String(editingWorkout.calories) : ''
      )
      setNotes(editingWorkout.notes || '')
    } else {
      setName('')
      setType('Strength')
      setDuration('45 min')
      setCalories('')
      setNotes('')
    }
    setError('')
  }, [editingWorkout, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a workout name')
      return
    }

    if (editingWorkout && onUpdateWorkout) {
      onUpdateWorkout({
        ...editingWorkout,
        name: name.trim(),
        type,
        duration,
        calories: calories ? parseInt(calories, 10) : undefined,
        notes: notes.trim() || undefined,
      })
    } else {
      onAddWorkout({
        name: name.trim(),
        type,
        date: 'Today',
        duration,
        calories: calories ? parseInt(calories, 10) : undefined,
        notes: notes.trim() || undefined,
        completedAt: new Date().toISOString(),
      })
    }

    // Reset form
    setName('')
    setType('Strength')
    setDuration('45 min')
    setCalories('')
    setNotes('')
    setError('')
    onClose()
  }

  const workoutTypes: { type: WorkoutType; label: string; icon: React.ReactNode }[] = [
    {
      type: 'Strength',
      label: 'Strength',
      icon: <Dumbbell className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      type: 'Cardio',
      label: 'Cardio',
      icon: <Footprints className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      type: 'Mobility',
      label: 'Mobility',
      icon: <Flower2 className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      type: 'Other',
      label: 'Other',
      icon: <Zap className="w-5 h-5 text-black stroke-[2.4]" />,
    },
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-[370px] bg-[#FFFDF5] neo-border-thick neo-shadow-lg rounded-[28px] p-5 overflow-hidden select-none"
        >
          {/* Top Drag Handle */}
          <div className="w-12 h-1 bg-black/25 rounded-full mx-auto mb-3" />

          {/* Close button */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.6]" />
          </button>

          {/* Title & Subtitle */}
          <div className="mb-4">
            <h2 className="text-xl font-black text-black tracking-tight leading-tight">
              {editingWorkout ? 'Edit Workout' : 'Add Workout'}
            </h2>
            <p className="text-xs font-semibold text-black/60 mt-0.5">
              {editingWorkout ? 'Update workout details.' : 'Log a new workout session.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Workout Name */}
            <div>
              <label className="block text-[13px] font-black text-black mb-1.5">
                Workout Name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Dumbbell className="w-4 h-4 text-black stroke-[2.4]" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="e.g. Push Day, Leg Day, Upper Body"
                  className="w-full bg-white neo-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-bold text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#FDE047]"
                />
              </div>
              {error && (
                <p className="text-[11px] font-bold text-[#FF70A6] mt-1">{error}</p>
              )}
            </div>

            {/* Workout Type */}
            <div>
              <label className="block text-[13px] font-black text-black mb-1.5">
                Workout Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {workoutTypes.map((item) => {
                  const isSelected = type === item.type
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setType(item.type)}
                      className={`relative flex flex-col items-center justify-center py-2.5 px-1 rounded-xl neo-border neo-pressable cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#FF85A2] neo-shadow-sm'
                          : 'bg-white hover:bg-black/5'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-white border-[1.8px] border-black rounded-full flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 text-black stroke-[3.5]" />
                        </div>
                      )}
                      <div className="mb-1">{item.icon}</div>
                      <span className="text-[10.5px] font-black text-black">
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Duration & Calories Row */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Duration */}
              <div>
                <label className="block text-[13px] font-black text-black mb-1.5">
                  Duration
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Clock className="w-4 h-4 text-black stroke-[2.4]" />
                  </div>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full bg-white neo-border rounded-xl pl-9 pr-7 py-2.5 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#FDE047] appearance-none cursor-pointer"
                  >
                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-black stroke-[2.5] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Calories */}
              <div>
                <label className="block text-[13px] font-black text-black mb-1.5">
                  Calories <span className="text-[11px] font-medium text-black/50">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Flame className="w-4 h-4 text-black stroke-[2.4]" />
                  </div>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g. 350 kcal"
                    min="0"
                    max="3000"
                    className="w-full bg-white neo-border rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#FDE047]"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[13px] font-black text-black mb-1.5">
                Notes <span className="text-[11px] font-medium text-black/50">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3 pointer-events-none">
                  <FileText className="w-4 h-4 text-black stroke-[2.4]" />
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes, exercises, or how it felt..."
                  rows={2}
                  className="w-full bg-white neo-border rounded-xl pl-10 pr-3.5 py-2 text-xs font-bold text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#FDE047] resize-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-2 bg-[#FDE047] neo-border neo-shadow py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer neo-pressable"
            >
              <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center bg-transparent">
                <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />
              </div>
              <span className="text-sm font-black text-black tracking-wide">
                {editingWorkout ? 'Save Changes' : 'Save Workout'}
              </span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
