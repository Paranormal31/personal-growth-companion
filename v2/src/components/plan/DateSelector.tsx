import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface DateSelectorProps {
  currentDate: Date
  onPrevDay: () => void
  onNextDay: () => void
  onResetToday: () => void
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  currentDate,
  onPrevDay,
  onNextDay,
  onResetToday,
}) => {
  // Format as "Thu, Oct 30"
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const isToday =
    new Date().toDateString() === currentDate.toDateString()

  return (
    <div className="w-full bg-[#DDD6FE] neo-border neo-shadow rounded-2xl px-4 py-2.5 flex items-center justify-between mt-3 shrink-0 select-none">
      {/* Previous Day Button */}
      <button
        onClick={onPrevDay}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 neo-pressable cursor-pointer"
        aria-label="Previous day"
      >
        <ArrowLeft className="w-5 h-5 text-black stroke-[2.6]" />
      </button>

      {/* Center Date Display */}
      <button
        onClick={onResetToday}
        title={isToday ? 'Showing Today' : 'Click to jump to Today'}
        className="text-[16px] font-black text-black tracking-tight flex items-center gap-1.5 cursor-pointer hover:opacity-80"
      >
        <span>{formattedDate}</span>
        {isToday && (
          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-[#FDE047] neo-border rounded-md">
            Today
          </span>
        )}
      </button>

      {/* Next Day Button */}
      <button
        onClick={onNextDay}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 neo-pressable cursor-pointer"
        aria-label="Next day"
      >
        <ArrowRight className="w-5 h-5 text-black stroke-[2.6]" />
      </button>
    </div>
  )
}
