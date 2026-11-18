import React from 'react'
import {
  User,
  Bell,
  Moon,
  Sunset,
  ArrowRight,
  CheckSquare,
  Dumbbell,
  Wallet,
  Flame,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Habit, Weekday } from '../../types/habit'
import { Workout } from '../../types/workout'
import { Transaction } from '../../types/budget'
import { SunMascot } from '../SunMascot'

interface HomeScreenProps {
  habits: Habit[]
  workouts: Workout[]
  transactions: Transaction[]
  currentWeekday: Weekday
  onNavigateTab: (tab: 'habit' | 'gym' | 'home' | 'budget' | 'profile') => void
  onOpenProfile: () => void
  onNotify: (msg: string) => void
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  habits,
  workouts,
  transactions,
  currentWeekday,
  onNavigateTab,
  onOpenProfile,
  onNotify,
}) => {
  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) {
      return {
        text: 'Good Morning.',
        icon: <SunMascot size={36} />,
        bg: 'bg-[#FDE047]',
      }
    }
    if (hour < 17) {
      return {
        text: 'Good Afternoon.',
        icon: <Sunset className="w-5 h-5 text-black stroke-[2.5]" />,
        bg: 'bg-[#FED7AA]',
      }
    }
    return {
      text: 'Good Evening.',
      icon: <Moon className="w-5 h-5 text-black stroke-[2.5]" />,
      bg: 'bg-[#DDD6FE]',
    }
  }

  const greeting = getGreeting()

  // Dynamic calculations from shared states
  // 1. Habits
  const activeTodayHabits = habits.filter((h) =>
    h.activeDays.includes(currentWeekday)
  )
  const completedHabitsCount = activeTodayHabits.filter((h) => h.completed).length
  const totalHabitsCount = activeTodayHabits.length
  const habitPercentage =
    totalHabitsCount > 0
      ? Math.round((completedHabitsCount / totalHabitsCount) * 100)
      : 0

  // 2. Gym / Workouts
  const weeklyWorkoutTarget = 5
  const weeklyWorkoutsCount = workouts.length
  const latestWorkout = workouts[0] || null

  // 3. Budget / Transactions
  const monthlyBudget = 40000
  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
  const monthlyExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
  const remainingBudget = monthlyBudget - monthlyExpenses

  const todayExpenses = transactions
    .filter((t) => t.type === 'expense' && t.date === 'Today')
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="flex flex-col h-full justify-between overflow-hidden select-none">
      {/* Top Fixed Section: Header & Daily Overview */}
      <div className="shrink-0">
        {/* Header */}
        <header className="relative w-full pt-1 pb-2 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onOpenProfile}
              className="w-10 h-10 bg-white neo-border neo-shadow rounded-xl flex items-center justify-center neo-pressable cursor-pointer"
              aria-label="User Profile"
            >
              <User className="w-5 h-5 text-black stroke-[2.2]" />
            </button>

            <button
              onClick={() =>
                onNotify(
                  `✨ Great progress today! ${completedHabitsCount}/${totalHabitsCount} habits checked.`
                )
              }
              className="relative w-10 h-10 bg-white neo-border neo-shadow rounded-xl flex items-center justify-center neo-pressable cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-black stroke-[2.2]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF70A6] border border-black rounded-full" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[30px] font-black text-black leading-none tracking-tight">
                {greeting.text}
              </h1>
              <p className="text-[13px] font-bold text-black/80 mt-1 flex items-center gap-1">
                Let's make today count! <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
              </p>
            </div>

            {/* Sun / Time Illustration Tile */}
            <div
              className={`w-12 h-12 ${greeting.bg} neo-border neo-shadow rounded-2xl flex items-center justify-center p-1 overflow-hidden`}
            >
              {greeting.icon}
            </div>
          </div>
        </header>

        {/* Daily Overview Card */}
        <div className="w-full bg-[#FFFDF5] neo-border neo-shadow rounded-3xl p-3 mb-2.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">
              Today's Overview
            </span>
            <span className="text-[10.5px] font-bold px-2 py-0.5 bg-[#FDE047] neo-border rounded-md text-black">
              {currentWeekday}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Habits Stat */}
            <div className="bg-[#D4F972] neo-border rounded-xl p-2 text-center">
              <span className="text-[9px] font-black uppercase text-black/60 block">
                Habits Done
              </span>
              <span className="text-sm font-black text-black">
                {completedHabitsCount}/{totalHabitsCount}
              </span>
            </div>

            {/* Workout Stat */}
            <div className="bg-[#7DD3FC] neo-border rounded-xl p-2 text-center">
              <span className="text-[9px] font-black uppercase text-black/60 block">
                Activity
              </span>
              <span className="text-sm font-black text-black truncate block">
                {latestWorkout ? latestWorkout.name.split(' ')[0] : 'Rest Day'}
              </span>
            </div>

            {/* Daily Spent */}
            <div className="bg-[#FF85A2] neo-border rounded-xl p-2 text-center">
              <span className="text-[9px] font-black uppercase text-black/60 block">
                Today Spent
              </span>
              <span className="text-sm font-black text-black">
                ₹{todayExpenses > 0 ? todayExpenses.toLocaleString() : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Scrollable Section: 3 Module Summaries */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 pr-0.5 space-y-2.5 pb-1">
        {/* 1. Habit Module Summary */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigateTab('habit')}
          className="w-full bg-[#D4F972] neo-border neo-shadow rounded-2xl p-3.5 cursor-pointer neo-pressable"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg neo-border bg-white flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <h3 className="text-sm font-black text-black">
                Habit Tracker
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-black">
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-black/80">
            <span>
              {completedHabitsCount} of {totalHabitsCount} habits completed today
            </span>
            <span className="font-black text-black">{habitPercentage}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-white neo-border rounded-full mt-2 overflow-hidden p-[1px]">
            <div
              className="h-full bg-[#FDE047] rounded-full transition-all duration-300"
              style={{ width: `${habitPercentage}%` }}
            />
          </div>
        </motion.div>

        {/* 2. Gym Module Summary */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigateTab('gym')}
          className="w-full bg-[#FEF08A] neo-border neo-shadow rounded-2xl p-3.5 cursor-pointer neo-pressable"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg neo-border bg-white flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <h3 className="text-sm font-black text-black">
                Gym Tracker
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-black">
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-black/80 mb-1">
            <span>Weekly Target: {weeklyWorkoutsCount}/{weeklyWorkoutTarget} workouts</span>
            <span className="font-black text-black flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#FF70A6] stroke-[2.5]" />
              Active
            </span>
          </div>

          {latestWorkout && (
            <div className="bg-white/80 neo-border rounded-xl p-2 mt-2 flex items-center justify-between text-xs">
              <span className="font-bold text-black">
                Latest: {latestWorkout.name}
              </span>
              <span className="font-black text-black/60">
                {latestWorkout.duration} • {latestWorkout.date}
              </span>
            </div>
          )}
        </motion.div>

        {/* 3. Budget Module Summary */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigateTab('budget')}
          className="w-full bg-[#DDD6FE] neo-border neo-shadow rounded-2xl p-3.5 cursor-pointer neo-pressable"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg neo-border bg-white flex items-center justify-center">
                <Wallet className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <h3 className="text-sm font-black text-black">
                Budget Tracker
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-black">
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-black/80">
            <div className="bg-white/80 neo-border rounded-xl p-2">
              <span className="text-[9.5px] uppercase font-black text-black/50 block">
                Spent this month
              </span>
              <span className="text-sm font-black text-black">
                ₹{monthlyExpenses.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/80 neo-border rounded-xl p-2">
              <span className="text-[9.5px] uppercase font-black text-black/50 block">
                Remaining Budget
              </span>
              <span className="text-sm font-black text-[#16A34A]">
                ₹{remainingBudget.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
