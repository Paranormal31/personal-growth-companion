import React, { useState } from 'react'
import { BudgetCategory } from '../../types/budget'
import { CATEGORY_COLORS } from '../../constants/initialTransactions'

interface CategoryBreakdownItem {
  category: BudgetCategory
  amount: number
  percentage: number
}

interface CategoryDonutChartProps {
  categoryBreakdown: CategoryBreakdownItem[]
  totalExpenses: number
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  categoryBreakdown,
  totalExpenses,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<BudgetCategory | null>(
    null
  )

  const radius = 54
  const strokeWidth = 26
  const circumference = 2 * Math.PI * radius

  // Compute strokeDasharray offsets
  let accumulatedPercent = 0
  const segments = categoryBreakdown.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
    accumulatedPercent += item.percentage
    return {
      ...item,
      color: CATEGORY_COLORS[item.category] || '#E2E8F0',
      strokeDasharray,
      strokeDashoffset,
    }
  })

  const activeItem = hoveredCategory
    ? categoryBreakdown.find((item) => item.category === hoveredCategory)
    : null

  return (
    <div className="w-full bg-white neo-border neo-shadow rounded-2xl p-3.5 mb-2.5 select-none">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-black">
          Spending by Category
        </h3>
        <span className="text-[11px] font-bold text-black/60">
          8 Categories
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Donut Chart SVG */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg
            width="132"
            height="132"
            viewBox="0 0 140 140"
            className="-rotate-90 overflow-visible"
          >
            {/* Outer decorative ring border */}
            <circle
              cx="70"
              cy="70"
              r={radius + strokeWidth / 2 + 1.5}
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
            />
            {/* Inner decorative ring border */}
            <circle
              cx="70"
              cy="70"
              r={radius - strokeWidth / 2 - 1.5}
              fill="none"
              stroke="#000000"
              strokeWidth="2.5"
            />

            {/* Background base */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {segments.map((seg) => {
              const isHovered = hoveredCategory === seg.category
              return (
                <circle
                  key={seg.category}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredCategory(seg.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              )
            })}
          </svg>

          {/* Center Callout Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-1">
            {activeItem ? (
              <>
                <span className="text-[9px] font-black uppercase tracking-tight text-black/60 line-clamp-1">
                  {activeItem.category}
                </span>
                <span className="text-xs font-black text-black leading-tight">
                  ₹{activeItem.amount.toLocaleString()}
                </span>
                <span className="text-[9px] font-black text-[#FF70A6]">
                  {activeItem.percentage}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[8.5px] font-black uppercase tracking-wider text-black/50">
                  Total Spent
                </span>
                <span className="text-xs font-black text-black leading-tight">
                  ₹{totalExpenses.toLocaleString()}
                </span>
                <span className="text-[8.5px] font-black text-black/60">
                  Nov '26
                </span>
              </>
            )}
          </div>
        </div>

        {/* Categories Legend Grid */}
        <div className="flex-1 grid grid-cols-1 gap-1 min-w-0 max-h-32 overflow-y-auto no-scrollbar pr-0.5">
          {categoryBreakdown.map((item) => {
            const isHovered = hoveredCategory === item.category
            const color = CATEGORY_COLORS[item.category] || '#E2E8F0'

            return (
              <div
                key={item.category}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`flex items-center justify-between px-1.5 py-0.5 rounded-lg cursor-pointer transition-colors ${
                  isHovered ? 'bg-black/5 font-black' : ''
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-xs neo-border shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] font-bold text-black truncate">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <span className="text-[10px] font-black text-black">
                    ₹{item.amount.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-bold text-black/50">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
