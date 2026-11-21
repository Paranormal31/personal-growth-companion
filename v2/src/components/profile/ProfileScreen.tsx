import React, { useState } from 'react'
import {
  Flame,
  Target,
  BarChart3,
  CloudUpload,
  Sliders,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Sprout,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { ProfileAvatar } from './ProfileAvatar'
import { ProfileModal, ProfileModalType } from './ProfileModal'

interface ProfileScreenProps {
  onNotify: (msg: string) => void
  onResetAllData?: () => void
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNotify,
  onResetAllData,
}) => {
  const [activeModal, setActiveModal] = useState<ProfileModalType | null>(null)

  const menuItems: {
    id: ProfileModalType
    title: string
    subtitle: string
    color: string
    icon: React.ReactNode
  }[] = [
    {
      id: 'goals',
      title: 'My Goals',
      subtitle: 'Set and track your goals',
      color: 'bg-[#F9A8D4]',
      icon: <Target className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      id: 'stats',
      title: 'Statistics',
      subtitle: 'View your progress across habits',
      color: 'bg-[#FEF08A]',
      icon: <BarChart3 className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      id: 'data',
      title: 'Data & Backup',
      subtitle: 'Sync and manage your data',
      color: 'bg-[#7DD3FC]',
      icon: <CloudUpload className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      id: 'preferences',
      title: 'Preferences',
      subtitle: 'App settings and customisation',
      color: 'bg-[#DDD6FE]',
      icon: <Sliders className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'FAQs, feedback and contact',
      color: 'bg-[#FED7AA]',
      icon: <HelpCircle className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App version and credits',
      color: 'bg-[#DDD6FE]',
      icon: <Info className="w-5 h-5 text-black stroke-[2.4]" />,
    },
  ]

  return (
    <div className="flex flex-col h-full justify-between overflow-hidden select-none">
      {/* Top Fixed Section: Header & User Card & 3 Stats */}
      <div className="shrink-0">
        {/* Header */}
        <header className="relative w-full pt-0.5 pb-2 shrink-0">
          <h1 className="text-[28px] sm:text-[32px] font-black text-black leading-none tracking-tight">
            Profile<span className="text-[#FDE047]">.</span>
          </h1>
          <p className="text-[13px] font-bold text-black/80 mt-1">
            Your space, your progress.
          </p>
        </header>

        {/* User Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveModal('preferences')}
          className="w-full bg-[#DDD6FE] neo-border neo-shadow rounded-3xl p-3 mb-2 flex items-center justify-between cursor-pointer neo-pressable"
        >
          <div className="flex items-center gap-3">
            <ProfileAvatar />
            <div>
              <h2 className="text-base font-black text-black tracking-tight leading-tight">
                Sarthak Naulakha
              </h2>
              <div className="flex items-center gap-1 text-xs font-bold text-black/80 mt-0.5">
                <Sprout className="w-3.5 h-3.5 text-[#16A34A] stroke-[2.5]" />
                <span>Personal Growth Journey</span>
              </div>
            </div>
          </div>

          <div className="w-7 h-7 flex items-center justify-center text-black">
            <ChevronRight className="w-5 h-5 stroke-[2.6]" />
          </div>
        </motion.div>

        {/* 3 Stat Cards side-by-side */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {/* Card 1: 28 Day Streak */}
          <div className="bg-[#FEF08A] neo-border neo-shadow-sm rounded-2xl p-2.5 flex flex-col items-center text-center">
            <Flame className="w-5 h-5 text-black stroke-[2.5] mb-1" />
            <span className="text-xl font-black text-black leading-tight">
              28
            </span>
            <span className="text-[10px] font-black text-black/70 leading-tight">
              Day Streak
            </span>
          </div>

          {/* Card 2: 86% Habit Completion */}
          <div className="bg-[#D4F972] neo-border neo-shadow-sm rounded-2xl p-2.5 flex flex-col items-center text-center">
            <Target className="w-5 h-5 text-black stroke-[2.5] mb-1" />
            <span className="text-xl font-black text-black leading-tight">
              86%
            </span>
            <span className="text-[10px] font-black text-black/70 leading-tight">
              Habit Completion
            </span>
          </div>

          {/* Card 3: 3 Active Goals */}
          <div className="bg-[#F9A8D4] neo-border neo-shadow-sm rounded-2xl p-2.5 flex flex-col items-center text-center">
            <BarChart3 className="w-5 h-5 text-black stroke-[2.5] mb-1" />
            <span className="text-xl font-black text-black leading-tight">
              3
            </span>
            <span className="text-[10px] font-black text-black/70 leading-tight">
              Active Goals
            </span>
          </div>
        </div>
      </div>

      {/* Middle Scrollable Section: 6 Menu Items & Log Out Button */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 pr-0.5 space-y-1.5 pb-1">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setActiveModal(item.id)}
            className="w-full bg-white neo-border neo-shadow rounded-2xl p-2.5 flex items-center justify-between cursor-pointer neo-pressable"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl neo-border flex items-center justify-center shrink-0 ${item.color}`}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="text-xs font-black text-black leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10.5px] font-bold text-black/60 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <div className="w-6 h-6 flex items-center justify-center text-black">
              <ChevronRight className="w-4 h-4 stroke-[2.6]" />
            </div>
          </motion.div>
        ))}

        {/* Log Out Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveModal('logout')}
          className="w-full mt-2 py-3 bg-[#FF85A2] neo-border neo-shadow rounded-2xl flex items-center justify-center gap-2 cursor-pointer neo-pressable"
        >
          <LogOut className="w-4 h-4 text-black stroke-[2.5]" />
          <span className="text-xs font-black text-black uppercase tracking-wider">
            Log Out
          </span>
        </motion.button>
      </div>

      {/* Profile Modals */}
      <ProfileModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
        onResetAllData={onResetAllData}
        onNotify={onNotify}
        onConfirmLogout={() => {
          onNotify('👋 See you next time, Sarthak!')
        }}
      />
    </div>
  )
}
