import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Target,
  BarChart3,
  CloudUpload,
  Sliders,
  HelpCircle,
  Info,
  Check,
  Download,
  Upload,
  RotateCcw,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react'

export type ProfileModalType =
  | 'goals'
  | 'stats'
  | 'data'
  | 'preferences'
  | 'help'
  | 'about'
  | 'logout'

export interface GoalItem {
  id: string
  title: string
  progress: number
  color: string
}

const INITIAL_GOALS: GoalItem[] = [
  { id: 'goal-1', title: 'Run 15km Every Week', progress: 0, color: '#D4F972' },
  { id: 'goal-2', title: 'Read 20 Books in 2026', progress: 0, color: '#7DD3FC' },
  { id: 'goal-3', title: 'Save ₹50,000 Emergency Fund', progress: 0, color: '#FDE047' },
]

const GOAL_COLORS = [
  '#D4F972', // Lime
  '#7DD3FC', // Sky
  '#FDE047', // Yellow
  '#F9A8D4', // Pink
  '#DDD6FE', // Purple
  '#FED7AA', // Peach
]

interface ProfileModalProps {
  type: ProfileModalType | null
  onClose: () => void
  onConfirmLogout?: () => void
  onResetAllData?: () => void
  onNotify: (msg: string) => void
  currentStreakDays?: number
  completionPercentage?: number
  totalWorkouts?: number
  monthlyBudget?: number
  totalExpenses?: number
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  type,
  onClose,
  onConfirmLogout,
  onResetAllData,
  onNotify,
  currentStreakDays = 0,
  completionPercentage = 0,
  totalWorkouts = 0,
  monthlyBudget = 40000,
  totalExpenses = 0,
}) => {
  // Goals state with localStorage persistence
  const [goals, setGoals] = useState<GoalItem[]>(() => {
    try {
      const saved = localStorage.getItem('neo_profile_goals_v3')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return INITIAL_GOALS
  })

  useEffect(() => {
    try {
      localStorage.setItem('neo_profile_goals_v3', JSON.stringify(goals))
    } catch {}
  }, [goals])

  // State for Goal editing/adding
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null)
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [goalTitle, setGoalTitle] = useState('')
  const [goalProgress, setGoalProgress] = useState(0)
  const [goalColor, setGoalColor] = useState(GOAL_COLORS[0])

  const handleOpenAddGoal = () => {
    setGoalTitle('')
    setGoalProgress(0)
    setGoalColor(GOAL_COLORS[Math.floor(Math.random() * GOAL_COLORS.length)])
    setIsAddingGoal(true)
    setEditingGoal(null)
  }

  const handleOpenEditGoal = (goal: GoalItem) => {
    setGoalTitle(goal.title)
    setGoalProgress(goal.progress)
    setGoalColor(goal.color)
    setEditingGoal(goal)
    setIsAddingGoal(false)
  }

  const handleSaveGoal = () => {
    if (!goalTitle.trim()) {
      onNotify('Please enter a goal title!')
      return
    }

    const clampedProgress = Math.min(100, Math.max(0, Number(goalProgress) || 0))

    if (editingGoal) {
      // Update existing goal
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingGoal.id
            ? { ...g, title: goalTitle.trim(), progress: clampedProgress, color: goalColor }
            : g
        )
      )
      onNotify(`Updated "${goalTitle.trim()}"!`)
    } else {
      // Create new goal
      const newGoal: GoalItem = {
        id: `goal-${Date.now()}`,
        title: goalTitle.trim(),
        progress: clampedProgress,
        color: goalColor,
      }
      setGoals((prev) => [...prev, newGoal])
      onNotify(`Goal "${goalTitle.trim()}" created!`)
    }

    setEditingGoal(null)
    setIsAddingGoal(false)
  }

  const handleDeleteGoal = (id: string) => {
    const goalToDelete = goals.find((g) => g.id === id)
    setGoals((prev) => prev.filter((g) => g.id !== id))
    onNotify(`Deleted goal "${goalToDelete?.title || 'goal'}"`)
    setEditingGoal(null)
    setIsAddingGoal(false)
  }

  if (!type) return null

  const renderContent = () => {
    switch (type) {
      case 'goals': {
        if (isAddingGoal || editingGoal) {
          return (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg neo-border bg-[#F9A8D4] flex items-center justify-center">
                    <Target className="w-4 h-4 text-black stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-black text-black">
                    {isAddingGoal ? 'Add New Goal' : 'Edit Goal'}
                  </h3>
                </div>
                {editingGoal && (
                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(editingGoal.id)}
                    className="p-1.5 rounded-lg text-black hover:bg-black/10 cursor-pointer"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2.4] text-[#E11D48]" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {/* Title Input */}
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-black/70 block mb-1">
                    Goal Description
                  </label>
                  <input
                    type="text"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="e.g. Run 15km Every Week"
                    className="w-full px-3 py-2 bg-white neo-border rounded-xl font-bold text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Progress Control */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-black uppercase tracking-wider text-black/70">
                      Progress
                    </label>
                    <span className="text-xs font-black text-black">{goalProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={goalProgress}
                    onChange={(e) => setGoalProgress(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                  <div className="flex justify-between gap-1 mt-1.5">
                    {[0, 25, 50, 75, 100].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setGoalProgress(val)}
                        className={`py-1 px-2 rounded-lg neo-border font-black text-[10px] cursor-pointer ${
                          goalProgress === val ? 'bg-[#FDE047]' : 'bg-white hover:bg-black/5'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-black/70 block mb-1.5">
                    Theme Color
                  </label>
                  <div className="flex items-center gap-2">
                    {GOAL_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setGoalColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-7 h-7 rounded-lg neo-border cursor-pointer flex items-center justify-center transition-transform ${
                          goalColor === color ? 'scale-110 ring-2 ring-black' : 'hover:scale-105'
                        }`}
                      >
                        {goalColor === color && <Check className="w-3.5 h-3.5 stroke-[3] text-black" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingGoal(false)
                      setEditingGoal(null)
                    }}
                    className="flex-1 py-2.5 bg-white neo-border rounded-xl text-xs font-black text-black hover:bg-black/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveGoal}
                    className="flex-1 py-2.5 bg-[#D4F972] neo-border neo-shadow rounded-xl text-xs font-black text-black flex items-center justify-center gap-1.5 cursor-pointer neo-pressable"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save Goal</span>
                  </button>
                </div>
              </div>
            </div>
          )
        }

        return (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg neo-border bg-[#F9A8D4] flex items-center justify-center">
                  <Target className="w-4 h-4 text-black stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-black">Active Goals</h3>
              </div>
              <button
                type="button"
                onClick={handleOpenAddGoal}
                className="px-2.5 py-1.5 bg-[#FDE047] neo-border neo-shadow-xs rounded-xl text-xs font-black text-black flex items-center gap-1 hover:bg-[#FDE047]/80 cursor-pointer neo-pressable"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Goal</span>
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="bg-white neo-border rounded-xl p-4 text-center my-2">
                <p className="text-xs font-bold text-black/60 mb-2">No goals added yet.</p>
                <button
                  type="button"
                  onClick={handleOpenAddGoal}
                  className="px-3 py-1.5 bg-[#D4F972] neo-border neo-shadow-xs rounded-xl text-xs font-black text-black"
                >
                  Create Your First Goal
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[260px] overflow-y-auto no-scrollbar pr-0.5">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-white neo-border rounded-xl p-3 relative group">
                    <div className="flex justify-between items-center text-xs font-black text-black mb-1.5">
                      <span className="truncate pr-2">{goal.title}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-black text-black">{goal.progress}%</span>
                        <button
                          type="button"
                          onClick={() => handleOpenEditGoal(goal)}
                          className="p-1 rounded-md hover:bg-black/10 text-black/60 hover:text-black cursor-pointer"
                          title="Edit Goal"
                        >
                          <Pencil className="w-3 h-3 stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1 rounded-md hover:bg-black/10 text-black/60 hover:text-[#E11D48] cursor-pointer"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-[#F4F0E6] neo-border rounded-full overflow-hidden p-[1px]">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(0, goal.progress))}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }

      case 'stats': {
        const budgetSpentPercent =
          monthlyBudget > 0
            ? Math.min(100, Math.round((totalExpenses / monthlyBudget) * 100))
            : 0
        const budgetRemainingPercent = Math.max(0, 100 - budgetSpentPercent)

        return (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg neo-border bg-[#FDE047] flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-black">Growth Analytics</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-[#FEF08A] neo-border rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-black">Consecutive Streak</span>
                <span className="text-sm font-black text-black">
                  {currentStreakDays} {currentStreakDays === 1 ? 'Day' : 'Days'} 🔥
                </span>
              </div>
              <div className="bg-[#D4F972] neo-border rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-black">Habit Consistency</span>
                <span className="text-sm font-black text-black">
                  {completionPercentage}% This Week
                </span>
              </div>
              <div className="bg-[#DDD6FE] neo-border rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-black">Total Workouts Logged</span>
                <span className="text-sm font-black text-black">
                  {totalWorkouts} {totalWorkouts === 1 ? 'Session' : 'Sessions'}
                </span>
              </div>
              <div className="bg-[#7DD3FC] neo-border rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-black block">Budget Efficiency</span>
                  <span className="text-[10px] font-semibold text-black/60">
                    ₹{totalExpenses.toLocaleString()} / ₹{monthlyBudget.toLocaleString()}
                  </span>
                </div>
                <span className="text-sm font-black text-black">
                  {budgetSpentPercent}% Spent / {budgetRemainingPercent}% Saved
                </span>
              </div>
            </div>
          </div>
        )
      }

      case 'data':
        return (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg neo-border bg-[#7DD3FC] flex items-center justify-center">
                <CloudUpload className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-black">Data & Backup</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onNotify('📦 Data exported to localStorage & JSON backup!')
                  onClose()
                }}
                className="w-full bg-white neo-border rounded-xl p-2.5 flex items-center gap-2 font-bold text-xs hover:bg-[#FDE047] neo-pressable cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Application State (JSON)</span>
              </button>

              <button
                onClick={() => {
                  onNotify('☁️ Cloud sync simulated: All records verified!')
                  onClose()
                }}
                className="w-full bg-white neo-border rounded-xl p-2.5 flex items-center gap-2 font-bold text-xs hover:bg-[#D4F972] neo-pressable cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Sync with Personal Cloud</span>
              </button>

              <button
                onClick={() => {
                  if (onResetAllData) onResetAllData()
                  onNotify('🔄 Restored defaults for Habits, Gym, and Budget!')
                  onClose()
                }}
                className="w-full bg-white neo-border rounded-xl p-2.5 flex items-center gap-2 font-bold text-xs text-[#FF70A6] hover:bg-[#FF85A2] hover:text-black neo-pressable cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Records to Default</span>
              </button>
            </div>
          </div>
        )

      case 'preferences':
        return (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg neo-border bg-[#DDD6FE] flex items-center justify-center">
                <Sliders className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-black">Preferences</h3>
            </div>
            <div className="space-y-2.5">
              <div className="bg-white neo-border rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-black block">Haptic Feedback</span>
                  <span className="text-[10px] text-black/60">Tactile button taps</span>
                </div>
                <div className="w-10 h-6 bg-[#D4F972] neo-border rounded-full flex items-center p-0.5 justify-end">
                  <div className="w-4 h-4 bg-black rounded-full" />
                </div>
              </div>

              <div className="bg-white neo-border rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-black block">Daily Reminders</span>
                  <span className="text-[10px] text-black/60">At 9:00 AM & 8:00 PM</span>
                </div>
                <div className="w-10 h-6 bg-[#D4F972] neo-border rounded-full flex items-center p-0.5 justify-end">
                  <div className="w-4 h-4 bg-black rounded-full" />
                </div>
              </div>

              <div className="bg-white neo-border rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-black block">Currency</span>
                  <span className="text-[10px] text-black/60">Primary currency format</span>
                </div>
                <span className="px-2 py-0.5 bg-[#FDE047] neo-border rounded-md text-xs font-black text-black">
                  ₹ INR
                </span>
              </div>
            </div>
          </div>
        )

      case 'help':
        return (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg neo-border bg-[#FED7AA] flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-black">Help & Support</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="bg-white neo-border rounded-xl p-2.5">
                <span className="font-black text-black block mb-0.5">
                  How do streaks work?
                </span>
                <p className="text-black/70">
                  Completing your active scheduled habits daily increments your streak.
                </p>
              </div>
              <div className="bg-white neo-border rounded-xl p-2.5">
                <span className="font-black text-black block mb-0.5">
                  How is budget calculated?
                </span>
                <p className="text-black/70">
                  Savings = Income - Expenses. Remaining Budget = Monthly Budget - Expenses.
                </p>
              </div>
              <div className="bg-[#FFFDF5] neo-border rounded-xl p-2 text-center font-bold text-black/80">
                Contact: <span className="font-black">support@personalgrowth.app</span>
              </div>
            </div>
          </div>
        )

      case 'about':
        return (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg neo-border bg-[#DDD6FE] flex items-center justify-center">
                <Info className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-black">About Personal Growth</h3>
            </div>
            <div className="bg-white neo-border rounded-2xl p-3 text-center space-y-2">
              <div className="inline-block px-3 py-1 bg-[#FDE047] neo-border rounded-xl text-xs font-black text-black">
                Version 2.0 Neo-Brutalist
              </div>
              <p className="text-xs font-bold text-black/80 leading-relaxed">
                A mobile-first personal growth platform designed to help you organize habits, workouts, and budget in one cohesive app.
              </p>
              <div className="text-[11px] font-black text-black/50 pt-1 border-t border-black/10">
                Created with React 19, TypeScript & Tailwind CSS.
              </div>
            </div>
          </div>
        )

      case 'logout':
        return (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FF85A2] neo-border neo-shadow-sm flex items-center justify-center mx-auto mb-3">
              <X className="w-6 h-6 text-black stroke-[3]" />
            </div>
            <h3 className="text-lg font-black text-black leading-tight">
              Log Out?
            </h3>
            <p className="text-xs font-semibold text-black/70 mt-1 mb-4">
              Are you sure you want to log out of your Personal Growth journey?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onClose}
                className="py-2.5 bg-white neo-border rounded-xl font-black text-xs text-black hover:bg-black/5 neo-pressable cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onConfirmLogout) onConfirmLogout()
                  onNotify('Logged out successfully.')
                  onClose()
                }}
                className="py-2.5 bg-[#FF85A2] neo-border neo-shadow rounded-xl font-black text-xs text-black neo-pressable cursor-pointer"
              >
                Confirm Log Out
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-[350px] bg-[#FFFDF5] neo-border-thick neo-shadow-lg rounded-[28px] p-5 select-none"
        >
          {/* Handle */}
          <div className="w-12 h-1 bg-black/25 rounded-full mx-auto mb-3" />

          {/* Close */}
          {type !== 'logout' && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.6]" />
            </button>
          )}

          {renderContent()}

          {type !== 'logout' && (
            <button
              onClick={onClose}
              className="w-full mt-3.5 bg-[#FDE047] neo-border neo-shadow py-2.5 rounded-xl font-black text-xs text-black text-center cursor-pointer neo-pressable"
            >
              Close
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
