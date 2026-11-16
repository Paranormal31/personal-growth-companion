import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Habit, Weekday } from './types/habit'
import { INITIAL_HABITS } from './constants/initialHabits'
import { PhoneChassis } from './components/PhoneChassis'
import { Header } from './components/Header'
import { ProgressCard } from './components/ProgressCard'
import { HabitList } from './components/HabitList'
import { SummaryCards } from './components/SummaryCards'
import { BottomNav } from './components/BottomNav'
import { Toast } from './components/Toast'
import { AddHabitModal } from './components/plan/AddHabitModal'

const WEEKDAY_NAMES: Weekday[] = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]

export const App: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Current weekday
  const currentWeekday = WEEKDAY_NAMES[new Date().getDay()]

  // Shared habits persistence in localStorage
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('neo_habits_v2_tracker')
      if (saved) {
        const parsed = JSON.parse(saved)
        return parsed.map((h: Habit, idx: number) => {
          const defaultHabit =
            INITIAL_HABITS.find(
              (init) => init.name.toLowerCase() === h.name.toLowerCase()
            ) || INITIAL_HABITS[idx % INITIAL_HABITS.length]
          return {
            ...defaultHabit,
            ...h,
            activeDays:
              h.activeDays ||
              defaultHabit.activeDays || [
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat',
                'Sun',
              ],
            weeklyCompletions:
              h.weeklyCompletions || defaultHabit.weeklyCompletions,
            startTime: h.startTime || defaultHabit.startTime,
            endTime: h.endTime || defaultHabit.endTime,
            type: h.type || defaultHabit.type || 'task',
          }
        })
      }
    } catch {
      // fallback
    }
    return INITIAL_HABITS
  })

  // Persist habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('neo_habits_v2_tracker', JSON.stringify(habits))
    } catch (e) {
      console.error('Failed to save habits to localStorage', e)
    }
  }, [habits])

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Neo-brutalist celebratory confetti burst
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FDE047', '#D4F972', '#FF70A6', '#56CFE1', '#C7B9FF', '#000000'],
      ticks: 200,
      gravity: 1.1,
      shapes: ['square', 'circle'],
    })
  }

  // Toggle habit completion for today
  const handleToggleHabit = (id: string) => {
    setHabits((prev) => {
      const updated = prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completed
          return {
            ...h,
            completed: nextCompleted,
            streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
            weeklyCompletions: {
              ...(h.weeklyCompletions || {}),
              [currentWeekday]: nextCompleted,
            },
          }
        }
        return h
      })

      const allActiveCompleted = updated
        .filter((h) => h.activeDays.includes(currentWeekday))
        .every((h) => h.completed)

      const prevCompletedCount = prev.filter((h) => h.completed).length
      const newCompletedCount = updated.filter((h) => h.completed).length

      if (allActiveCompleted && newCompletedCount > prevCompletedCount) {
        triggerCelebration()
        setToastMessage('🎉 All habits completed for today! Awesome work!')
      }

      return updated
    })
  }

  // Toggle specific weekday in expanded checklist
  const handleToggleDay = (habitId: string, day: Weekday) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const currentDayState = h.weeklyCompletions?.[day] ?? false
          const nextDayState = !currentDayState
          const isToday = day === currentWeekday

          return {
            ...h,
            weeklyCompletions: {
              ...(h.weeklyCompletions || {}),
              [day]: nextDayState,
            },
            completed: isToday ? nextDayState : h.completed,
            streak: isToday
              ? nextDayState
                ? h.streak + 1
                : Math.max(0, h.streak - 1)
              : h.streak,
          }
        }
        return h
      })
    )
  }

  // Reorder habits via drag-and-drop
  const handleReorderHabits = (newOrder: Habit[]) => {
    setHabits(newOrder)
  }

  // Add new habit
  const handleAddHabit = (newHabitData: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      weeklyCompletions: {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      },
    }
    setHabits((prev) => [...prev, newHabit])
    setToastMessage(`Added "${newHabit.name}" to your habits!`)
  }

  // Demo controls
  const handleResetDemo = () => {
    setHabits(INITIAL_HABITS)
  }

  const handleCompleteAll = () => {
    setHabits((prev) =>
      prev.map((h) => ({
        ...h,
        completed: true,
        streak: h.completed ? h.streak : h.streak + 1,
        weeklyCompletions: {
          ...(h.weeklyCompletions || {}),
          [currentWeekday]: true,
        },
      }))
    )
    triggerCelebration()
  }

  const handleClearAll = () => {
    setHabits((prev) =>
      prev.map((h) => ({
        ...h,
        completed: false,
        streak: h.completed ? Math.max(0, h.streak - 1) : h.streak,
        weeklyCompletions: {
          ...(h.weeklyCompletions || {}),
          [currentWeekday]: false,
        },
      }))
    )
  }

  const handlePlaceholderClick = (tabName: string, desc: string) => {
    setToastMessage(`📍 ${tabName} coming soon: ${desc}`)
  }

  const handleViewAllClick = () => {
    setToastMessage(`Showing all ${habits.length} habits for today.`)
  }

  // Filter habits scheduled for today
  const activeTodayHabits = habits.filter((h) =>
    h.activeDays.includes(currentWeekday)
  )

  // Stats calculation
  const completedCount = activeTodayHabits.filter((h) => h.completed).length
  const currentStreakDays = 7
  const completionPercentage = 79

  return (
    <PhoneChassis>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Main Habit Tracker View */}
      <div className="flex flex-col h-full justify-between overflow-hidden select-none">
        {/* Top Fixed Section */}
        <div className="shrink-0">
          {/* 1. Header with Habit Tracker heading, subtitle, and top-right yellow Plus button */}
          <Header
            onOpenAddHabit={() => setIsAddModalOpen(true)}
            onResetDemo={handleResetDemo}
            onCompleteAll={handleCompleteAll}
            onClearAll={handleClearAll}
            onNotify={(msg) => setToastMessage(msg)}
          />

          {/* 2. Today's Progress Card with Counter, Mini Indicators, and Retro Flower Mascot */}
          <ProgressCard habits={activeTodayHabits} />
        </div>

        {/* 3. Middle Scrollable Section: Today's Habits with Drag-and-Drop Reordering */}
        <HabitList
          habits={activeTodayHabits}
          onReorder={handleReorderHabits}
          onToggle={handleToggleHabit}
          onToggleDay={handleToggleDay}
          onViewAllClick={handleViewAllClick}
        />

        {/* 4. Bottom Fixed Section: Summary Cards & Bottom Nav */}
        <div className="shrink-0 mt-2">
          {/* Summary Cards: Current Streak (7 days) & This Week (79%) */}
          <SummaryCards
            currentStreakDays={currentStreakDays}
            completionPercentage={completionPercentage}
          />

          {/* Bottom Navigation with 5 tabs in exact order: Habit, Gym, Home, Budget, Profile */}
          <BottomNav onPlaceholderClick={handlePlaceholderClick} />
        </div>
      </div>

      {/* Add New Habit Modal (Preserved & Enhanced) */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={handleAddHabit}
      />
    </PhoneChassis>
  )
}

export default App
