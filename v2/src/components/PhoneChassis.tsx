import React from 'react'
import { Wifi } from 'lucide-react'

interface PhoneChassisProps {
  children: React.ReactNode
}

export const PhoneChassis: React.FC<PhoneChassisProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#F4F0E6] flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4">
      {/* Phone Mockup Shell */}
      <div className="relative w-full max-w-[400px] bg-[#FFFDF5] border-0 sm:border-[3.5px] sm:border-black rounded-none sm:rounded-[44px] sm:neo-shadow-phone flex flex-col overflow-hidden h-screen sm:h-[844px]">
        {/* iOS Status Bar (Fixed at top) */}
        <div className="w-full pt-3 pb-1 px-6 flex items-center justify-between select-none shrink-0 bg-transparent z-20">
          {/* Time */}
          <span className="text-[14px] font-black text-black tracking-tight">
            9:41
          </span>

          {/* Dynamic Island */}
          <div className="w-24 h-4 bg-black rounded-full" />

          {/* Status Icons: Cellular, Wifi, Battery */}
          <div className="flex items-center gap-1.5 text-black">
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-[3px] h-1 bg-black rounded-xs" />
              <span className="w-[3px] h-1.5 bg-black rounded-xs" />
              <span className="w-[3px] h-2 bg-black rounded-xs" />
              <span className="w-[3px] h-2.5 bg-black rounded-xs" />
            </div>

            <Wifi className="w-3.5 h-3.5 stroke-[2.8]" />

            <div className="w-5 h-2.5 border-[1.8px] border-black rounded-[4px] p-[1px] flex items-center">
              <div className="w-full h-full bg-black rounded-[1.5px]" />
            </div>
          </div>
        </div>

        {/* Inner Screen Viewport (Fixed container, children manage internal scroll) */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 px-4.5 pt-0.5 pb-1">
          {children}
        </div>

        {/* Bottom Home Indicator Bar (Fixed at bottom) */}
        <div className="w-full pt-1.5 pb-2 flex justify-center shrink-0 bg-[#FFFDF5] select-none z-20">
          <div className="w-32 h-1.5 bg-black rounded-full" />
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
