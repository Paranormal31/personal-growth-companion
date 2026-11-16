import React from 'react'
import { CheckSquare, Dumbbell, Home, Wallet, User } from 'lucide-react'

export type NavTab = 'habit' | 'gym' | 'home' | 'budget' | 'profile'

interface BottomNavProps {
  activeTab?: NavTab
  onSelectTab?: (tab: NavTab) => void
  onPlaceholderClick?: (name: string, description: string) => void
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab = 'habit',
  onSelectTab,
  onPlaceholderClick,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'habit',
      label: 'Habits',
      icon: <CheckSquare className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      id: 'gym',
      label: 'Gym',
      icon: <Dumbbell className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: <Wallet className="w-5 h-5 text-black stroke-[2.4]" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5 text-black stroke-[2.4]" />,
    },
  ]

  const handleTabClick = (tabId: NavTab, label: string) => {
    if (onSelectTab) {
      onSelectTab(tabId)
    } else if (onPlaceholderClick) {
      onPlaceholderClick(label, `${label} screen`)
    }
  }

  return (
    <nav className="w-full mt-2 select-none shrink-0" aria-label="Bottom Navigation">
      <div className="w-full bg-white neo-border neo-shadow rounded-2xl px-2 py-1.5 flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          if (isActive) {
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id, tab.label)}
                className="w-11 h-10 bg-[#FDE047] neo-border rounded-xl flex items-center justify-center neo-pressable neo-shadow-sm cursor-pointer"
                aria-label={`${tab.label} Screen (Active)`}
              >
                {tab.icon}
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id, tab.label)}
              className="w-10 h-10 flex items-center justify-center text-black hover:opacity-75 neo-pressable cursor-pointer"
              aria-label={`${tab.label} Screen`}
            >
              {tab.icon}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
