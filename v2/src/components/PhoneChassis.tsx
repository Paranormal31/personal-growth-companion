import React from 'react'

interface PhoneChassisProps {
  children: React.ReactNode
}

export const PhoneChassis: React.FC<PhoneChassisProps> = ({ children }) => {
  return (
    <div className="h-[100dvh] w-full bg-[#FFFDF5] sm:bg-[#F4F0E6] flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4 overflow-hidden select-none">
      {/* Phone Mockup Shell */}
      <div className="relative w-full max-w-full sm:max-w-[420px] bg-[#FFFDF5] border-0 sm:border-[3.5px] sm:border-black rounded-none sm:rounded-[44px] sm:neo-shadow-phone flex flex-col overflow-hidden h-[100dvh] sm:h-[844px]">
        {/* Inner Screen Viewport: Starts directly with profile and notification buttons */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 px-4.5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pt-4 sm:pb-3.5">
          {children}
        </div>
      </div>

      {/* Decorative desktop Neo-Brutalist badge */}
      <div className="hidden sm:flex items-center gap-3 mt-3 text-xs font-black uppercase tracking-wider text-black/50 select-none">
        <span className="px-2.5 py-0.5 bg-[#FDE047] neo-border neo-shadow-sm rounded-md text-black">
          Neo-Brutalism v2
        </span>
        <span>•</span>
        <span>Habit Tracker</span>
      </div>
    </div>
  )
}
