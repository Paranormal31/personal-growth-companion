import React from 'react'
import { CheckSquare, Dumbbell, Home, Wallet, User } from 'lucide-react'

interface BottomNavProps {
  onPlaceholderClick: (name: string, description: string) => void
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onPlaceholderClick,
}) => {
  return (
    <nav className="w-full mt-2 select-none shrink-0" aria-label="Bottom Navigation">
      <div className="w-full bg-white neo-border neo-shadow rounded-2xl px-2 py-1.5 flex items-center justify-between">
        {/* 1. Habit Tab (Active) */}
        <button
          className="w-11 h-10 bg-[#FDE047] neo-border rounded-xl flex items-center justify-center neo-pressable neo-shadow-sm cursor-pointer"
          aria-label="Habits Screen (Active)"
        >
          {/* Rounded checkbox icon matching the reference */}
          <div className="w-6 h-6 rounded-md border-2 border-black flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-black stroke-[3]" />
          </div>
        </button>

        {/* 2. Gym Tab (Placeholder) */}
        <button
          onClick={() =>
            onPlaceholderClick(
              'Gym',
              'Workout logging, exercise history & fitness progress'
            )
          }
          className="w-10 h-10 flex items-center justify-center text-black hover:opacity-75 neo-pressable cursor-pointer"
          aria-label="Gym Screen (Placeholder)"
        >
          <Dumbbell className="w-5 h-5 text-black stroke-[2.2]" />
        </button>

        {/* 3. Home Tab (Central - replaces previous Plus button) */}
        <button
          onClick={() =>
            onPlaceholderClick(
              'Home',
              'Overview connecting Habits, Gym, and Budget'
            )
          }
          className="w-10 h-10 flex items-center justify-center text-black hover:opacity-75 neo-pressable cursor-pointer"
          aria-label="Home Overview (Placeholder)"
        >
          <Home className="w-5 h-5 text-black stroke-[2.2]" />
        </button>

        {/* 4. Budget Tab (Placeholder) */}
        <button
          onClick={() =>
            onPlaceholderClick(
              'Budget',
              'Income, expenses, savings & financial tracking'
            )
          }
          className="w-10 h-10 flex items-center justify-center text-black hover:opacity-75 neo-pressable cursor-pointer"
          aria-label="Budget Screen (Placeholder)"
        >
          <Wallet className="w-5 h-5 text-black stroke-[2.2]" />
        </button>

        {/* 5. Profile Tab (Placeholder) */}
        <button
          onClick={() =>
            onPlaceholderClick(
              'Profile',
              'Personal settings, preferences & application configs'
            )
          }
          className="w-10 h-10 flex items-center justify-center text-black hover:opacity-75 neo-pressable cursor-pointer"
          aria-label="Profile Screen (Placeholder)"
        >
          <User className="w-5 h-5 text-black stroke-[2.2]" />
        </button>
      </div>
    </nav>
  )
}
