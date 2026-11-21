import React, { useState } from 'react'
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
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Workout } from '../../types/workout'
import { GymMascot } from './GymMascot'
import { AddWorkoutModal } from './AddWorkoutModal'
import { WorkoutDetailModal } from './WorkoutDetailModal'

interface GymScreenProps {
  workouts: Workout[]
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void
  onDeleteWorkout: (id: string) => void
  onNotify: (msg: string) => void
  onOpenProfile?: () => void
}

export const GymScreen: React.FC<GymScreenProps> = ({
  workouts,
  onAddWorkout,
  onDeleteWorkout,
  onNotify,
  onOpenProfile,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false)

  // Calculations
  const weeklyTarget = 5
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
              <p className="text-[13px] font-bold text-black/80 mt-1">
                Track workouts, build strength.
              </p>
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

        {/* Weekly Progress Card (Lime Green) */}
        <div className="w-full bg-[#D4F972] neo-border neo-shadow rounded-3xl p-3.5 mb-2.5 flex items-center justify-between">
          <div className="flex-1 pr-2">
            <span className="text-xs font-black uppercase tracking-wider text-black/70">
              Weekly Progress
            </span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-3xl font-black text-black tracking-tight leading-none">
                {workoutsCompletedThisWeek}/{weeklyTarget}
              </span>
              <span className="text-xs font-black text-black/70">workouts</span>
            </div>

            {/* Target Indicators */}
            <div className="flex items-center gap-1.5 mt-2">
              {Array.from({ length: weeklyTarget }).map((_, idx) => {
                const isDone = idx < workoutsCompletedThisWeek
                return (
                  <div
                    key={idx}
                    className={`w-6 h-6 rounded-lg neo-border flex items-center justify-center ${
                      isDone ? 'bg-[#FDE047]' : 'bg-white/80'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Gym Mascot */}
          <div className="shrink-0 scale-90 -mr-2">
            <GymMascot completed={workoutsCompletedThisWeek} target={weeklyTarget} />
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

        {workouts.map((workout) => (
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
        ))}
      </div>

      {/* Add Workout Modal */}
      <AddWorkoutModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWorkout={(data) => {
          onAddWorkout(data)
          setIsWorkoutStarted(false)
          onNotify(`Logged "${data.name}" successfully! 💪`)
        }}
      />

      {/* Workout Detail Modal */}
      <WorkoutDetailModal
        workout={selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
        onDelete={(id) => {
          onDeleteWorkout(id)
          onNotify('Workout removed.')
        }}
      />
    </div>
  )
}
