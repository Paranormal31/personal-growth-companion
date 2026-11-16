import React from 'react'
import { motion } from 'framer-motion'

interface GymMascotProps {
  completed: number
  target: number
}

export const GymMascot: React.FC<GymMascotProps> = ({ completed, target }) => {
  const isGoalReached = completed >= target && target > 0

  return (
    <motion.div
      className="relative flex items-center justify-center select-none"
      animate={
        isGoalReached
          ? { y: [0, -6, 0], scale: [1, 1.05, 1] }
          : { y: [0, -3, 0] }
      }
      transition={{
        repeat: Infinity,
        duration: isGoalReached ? 0.8 : 2,
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
          d="M44 88 L36 104"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Left Sneaker */}
        <g>
          <ellipse cx="32" cy="110" rx="13" ry="6.5" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
          <path d="M22 112 Q32 115 42 112" stroke="#000000" strokeWidth="2.5" />
          <path d="M30 106 L34 106" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Front Leg / Right Leg */}
        <path
          d="M70 88 L80 104"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Right Sneaker */}
        <g>
          <ellipse cx="85" cy="110" rx="13" ry="6.5" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
          <path d="M75 112 Q85 115 95 112" stroke="#000000" strokeWidth="2.5" />
          <path d="M83 106 L87 106" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Left Flexing Arm */}
        <path
          d="M32 58 Q14 56 18 42 Q20 34 26 38"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Left Fist / Clenched Hand */}
        <circle cx="28" cy="36" r="6.5" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
        <path d="M25 34 Q28 32 31 35" stroke="#000000" strokeWidth="2" />

        {/* Right Flexing Arm */}
        <path
          d="M82 58 Q100 56 96 42 Q94 34 88 38"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right Fist / Clenched Hand */}
        <circle cx="86" cy="36" r="6.5" fill="#FFFFFF" stroke="#000000" strokeWidth="3" />
        <path d="M83 34 Q86 32 89 35" stroke="#000000" strokeWidth="2" />

        {/* Kettlebell Handle */}
        <path
          d="M40 38 C40 18, 74 18, 74 38"
          fill="none"
          stroke="#000000"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M43 36 C43 23, 71 23, 71 36"
          fill="none"
          stroke="#FDE047"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Kettlebell Main Body */}
        <circle
          cx="57"
          cy="62"
          r="29"
          fill="#FDE047"
          stroke="#000000"
          strokeWidth="3.5"
        />

        {/* Body highlight sheen */}
        <path
          d="M40 45 C46 41, 56 41, 62 44"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Weight rating badge on chest */}
        <rect
          x="47"
          y="72"
          width="20"
          height="12"
          rx="4"
          fill="#000000"
        />
        <text
          x="57"
          y="81"
          fill="#FFFFFF"
          fontSize="8"
          fontWeight="900"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          16 KG
        </text>

        {/* Sunglasses */}
        <g id="sunglasses">
          {/* Bridge */}
          <rect x="52" y="52" width="10" height="3" fill="#000000" rx="1.5" />
          {/* Left Lens */}
          <path
            d="M38 49 C38 49, 44 49, 52 50 C52 58, 48 62, 40 60 C37 57, 37 51, 38 49 Z"
            fill="#000000"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Right Lens */}
          <path
            d="M62 50 C70 49, 76 49, 76 49 C77 51, 77 57, 74 60 C66 62, 62 58, 62 50 Z"
            fill="#000000"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* White glares */}
          <line x1="42" y1="52" x2="40" y2="58" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="68" y1="52" x2="66" y2="58" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Confident Smile */}
        <path
          d="M50 67 Q57 71 64 67"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Sparkles / Flex lines */}
        <path d="M12 28 L16 32 M12 36 L16 32 M8 32 L16 32" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        <path d="M102 28 L98 32 M102 36 L98 32 M106 32 L98 32" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}
