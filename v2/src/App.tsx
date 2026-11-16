import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Habit } from './types/habit'
import { INITIAL_HABITS } from './constants/initialHabits'
import { PhoneChassis } from './components/PhoneChassis'
import { Header } from './components/Header'
import { ProgressCard } from './components/ProgressCard'
import { HabitList } from './components/HabitList'
import { SummaryCards } from './components/SummaryCards'
import { BottomNav } from './components/BottomNav'
import { Toast } from './components/Toast'
import { PlanScreen } from './components/plan/PlanScreen'

export const App: React.FC = () => {
  // Navigation between Screen 1 (Home) and Screen 2 (Plan & Schedule)
  const [activeScreen, setActiveScreen] = useState<'home' | 'schedule'>('home')

  // Shared habits persistence in localStorage
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('neo_habits_v2')
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

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Persist habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('neo_habits_v2', JSON.stringify(habits))
    } catch (e) {
      console.error('Failed to save habits to localStorage', e)
    }
  }, [habits])

  // Auto-dismiss toast after 3s
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

  // Toggle habit completion (supports optional date string for date-specific tracking)
  const handleToggleHabit = (id: string, dateStr?: string) => {
    const todayStr = new Date().toISOString().split('T')[0]
    const targetDateStr = dateStr || todayStr
    const isTargetToday = targetDateStr === todayStr

    setHabits((prev) => {
      const updated = prev.map((h) => {
        if (h.id === id) {
          const currentCompleted =
            h.completedDates?.[targetDateStr] ?? (isTargetToday ? h.completed : false)
          const nextCompleted = !currentCompleted

          const nextCompletedDates = {
            ...(h.completedDates || {}),
            [targetDateStr]: nextCompleted,
          }

          if (isTargetToday) {
            return {
              ...h,
              completed: nextCompleted,
              streak: nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
              completedDates: nextCompletedDates,
            }
          }

          return {
            ...h,
            completedDates: nextCompletedDates,
          }
        }
        return h
      })

      // Check if all active habits completed for today
      if (isTargetToday) {
        const allCompleted = updated.every((h) => h.completed)
        const previousCompletedCount = prev.filter((h) => h.completed).length
        const newCompletedCount = updated.filter((h) => h.completed).length

        if (allCompleted && newCompletedCount > previousCompletedCount) {
          triggerCelebration()
          setToastMessage('🎉 All habits completed! Fantastic job!')
        }
      }

      return updated
    })
  }

  // Add new habit
  const handleAddHabit = (newHabitData: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
    }
    setHabits((prev) => [...prev, newHabit])
  }

  // Demo controls
  const handleResetDemo = () => {
    setHabits(INITIAL_HABITS)
  }

  const handleCompleteAll = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    setHabits((prev) =>
      prev.map((h) => ({
        ...h,
        completed: true,
        streak: h.completed ? h.streak : h.streak + 1,
        completedDates: {
          ...(h.completedDates || {}),
          [todayStr]: true,
        },
      }))
    )
    triggerCelebration()
  }

  const handleClearAll = () => {
    const todayStr = new Date().toISOString().split('T')[0]
    setHabits((prev) =>
      prev.map((h) => ({
        ...h,
        completed: false,
        streak: h.completed ? Math.max(0, h.streak - 1) : h.streak,
        completedDates: {
          ...(h.completedDates || {}),
          [todayStr]: false,
        },
      }))
    )
  }

  const handlePlaceholderClick = (tabName: string) => {
    setToastMessage(`📍 ${tabName} is a visual placeholder per scope.`)
  }

  const handleViewAllClick = () => {
    setToastMessage(`Showing all ${habits.length} active habits for today.`)
  }

  // Stats calculation for Screen 1
  const completedCount = habits.filter((h) => h.completed).length
  const currentStreakDays = completedCount === habits.length ? 8 : 7
  const completionPercentage = Math.round(
    (completedCount / Math.max(1, habits.length)) * 100 * 0.86 + 14
  )

  return (
    <PhoneChassis>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {activeScreen === 'home' ? (
        /* SCREEN 1: HOME SCREEN (Preserved and fixed layout) */
        <div className="flex flex-col h-full justify-between overflow-hidden select-none">
          {/* Top Fixed Section */}
          <div className="shrink-0">
            <Header
              onResetDemo={handleResetDemo}
              onCompleteAll={handleCompleteAll}
              onClearAll={handleClearAll}
              onNotify={(msg) => setToastMessage(msg)}
            />

            <ProgressCard habits={habits} />
          </div>

          {/* Middle: Habits List (Only list scrolls if items overflow) */}
          <HabitList
            habits={habits}
            onToggle={(id) => handleToggleHabit(id)}
            onViewAllClick={handleViewAllClick}
          />

          {/* Bottom Fixed Section: Summary Cards & Fixed BottomNav */}
          <div className="shrink-0 mt-2">
            <SummaryCards
              currentStreakDays={currentStreakDays}
              completionPercentage={Math.min(100, Math.max(65, completionPercentage))}
            />

            <BottomNav
              activeScreen="home"
              onNavigate={(screen) => setActiveScreen(screen)}
              onPlaceholderClick={handlePlaceholderClick}
            />
          </div>
        </div>
      ) : (
        /* SCREEN 2: PLAN & SCHEDULE SCREEN */
        <PlanScreen
          habits={habits}
          onToggleHabit={handleToggleHabit}
          onAddHabit={handleAddHabit}
          onResetDemo={handleResetDemo}
          onCompleteAll={handleCompleteAll}
          onClearAll={handleClearAll}
          onNavigate={(screen) => setActiveScreen(screen)}
          onNotify={(msg) => setToastMessage(msg)}
        />
      )}
    </PhoneChassis>
  )
}

export default App
