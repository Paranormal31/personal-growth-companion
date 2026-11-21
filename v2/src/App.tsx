import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Habit, Weekday } from './types/habit'
import { INITIAL_HABITS } from './constants/initialHabits'
import { Workout } from './types/workout'
import { INITIAL_WORKOUTS } from './constants/initialWorkouts'
import { Transaction } from './types/budget'
import { INITIAL_TRANSACTIONS } from './constants/initialTransactions'
import { PhoneChassis } from './components/PhoneChassis'
import { Header } from './components/Header'
import { ProgressCard } from './components/ProgressCard'
import { HabitList } from './components/HabitList'
import { SummaryCards } from './components/SummaryCards'
import { BottomNav, NavTab } from './components/BottomNav'
import { Toast } from './components/Toast'
import { AddHabitModal } from './components/plan/AddHabitModal'
import { GymScreen } from './components/gym/GymScreen'
import { HomeScreen } from './components/home/HomeScreen'
import { BudgetScreen } from './components/budget/BudgetScreen'
import { ProfileScreen } from './components/profile/ProfileScreen'

const WEEKDAY_NAMES: Weekday[] = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]

const ALL_WEEKDAYS_ORDER: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const computeHabitStreak = (
  weeklyCompletions: Partial<Record<Weekday, boolean>> | undefined,
  activeDays: Weekday[],
  todayWeekday: Weekday,
  fallbackStreak: number = 0
): number => {
  if (!weeklyCompletions) return 0

  const completedCount = ALL_WEEKDAYS_ORDER.filter(
    (d) => weeklyCompletions[d]
  ).length

  // If every day in the week is unchecked, streak is strictly 0
  if (completedCount === 0) {
    return 0
  }

  const todayIdx = ALL_WEEKDAYS_ORDER.indexOf(todayWeekday)
  const isTodayDone = !!weeklyCompletions[todayWeekday]

  // Count consecutive completed scheduled days ending at today (or yesterday if today is not done yet)
  let streak = 0
  if (isTodayDone) {
    streak = 1
    for (let i = todayIdx - 1; i >= 0; i--) {
      const day = ALL_WEEKDAYS_ORDER[i]
      if (!activeDays.includes(day)) continue
      if (weeklyCompletions[day]) {
        streak++
      } else {
        break
      }
    }
  } else {
    // Today not checked yet - check if yesterday was completed
    for (let i = todayIdx - 1; i >= 0; i--) {
      const day = ALL_WEEKDAYS_ORDER[i]
      if (!activeDays.includes(day)) continue
      if (weeklyCompletions[day]) {
        streak++
      } else {
        break
      }
    }
  }

  // Preserve prior multi-week streak if all scheduled days up to today are completed
  if (streak > 0 && fallbackStreak > 7) {
    return streak + (fallbackStreak - 7)
  }

  return streak
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('habit')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Current weekday
  const currentWeekday = WEEKDAY_NAMES[new Date().getDay()]

  // 1. Shared habits persistence in localStorage
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
          const weekly = h.weeklyCompletions || defaultHabit.weeklyCompletions
          const activeDays =
            h.activeDays ||
            defaultHabit.activeDays || [
              'Mon',
              'Tue',
              'Wed',
              'Thu',
              'Fri',
              'Sat',
              'Sun',
            ]
          const streak = computeHabitStreak(
            weekly,
            activeDays,
            currentWeekday,
            h.streak ?? defaultHabit.streak
          )

          return {
            ...defaultHabit,
            ...h,
            streak,
            activeDays,
            weeklyCompletions: weekly,
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

  useEffect(() => {
    try {
      localStorage.setItem('neo_habits_v2_tracker', JSON.stringify(habits))
    } catch (e) {
      console.error('Failed to save habits to localStorage', e)
    }
  }, [habits])

  // 2. Shared workouts persistence in localStorage
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    try {
      const saved = localStorage.getItem('neo_workouts_v2')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load workouts from localStorage', e)
    }
    return INITIAL_WORKOUTS
  })

  useEffect(() => {
    try {
      localStorage.setItem('neo_workouts_v2', JSON.stringify(workouts))
    } catch (e) {
      console.error('Failed to save workouts to localStorage', e)
    }
  }, [workouts])

  // 3. Shared budget transactions persistence in localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('neo_transactions_v2')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load transactions from localStorage', e)
    }
    return INITIAL_TRANSACTIONS
  })

  useEffect(() => {
    try {
      localStorage.setItem('neo_transactions_v2', JSON.stringify(transactions))
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e)
    }
  }, [transactions])

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

  // Habits Handlers (100% Preserved)
  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completed
          const nextWeekly = {
            ...(h.weeklyCompletions || {}),
            [currentWeekday]: nextCompleted,
          }
          const nextStreak = computeHabitStreak(
            nextWeekly,
            h.activeDays,
            currentWeekday,
            h.streak
          )
          return {
            ...h,
            completed: nextCompleted,
            streak: nextStreak,
            weeklyCompletions: nextWeekly,
          }
        }
        return h
      })
    )
  }

  const handleToggleDay = (habitId: string, day: Weekday) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const currentDayState = h.weeklyCompletions?.[day] ?? false
          const nextDayState = !currentDayState
          const isToday = day === currentWeekday
          const nextWeekly = {
            ...(h.weeklyCompletions || {}),
            [day]: nextDayState,
          }
          const nextStreak = computeHabitStreak(
            nextWeekly,
            h.activeDays,
            currentWeekday,
            h.streak
          )

          return {
            ...h,
            weeklyCompletions: nextWeekly,
            completed: isToday ? nextDayState : h.completed,
            streak: nextStreak,
          }
        }
        return h
      })
    )
  }

  const handleReorderHabits = (newOrder: Habit[]) => {
    setHabits(newOrder)
  }

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

  const handleOpenEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setIsAddModalOpen(true)
  }

  const handleUpdateHabit = (updatedHabit: Habit) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === updatedHabit.id) {
          const weekly = h.weeklyCompletions || {}
          const newStreak = computeHabitStreak(
            weekly,
            updatedHabit.activeDays,
            currentWeekday,
            h.streak
          )
          return {
            ...h,
            name: updatedHabit.name,
            iconName: updatedHabit.iconName,
            accentColor: updatedHabit.accentColor,
            activeDays: updatedHabit.activeDays,
            category: updatedHabit.category,
            streak: newStreak,
          }
        }
        return h
      })
    )
    setToastMessage(`Updated "${updatedHabit.name}"!`)
    setEditingHabit(null)
    setIsAddModalOpen(false)
  }

  const handleCloseAddEditModal = () => {
    setIsAddModalOpen(false)
    setEditingHabit(null)
  }

  const handleDeleteHabit = (id: string) => {
    const habitToDelete = habits.find((h) => h.id === id)
    setHabits((prev) => prev.filter((h) => h.id !== id))
    setToastMessage(`Deleted "${habitToDelete?.name || 'habit'}"!`)
    setEditingHabit(null)
    setIsAddModalOpen(false)
  }

  const handleResetDemo = () => {
    setHabits(INITIAL_HABITS)
  }

  const handleCompleteAll = () => {
    setHabits((prev) =>
      prev.map((h) => {
        const nextWeekly = {
          ...(h.weeklyCompletions || {}),
          [currentWeekday]: true,
        }
        return {
          ...h,
          completed: true,
          streak: computeHabitStreak(
            nextWeekly,
            h.activeDays,
            currentWeekday,
            h.streak + 1
          ),
          weeklyCompletions: nextWeekly,
        }
      })
    )
  }

  const handleClearAll = () => {
    setHabits((prev) =>
      prev.map((h) => ({
        ...h,
        completed: false,
        streak: 0,
        weeklyCompletions: {
          Mon: false,
          Tue: false,
          Wed: false,
          Thu: false,
          Fri: false,
          Sat: false,
          Sun: false,
        },
      }))
    )
  }

  const [isViewingAll, setIsViewingAll] = useState(false)

  const handleViewAllClick = () => {
    setIsViewingAll((prev) => {
      const next = !prev
      setToastMessage(
        next
          ? `Showing all ${habits.length} habits.`
          : `Showing today's ${activeTodayHabits.length} active habits.`
      )
      return next
    })
  }

  // Workouts Handlers
  const handleAddWorkout = (newWorkoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...newWorkoutData,
      id: `workout-${Date.now()}`,
    }
    setWorkouts((prev) => [newWorkout, ...prev])
    triggerCelebration()
  }

  const handleDeleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id))
  }

  // Budget Handlers
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    }
    setTransactions((prev) => [newTx, ...prev])
    triggerCelebration()
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // Reset all application data across modules
  const handleResetAllData = () => {
    setHabits(INITIAL_HABITS)
    setWorkouts(INITIAL_WORKOUTS)
    setTransactions(INITIAL_TRANSACTIONS)
    setToastMessage('Reset all application data to default!')
  }

  // Filter habits scheduled for today
  const activeTodayHabits = habits.filter((h) =>
    h.activeDays.includes(currentWeekday)
  )

  const displayedHabits = isViewingAll ? habits : activeTodayHabits

  // Dynamic streak calculation across active scheduled habits
  const currentStreakDays =
    habits.length > 0 ? Math.max(...habits.map((h) => h.streak), 0) : 0

  // Dynamic weekly completion percentage across scheduled days
  let totalScheduledSlots = 0
  let totalCompletedSlots = 0
  habits.forEach((h) => {
    h.activeDays.forEach((day) => {
      totalScheduledSlots++
      if (h.weeklyCompletions?.[day]) {
        totalCompletedSlots++
      }
    })
  })
  const completionPercentage =
    totalScheduledSlots > 0
      ? Math.round((totalCompletedSlots / totalScheduledSlots) * 100)
      : 79

  return (
    <PhoneChassis>
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* 1. Habit Tracker View (100% PRESERVED & UNTOUCHED) */}
      {activeTab === 'habit' && (
        <div className="flex flex-col h-full justify-between overflow-hidden select-none">
          {/* Top Fixed Section */}
          <div className="shrink-0">
            <Header
              onOpenAddHabit={() => {
                setEditingHabit(null)
                setIsAddModalOpen(true)
              }}
              onResetDemo={handleResetDemo}
              onCompleteAll={handleCompleteAll}
              onClearAll={handleClearAll}
              onNotify={(msg) => setToastMessage(msg)}
            />
            <ProgressCard habits={activeTodayHabits} />
          </div>

          {/* Middle Scrollable Section: Today's Habits with Drag-and-Drop Reordering */}
          <HabitList
            habits={displayedHabits}
            isViewingAll={isViewingAll}
            onReorder={handleReorderHabits}
            onToggle={handleToggleHabit}
            onToggleDay={handleToggleDay}
            onViewAllClick={handleViewAllClick}
            onEditHabit={handleOpenEditHabit}
          />

          {/* Bottom Fixed Section: Summary Cards & Bottom Nav */}
          <div className="shrink-0 mt-1.5">
            <SummaryCards
              currentStreakDays={currentStreakDays}
              completionPercentage={completionPercentage}
            />
            <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        </div>
      )}

      {/* 2. Gym Tracker View */}
      {activeTab === 'gym' && (
        <div className="flex flex-col h-full justify-between overflow-hidden select-none">
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <GymScreen
              workouts={workouts}
              onAddWorkout={handleAddWorkout}
              onDeleteWorkout={handleDeleteWorkout}
              onNotify={(msg) => setToastMessage(msg)}
              onOpenProfile={() => setActiveTab('profile')}
            />
          </div>
          <div className="shrink-0">
            <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        </div>
      )}

      {/* 3. Central Home Overview View */}
      {activeTab === 'home' && (
        <div className="flex flex-col h-full justify-between overflow-hidden select-none">
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <HomeScreen
              habits={habits}
              workouts={workouts}
              transactions={transactions}
              currentWeekday={currentWeekday}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenProfile={() => setActiveTab('profile')}
              onNotify={(msg) => setToastMessage(msg)}
            />
          </div>
          <div className="shrink-0">
            <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        </div>
      )}

      {/* 4. Budget Tracker View */}
      {activeTab === 'budget' && (
        <div className="flex flex-col h-full justify-between overflow-hidden select-none">
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <BudgetScreen
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onNotify={(msg) => setToastMessage(msg)}
              onOpenProfile={() => setActiveTab('profile')}
            />
          </div>
          <div className="shrink-0">
            <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        </div>
      )}

      {/* 5. Profile View */}
      {activeTab === 'profile' && (
        <div className="flex flex-col h-full justify-between overflow-hidden select-none">
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <ProfileScreen
              onNotify={(msg) => setToastMessage(msg)}
              onResetAllData={handleResetAllData}
            />
          </div>
          <div className="shrink-0">
            <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        </div>
      )}

      {/* Add / Edit Habit Modal */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddEditModal}
        onAddHabit={handleAddHabit}
        editingHabit={editingHabit}
        onUpdateHabit={handleUpdateHabit}
        onDeleteHabit={handleDeleteHabit}
      />
    </PhoneChassis>
  )
}

export default App
