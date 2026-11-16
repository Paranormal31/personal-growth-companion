import React from 'react'
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
} from 'lucide-react'

export type ProfileModalType =
  | 'goals'
  | 'stats'
  | 'data'
  | 'preferences'
  | 'help'
  | 'about'
  | 'logout'

interface ProfileModalProps {
  type: ProfileModalType | null
  onClose: () => void
  onConfirmLogout?: () => void
  onResetAllData?: () => void
  onNotify: (msg: string) => void
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  type,
  onClose,
  onConfirmLogout,
  onResetAllData,
  onNotify,
}) => {
  if (!type) return null

  const renderContent = () => {
    switch (type) {
      case 'goals':
        return (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg neo-border bg-[#F9A8D4] flex items-center justify-center">
                <Target className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black text-black">Active Goals</h3>
            </div>
            <div className="space-y-2.5">
              <div className="bg-white neo-border rounded-xl p-3">
                <div className="flex justify-between items-center text-xs font-black text-black mb-1">
                  <span>Run 15km Every Week</span>
                  <span className="text-[#16A34A]">80%</span>
                </div>
                <div className="w-full h-2 bg-[#F4F0E6] neo-border rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-[#D4F972] rounded-full w-4/5" />
                </div>
              </div>

              <div className="bg-white neo-border rounded-xl p-3">
                <div className="flex justify-between items-center text-xs font-black text-black mb-1">
                  <span>Read 20 Books in 2026</span>
                  <span className="text-[#2563EB]">65%</span>
                </div>
                <div className="w-full h-2 bg-[#F4F0E6] neo-border rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-[#7DD3FC] rounded-full w-[65%]" />
                </div>
              </div>

              <div className="bg-white neo-border rounded-xl p-3">
                <div className="flex justify-between items-center text-xs font-black text-black mb-1">
                  <span>Save ₹50,000 Emergency Fund</span>
                  <span className="text-[#D97706]">90%</span>
                </div>
                <div className="w-full h-2 bg-[#F4F0E6] neo-border rounded-full overflow-hidden p-[1px]">
                  <div className="h-full bg-[#FDE047] rounded-full w-[90%]" />
                </div>
              </div>
            </div>
          </div>
        )

      case 'stats':
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
                <span className="text-sm font-black text-black">28 Days 🔥</span>
              </div>
              <div className="bg-[#D4F972] neo-border rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-black">Habit Consistency</span>
                <span className="text-sm font-black text-black">86% All-time</span>
              </div>
              <div className="bg-[#DDD6FE] neo-border rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-black">Total Workouts Logged</span>
                <span className="text-sm font-black text-black">42 Sessions</span>
              </div>
              <div className="bg-[#7DD3FC] neo-border rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-black">Budget Efficiency</span>
                <span className="text-sm font-black text-black">61% Spent / 39% Saved</span>
              </div>
            </div>
          </div>
        )

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
                  Savings = Income - Expenses. Remaining Budget = ₹40,000 - Expenses.
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
