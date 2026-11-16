import React, { useState } from 'react'
import { X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Habit, Weekday } from '../../types/habit'
import {
  ICON_CATEGORIES,
  COLOR_SWATCHES,
  IconDefinition,
} from '../../constants/icons'

interface AddHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onAddHabit: (habit: Omit<Habit, 'id'>) => void
}

const ALL_WEEKDAYS: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
}) => {
  const [name, setName] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState<
    'common' | 'productivity' | 'wellness' | 'leisure'
  >('common')
  const [selectedIconId, setSelectedIconId] = useState('dumbbell')
  const [selectedColor, setSelectedColor] = useState('#FF70A6') // Pink default
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
  ])

  // Validation feedback state
  const [hasError, setHasError] = useState(false)

  const activeCategory =
    ICON_CATEGORIES.find((c) => c.id === activeCategoryId) || ICON_CATEGORIES[0]

  const toggleDay = (day: Weekday) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day))
      }
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setHasError(true)
      setTimeout(() => setHasError(false), 1200)
      return
    }

    if (selectedDays.length === 0) {
      setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
    }

    onAddHabit({
      name: name.trim(),
      streak: 0,
      completed: false,
      category: activeCategoryId,
      accentColor: selectedColor,
      iconName: selectedIconId,
      activeDays: selectedDays,
      type: 'task',
    })

    // Reset and close
    setName('')
    setSelectedIconId('dumbbell')
    setSelectedColor('#FF70A6')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="w-full max-w-[400px] bg-[#FFFDF5] neo-border-thick neo-shadow-phone rounded-[28px] p-4.5 sm:p-5 relative max-h-[92vh] overflow-y-auto no-scrollbar"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 border-b-2 border-black mb-3">
              <h2 className="text-[20px] font-black text-black tracking-tight">
                Add New Habit
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white neo-border flex items-center justify-center neo-pressable cursor-pointer neo-shadow-sm"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4 text-black stroke-[3]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* 1. HABIT NAME */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-black block mb-1">
                  Habit Name
                </label>
                <motion.input
                  animate={hasError ? { x: [-6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  type="text"
                  placeholder="e.g. Read Book, Morning Run"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (hasError) setHasError(false)
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white neo-border rounded-xl font-bold text-sm text-black placeholder:text-black/40 focus:outline-none transition-colors ${
                    hasError
                      ? 'border-[#FF70A6] ring-2 ring-[#FF70A6] bg-pink-50/40'
                      : 'focus:ring-2 focus:ring-[#FDE047]'
                  }`}
                />
                {hasError && (
                  <span className="text-[11px] font-black text-[#E11D48] mt-1 block">
                    Please enter a habit name to continue.
                  </span>
                )}
              </div>

              {/* 2. SELECT ICON (Full Width with 6-Column Grid) */}
              <div>
                <label className="text-sm font-black text-black block mb-1.5">
                  Select Icon
                </label>
                <div className="bg-white neo-border rounded-2xl p-2.5 flex flex-col">
                  {/* Category Tab Bar (4 distinct categories) */}
                  <div className="flex items-center justify-between gap-1 mb-2.5 bg-[#F4F0E6] rounded-xl border border-black/20 p-1">
                    {ICON_CATEGORIES.map((cat) => {
                      const isActive = cat.id === activeCategoryId
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveCategoryId(cat.id)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black cursor-pointer neo-pressable transition-all text-center ${
                            isActive
                              ? 'bg-[#FDE047] border-[1.8px] border-black neo-shadow-sm text-black'
                              : 'text-black/70 hover:text-black'
                          }`}
                        >
                          {cat.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* 6-Column Icon Grid (2 rows of 6 = 12 icons) */}
                  <div className="grid grid-cols-6 gap-2 justify-items-center">
                    {activeCategory.icons.map((item: IconDefinition) => {
                      const IconComponent = item.component
                      const isSelected = selectedIconId === item.id

                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          whileTap={{ scale: 0.92 }}
                          onClick={() => setSelectedIconId(item.id)}
                          className={`w-11 h-11 rounded-xl border-[1.8px] border-black flex items-center justify-center cursor-pointer neo-pressable relative ${
                            isSelected
                              ? 'border-2 border-black neo-shadow-sm scale-105'
                              : 'bg-white hover:bg-black/5'
                          }`}
                          style={{
                            backgroundColor: isSelected ? selectedColor : '#FFFFFF',
                          }}
                          title={item.label}
                        >
                          <IconComponent className="w-5 h-5 text-black stroke-[2.2]" />

                          {/* Checkmark corner badge when selected */}
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-white border-[1.8px] border-black rounded-full flex items-center justify-center shadow-xs z-10">
                              <Check className="w-2.5 h-2.5 text-black stroke-[3.5]" />
                            </div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 3. COLOR (Full Width, 8 Pastel Colors, 4 per row) */}
              <div>
                <label className="text-sm font-black text-black block mb-1.5">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_SWATCHES.map((color) => {
                    const isSelected = selectedColor === color
                    return (
                      <motion.button
                        key={color}
                        type="button"
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setSelectedColor(color)}
                        className={`h-11 rounded-xl border-2 border-black cursor-pointer neo-pressable relative ${
                          isSelected
                            ? 'scale-105 neo-shadow-sm'
                            : 'opacity-90 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {/* Checkmark corner badge when selected */}
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-white border-[1.8px] border-black rounded-full flex items-center justify-center shadow-xs z-10">
                            <Check className="w-2.5 h-2.5 text-black stroke-[3.5]" />
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* 4. ACTIVE DAYS */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-black block mb-1">
                  Active Days
                </label>
                <div className="flex items-center justify-between gap-1">
                  {ALL_WEEKDAYS.map((day) => {
                    const isActive = selectedDays.includes(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-black neo-pressable cursor-pointer border-[1.8px] border-black transition-all ${
                          isActive
                            ? 'bg-[#FDE047] neo-shadow-sm text-black'
                            : 'bg-white text-black/60 hover:bg-black/5'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 5. BOTTOM ACTIONS: CANCEL & SAVE */}
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-white neo-border neo-shadow-sm rounded-2xl font-black text-xs text-black neo-pressable cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FDE047] neo-border neo-shadow rounded-2xl font-black text-xs text-black neo-pressable flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3.5]" />
                  Save Habit
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
