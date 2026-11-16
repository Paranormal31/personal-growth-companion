import React from 'react'
import { motion } from 'framer-motion'

interface BudgetMascotProps {
  spentRatio?: number // 0 to 1
}

export const BudgetMascot: React.FC<BudgetMascotProps> = ({ spentRatio = 0.5 }) => {
  const isHealthy = spentRatio < 0.8

  return (
    <motion.div
      className="relative flex items-center justify-center select-none"
      animate={{
        y: [0, -3.5, 0],
        rotate: isHealthy ? [-1, 1, -1] : [-2, 2, -2],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.8,
        ease: 'easeInOut',
      }}
    >
      <svg
        width="114"
        height="122"
        viewBox="0 0 114 122"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-[1px_2px_0px_rgba(0,0,0,0.8)]"
      >
        {/* Ground shadow beneath feet */}
        <ellipse cx="58" cy="116" rx="34" ry="4.5" fill="#000000" fillOpacity="0.25" />

        {/* Back Leg / Left Leg */}
        <path
          d="M45 88 L38 104"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Left Sneaker */}
        <g>
          <ellipse cx="34" cy="110" rx="13" ry="6.5" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
          <path d="M24 112 Q34 115 44 112" stroke="#000000" strokeWidth="2.5" />
          <path d="M32 106 L36 106" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Front Leg / Right Leg */}
        <path
          d="M69 88 L78 104"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Right Sneaker */}
        <g>
          <ellipse cx="83" cy="110" rx="13" ry="6.5" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
          <path d="M73 112 Q83 115 93 112" stroke="#000000" strokeWidth="2.5" />
          <path d="M81 106 L85 106" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Money Bag Tied Top Ruffles */}
        <path
          d="M42 28 C42 16, 50 14, 57 14 C64 14, 72 16, 72 28 Z"
          fill="#FDE047"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M48 20 L50 26 M57 18 L57 26 M64 20 L62 26"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Tie Ribbon / Rope */}
        <rect
          x="40"
          y="28"
          width="34"
          height="7"
          rx="3.5"
          fill="#FF85A2"
          stroke="#000000"
          strokeWidth="3"
        />
        {/* Hanging rope ends */}
        <path
          d="M62 35 C63 42, 68 45, 71 44"
          stroke="#FF85A2"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Money Bag Main Bulbous Body */}
        <path
          d="M43 35 C30 45, 24 64, 28 78 C32 92, 82 92, 86 78 C90 64, 84 45, 71 35 Z"
          fill="#FDE047"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Body highlight sheen */}
        <path
          d="M36 50 C33 60, 36 72, 42 78"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Rupee Symbol Badge in Center */}
        <circle cx="57" cy="74" r="11" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
        <text
          x="57"
          y="80"
          fill="#000000"
          fontSize="14"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          ₹
        </text>

        {/* Sunglasses */}
        <g id="sunglasses">
          <rect x="52" y="47" width="10" height="3" fill="#000000" rx="1.5" />
          <path
            d="M38 44 C38 44, 44 44, 52 45 C52 53, 48 57, 40 55 C37 52, 37 46, 38 44 Z"
            fill="#000000"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <path
            d="M62 45 C70 44, 76 44, 76 44 C77 46, 77 52, 74 55 C66 57, 62 53, 62 45 Z"
            fill="#000000"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <line x1="42" y1="47" x2="40" y2="53" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="68" y1="47" x2="66" y2="53" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Grin / Smile */}
        <path
          d="M51 60 Q57 64 63 60"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Floating Coin Accents */}
        <g transform="translate(14, 25)">
          <circle cx="6" cy="6" r="6" fill="#D4F972" stroke="#000000" strokeWidth="2" />
          <text x="6" y="9.5" fill="#000000" fontSize="8" fontWeight="900" textAnchor="middle">₹</text>
        </g>
        <g transform="translate(86, 22)">
          <circle cx="5" cy="5" r="5" fill="#7DD3FC" stroke="#000000" strokeWidth="2" />
          <text x="5" y="8" fill="#000000" fontSize="7" fontWeight="900" textAnchor="middle">₹</text>
        </g>
      </svg>
    </motion.div>
  )
}
