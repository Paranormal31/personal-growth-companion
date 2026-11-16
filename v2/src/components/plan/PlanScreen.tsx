import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Habit, Weekday } from '../../types/habit'
import { PlanHeader } from './PlanHeader'
import { TopNavTabs } from './TopNavTabs'
import { DateSelector } from './DateSelector'
import { ScheduleList } from './ScheduleList'
import { HabitSchedulesCard } from './HabitSchedulesCard'
import { AddHabitModal } from './AddHabitModal'
import { HabitScheduleDrawer } from './HabitScheduleDrawer'
import { BottomNav } from '../BottomNav'

interface PlanScreenProps {
  habits: Habit[]
  onToggleHabit: (id: string, dateStr?: string) => void
  onAddHabit: (newHabit: Omit<Habit, 'id'>) => void
  onResetDemo: () => void
  onCompleteAll: () => void
  onClearAll: () => void
  onNavigate: (screen: 'home' | 'schedule') => void
  onNotify: (msg: string) => void
}

const WEEKDAY_MAP: Weekday[] = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
]

export const PlanScreen: React.FC<PlanScreenProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  onResetDemo,
  onCompleteAll,
  onClearAll,
  onNavigate,
  onNotify,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Determine weekday and date string
  const currentWeekday = WEEKDAY_MAP[selectedDate.getDay()]
  const selectedDateStr = selectedDate.toISOString().split('T')[0]

  // Date Navigation
  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const next = new Date(prev)
      next.setDate(prev.getDate() - 1)
      return next
    })
  }

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const next = new Date(prev)
      next.setDate(prev.getDate() + 1)
      return next
    })
  }

  const handleResetToday = () => {
    setSelectedDate(new Date())
    onNotify("Jumped to today's schedule.")
  }

  // Jump to specific weekday in the current week
  const handleSelectWeekday = (targetDay: Weekday) => {
    const currentDayIdx = selectedDate.getDay()
    const targetIdx = WEEKDAY_MAP.indexOf(targetDay)
    const diff = targetIdx - currentDayIdx
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + diff)
    setSelectedDate(newDate)
  }

  // Filter habits active on selected day
  const activeHabits = habits.filter((h) =>
    h.activeDays.includes(currentWeekday)
  )

  const handlePlaceholderTab = (tabName: string) => {
    onNotify(`📍 ${tabName} is a visual placeholder per scope.`)
  }

  return (
    <div className="flex flex-col h-full justify-between overflow-hidden select-none">
      {/* 1. TOP FIXED SECTION: Header, Top Tabs, Date Selector */}
      <div className="shrink-0">
        <PlanHeader
          onResetDemo={onResetDemo}
          onCompleteAll={onCompleteAll}
          onClearAll={onClearAll}
          onNotify={onNotify}
        />

        <TopNavTabs onPlaceholderClick={handlePlaceholderTab} />

        <DateSelector
          currentDate={selectedDate}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onResetToday={handleResetToday}
        />
      </div>

      {/* 2. MIDDLE SCROLLABLE SECTION: Only the Today's Schedule habits scroll */}
      <ScheduleList
        habits={activeHabits}
        selectedDateStr={selectedDateStr}
        onToggle={(id) => onToggleHabit(id, selectedDateStr)}
      />

      {/* 3. BOTTOM FIXED SECTION: Habit Schedules, + Add Habit, and Bottom Nav */}
      <div className="shrink-0 mt-2">
        <HabitSchedulesCard
          selectedWeekday={currentWeekday}
          onSelectWeekday={handleSelectWeekday}
          onOpenScheduleDrawer={() => setIsDrawerOpen(true)}
        />

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-2.5 bg-[#FDE047] neo-border neo-shadow rounded-2xl flex items-center justify-center gap-1.5 font-black text-[14px] text-black neo-pressable cursor-pointer mt-2"
          aria-label="Add Habit"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Add Habit</span>
        </button>

        {/* Bottom Navigation is permanently anchored here */}
        <BottomNav
          onPlaceholderClick={(name, desc) =>
            onNotify(`📍 ${name} coming soon: ${desc}`)
          }
        />
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={(newHabit) => {
          onAddHabit(newHabit)
          onNotify(`Added "${newHabit.name}" to your habits!`)
        }}
      />

      {/* Habit Schedule Inspection Drawer */}
      <HabitScheduleDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        habits={habits}
      />
    </div>
  )
}
