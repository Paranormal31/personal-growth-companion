import React from 'react'
import { Home, Calendar, Plus, BarChart2, User } from 'lucide-react'

interface BottomNavProps {
  activeScreen?: 'home' | 'schedule'
  onNavigate: (screen: 'home' | 'schedule') => void
  onPlaceholderClick: (name: string) => void
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen = 'home',
  onNavigate,
  onPlaceholderClick,
}) => {
  return (
    <nav className="w-full mt-3 select-none shrink-0" aria-label="Bottom Navigation">
      <div className="w-full bg-white neo-border neo-shadow rounded-2xl px-2.5 py-1.5 flex items-center justify-between">
        {/* Home Tab */}
        <button
          onClick={() => onNavigate('home')}
          className={`w-11 h-10 rounded-xl flex items-center justify-center neo-pressable cursor-pointer ${
            activeScreen === 'home'
              ? 'bg-[#FDE047] neo-border neo-shadow-sm font-black'
              : 'text-black hover:opacity-75'
          }`}
          aria-label="Home Screen"
        >
          <Home className="w-5 h-5 text-black stroke-[2.5]" />
        </button>

        {/* Calendar / Schedule Tab (Active on Screen 2) */}
        <button
          onClick={() => onNavigate('schedule')}
          className={`w-11 h-10 rounded-xl flex items-center justify-center neo-pressable cursor-pointer ${
            activeScreen === 'schedule'
              ? 'bg-[#FDE047] neo-border neo-shadow-sm font-black'
              : 'text-black hover:opacity-75'
          }`}
          aria-label="Plan & Schedule Screen"
        >
          <Calendar className="w-5 h-5 text-black stroke-[2.4]" />
        </button>

        {/* Add Tab (+) - Placeholder per User Decision */}
        <button
          onClick={() => onPlaceholderClick('Add')}
          className="w-10 h-10 bg-white neo-border neo-shadow-sm rounded-xl flex items-center justify-center neo-pressable cursor-pointer"
          aria-label="Add Habit (Placeholder)"
        >
          <Plus className="w-5 h-5 text-black stroke-[3]" />
        </button>

        {/* Analytics Tab (Placeholder) */}
        <button
          onClick={() => onPlaceholderClick('Analytics')}
          className="w-10 h-10 flex items-center justify-center text-black hover:opacity-75 neo-pressable cursor-pointer"
          aria-label="Analytics (Placeholder)"
        >
          <BarChart2 className="w-5 h-5 text-black stroke-[2.2]" />
        </button>

        {/* Profile Tab (Placeholder) */}
        <button
          onClick={() => onPlaceholderClick('Profile')}
          className="w-10 h-10 flex items-center justify-center text-black hover:opacity-75 neo-pressable cursor-pointer"
          aria-label="Profile (Placeholder)"
        >
          <User className="w-5 h-5 text-black stroke-[2.2]" />
        </button>
      </div>
    </nav>
  )
}
