import React, { useState, useEffect } from 'react'
import {
  Plus,
  Play,
  Flame,
  Clock,
  Trophy,
  Dumbbell,
  Footprints,
  Flower2,
  Zap,
  ChevronRight,
  Check,
  Pencil,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Workout } from '../../types/workout'
import { AddWorkoutModal } from './AddWorkoutModal'
import { WorkoutDetailModal } from './WorkoutDetailModal'

interface GymScreenProps {
  workouts: Workout[]
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void
  onUpdateWorkout: (workout: Workout) => void
  onDeleteWorkout: (id: string) => void
  onNotify: (msg: string) => void
  onOpenProfile?: () => void
  weeklyTarget?: number
  onUpdateWeeklyTarget?: (target: number) => void
}

export const GymScreen: React.FC<GymScreenProps> = ({
  workouts,
  onAddWorkout,
  onUpdateWorkout,
  onDeleteWorkout,
  onNotify,
  onOpenProfile,
  weeklyTarget: propWeeklyTarget,
  onUpdateWeeklyTarget,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false)
  const [isEditTargetOpen, setIsEditTargetOpen] = useState(false)

  // Starting weekly target defaults to 0 as requested ("0/0 workouts")
  const [weeklyTarget, setWeeklyTarget] = useState<number>(() => {
    if (propWeeklyTarget !== undefined) return propWeeklyTarget
    try {
      const saved = localStorage.getItem('neo_gym_weekly_target_v3')
      if (saved !== null) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed) && parsed >= 0) return parsed
      }
    } catch {}
    return 0
  })

  const [targetInput, setTargetInput] = useState(weeklyTarget)

  useEffect(() => {
    if (propWeeklyTarget !== undefined) {
      setWeeklyTarget(propWeeklyTarget)
      setTargetInput(propWeeklyTarget)
    }
  }, [propWeeklyTarget])

  useEffect(() => {
    try {
      localStorage.setItem('neo_gym_weekly_target_v3', String(weeklyTarget))
    } catch {}
  }, [weeklyTarget])

  // Calculations
  const workoutsCompletedThisWeek = workouts.length
  const totalCalories = workouts.reduce(
    (acc, w) => acc + (w.calories || 300),
    0
  )
  const totalMinutes = workouts.reduce((acc, w) => {
    const parsed = parseInt(w.duration, 10)
    return acc + (isNaN(parsed) ? 45 : parsed)
  }, 0)
  const totalHours = (totalMinutes / 60).toFixed(1)

  const getWorkoutIcon = (type: Workout['type']) => {
    switch (type) {
      case 'Strength':
        return <Dumbbell className="w-5 h-5 text-black stroke-[2.4]" />
      case 'Cardio':
        return <Footprints className="w-5 h-5 text-black stroke-[2.4]" />
      case 'Mobility':
        return <Flower2 className="w-5 h-5 text-black stroke-[2.4]" />
      default:
        return <Zap className="w-5 h-5 text-black stroke-[2.4]" />
    }
  }

  const getWorkoutBg = (type: Workout['type']) => {
    switch (type) {
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
    <div className="flex flex-col h-full justify-between overflow-hidden select-none">
      {/* Top Fixed Section: Header & Progress Card */}
      <div className="shrink-0">
        {/* Header */}
        <header className="relative w-full pt-0.5 pb-2 pr-1 shrink-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 mr-2">
              <h1 className="text-[26px] sm:text-[30px] font-black text-black leading-none tracking-tight">
                Gym Tracker<span className="text-[#FDE047]">.</span>
              </h1>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="w-11 h-11 bg-[#FDE047] neo-border neo-shadow rounded-xl flex items-center justify-center select-none cursor-pointer shrink-0"
              title="Add Workout"
              aria-label="Add Workout"
            >
              <Plus className="w-6 h-6 text-black stroke-[3] overflow-visible" />
            </motion.button>
          </div>
        </header>

        {/* Weekly Progress Card (Lime Green) - Compact Horizontal Layout without Mascot */}
        <div className="w-full bg-[#D4F972] neo-border neo-shadow rounded-2xl pl-3.5 pr-4 py-2.5 mb-2 overflow-hidden shrink-0">
          <div className="flex items-center justify-between gap-3">
            {/* Left Side: Label and Counter */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-black/70 block leading-tight">
                  Weekly Progress
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl font-black text-black tracking-tight leading-none">
                    {workoutsCompletedThisWeek}/{weeklyTarget}
                  </span>
                  <span className="text-xs font-black text-black/70">workouts</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetInput(weeklyTarget)
                      setIsEditTargetOpen(true)
                    }}
                    className="p-1 rounded-md hover:bg-black/10 text-black/60 hover:text-black cursor-pointer transition-colors"
                    title="Change weekly workout target"
                  >
                    <Pencil className="w-3 h-3 stroke-[2.4]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Target Indicator Checkmark Tiles or Set Target */}
            <div className="flex items-center gap-1.5 shrink-0 justify-end">
              {weeklyTarget > 0 ? (
                Array.from({ length: weeklyTarget }).map((_, idx) => {
                  const isDone = idx < workoutsCompletedThisWeek
                  return (
                    <div
                      key={idx}
                      className={`w-6 h-6 rounded-md border-2 border-black flex items-center justify-center neo-shadow-sm shrink-0 ${
                        isDone ? 'bg-[#FDE047]' : 'bg-white'
                      }`}
                    >
                      {isDone && (
                        <Check className="w-3.5 h-3.5 text-black stroke-[3.5] overflow-visible" />
                      )}
                    </div>
                  )
                })
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setTargetInput(weeklyTarget)
                    setIsEditTargetOpen(true)
                  }}
                  className="px-2.5 py-1 bg-white neo-border rounded-lg text-[10px] font-black text-black hover:bg-black/5 cursor-pointer neo-pressable"
                >
                  Set Target
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics 3 Cards */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {/* Calories */}
          <div className="bg-[#FEF08A] neo-border neo-shadow-sm rounded-2xl p-2.5 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg neo-border bg-white flex items-center justify-center mb-1">
              <Flame className="w-4 h-4 text-[#FF70A6] stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-black leading-tight">
              {totalCalories.toLocaleString()}
            </span>
            <span className="text-[9.5px] font-black uppercase tracking-wider text-black/60">
              Calories
            </span>
          </div>

          {/* Workout Time */}
          <div className="bg-[#7DD3FC] neo-border neo-shadow-sm rounded-2xl p-2.5 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg neo-border bg-white flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-black leading-tight">
              {totalHours} hrs
            </span>
            <span className="text-[9.5px] font-black uppercase tracking-wider text-black/60">
              Total Time
            </span>
          </div>

          {/* Workouts */}
          <div className="bg-[#F9A8D4] neo-border neo-shadow-sm rounded-2xl p-2.5 flex flex-col items-center text-center">
            <div className="w-7 h-7 rounded-lg neo-border bg-white flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-black leading-tight">
              {workouts.length}
            </span>
            <span className="text-[9.5px] font-black uppercase tracking-wider text-black/60">
              Workouts
            </span>
          </div>
        </div>

        {/* Start Workout Banner Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (isWorkoutStarted) {
              setIsWorkoutStarted(false)
              setIsAddModalOpen(true)
            } else {
              setIsWorkoutStarted(true)
              onNotify('⚡ Workout session started! Log it when finished.')
            }
          }}
          className={`w-full py-2.5 mb-2 rounded-2xl neo-border neo-shadow flex items-center justify-center gap-2 cursor-pointer neo-pressable ${
            isWorkoutStarted ? 'bg-[#FF85A2]' : 'bg-[#FDE047]'
          }`}
        >
          <div className="w-6 h-6 rounded-lg neo-border bg-white flex items-center justify-center">
            <Play className={`w-3.5 h-3.5 text-black stroke-[3] ${isWorkoutStarted ? 'animate-pulse' : ''}`} />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-black">
            {isWorkoutStarted ? 'Session In Progress • Finish & Log' : 'Start Workout Session'}
          </span>
        </motion.button>
      </div>

      {/* Middle Scrollable Section: Recent Workouts */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 pr-0.5 space-y-2 pb-1">
        <div className="flex items-center justify-between px-0.5 pt-0.5">
          <h3 className="text-sm font-black text-black tracking-tight">
            Recent Workouts
          </h3>
          <span className="text-[11px] font-bold text-black/60">
            {workouts.length} logged
          </span>
        </div>

        {workouts.length === 0 ? (
          <div className="w-full bg-white neo-border neo-shadow rounded-2xl p-5 text-center flex flex-col items-center justify-center my-1 select-none">
            <div className="w-10 h-10 rounded-xl bg-[#FDE047] neo-border flex items-center justify-center mb-2">
              <Dumbbell className="w-5 h-5 text-black stroke-[2.4]" />
            </div>
            <h4 className="text-xs font-black text-black">No workouts logged yet</h4>
            <p className="text-[11px] font-bold text-black/50 mt-0.5 max-w-[240px]">
              Hit &quot;Start Workout Session&quot; or tap the + button to log your first exercise!
            </p>
          </div>
        ) : (
          workouts.map((workout) => (
            <motion.div
              key={workout.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedWorkout(workout)}
              className="w-full bg-white neo-border neo-shadow rounded-2xl p-2.5 flex items-center justify-between cursor-pointer neo-pressable"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl neo-border flex items-center justify-center shrink-0 ${getWorkoutBg(
                    workout.type
                  )}`}
                >
                  {getWorkoutIcon(workout.type)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-black leading-tight">
                    {workout.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] font-bold text-black/60">
                    <span>{workout.date}</span>
                    <span>•</span>
                    <span>{workout.duration}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {workout.calories && (
                  <div className="px-2 py-0.5 bg-[#FFFDF5] neo-border rounded-lg text-[10px] font-black text-black">
                    {workout.calories} kcal
                  </div>
                )}
                <div className="w-7 h-7 rounded-lg neo-border bg-[#F4F0E6] flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-black stroke-[2.6]" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add / Edit Workout Modal */}
      <AddWorkoutModal
        isOpen={isAddModalOpen}
        editingWorkout={editingWorkout}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingWorkout(null)
        }}
        onAddWorkout={(data) => {
          onAddWorkout(data)
          setIsWorkoutStarted(false)
          onNotify(`Logged "${data.name}" successfully! 💪`)
        }}
        onUpdateWorkout={(workout) => {
          onUpdateWorkout(workout)
          onNotify(`Updated "${workout.name}"! 💪`)
        }}
      />

      {/* Workout Detail Modal */}
      <WorkoutDetailModal
        workout={selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        onEdit={(workout) => {
          setSelectedWorkout(null)
          setEditingWorkout(workout)
          setIsAddModalOpen(true)
        }}
        onDelete={(id) => {
          onDeleteWorkout(id)
          onNotify('Workout removed.')
        }}
      />

      {/* Edit Weekly Target Modal */}
      <AnimatePresence>
        {isEditTargetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-[320px] bg-[#FFFDF5] neo-border-thick neo-shadow-lg rounded-[28px] p-5 select-none"
            >
              <div className="w-12 h-1 bg-black/25 rounded-full mx-auto mb-3" />
              <button
                type="button"
                onClick={() => setIsEditTargetOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.6]" />
              </button>

              <h3 className="text-lg font-black text-black">Weekly Workout Target</h3>
              <p className="text-xs font-semibold text-black/60 mt-0.5 mb-3.5">
                How many workout sessions do you plan to complete this week?
              </p>

              <div className="grid grid-cols-6 gap-1.5 mb-4">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTargetInput(num)}
                    className={`py-2 rounded-xl neo-border font-black text-xs cursor-pointer transition-all ${
                      targetInput === num
                        ? 'bg-[#FDE047] neo-shadow-sm ring-2 ring-black'
                        : 'bg-white hover:bg-black/5'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditTargetOpen(false)}
                  className="flex-1 py-2.5 bg-white neo-border rounded-xl text-xs font-black text-black hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWeeklyTarget(targetInput)
                    if (onUpdateWeeklyTarget) onUpdateWeeklyTarget(targetInput)
                    setIsEditTargetOpen(false)
                    onNotify(`Weekly target set to ${targetInput} workouts!`)
                  }}
                  className="flex-1 py-2.5 bg-[#D4F972] neo-border neo-shadow rounded-xl text-xs font-black text-black flex items-center justify-center gap-1.5 cursor-pointer neo-pressable"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
