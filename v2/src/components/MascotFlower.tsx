import React from 'react'
import { motion } from 'framer-motion'

interface MascotFlowerProps {
  completed: number
  total: number
}

export const MascotFlower: React.FC<MascotFlowerProps> = ({ completed, total }) => {
  const isAllComplete = completed === total && total > 0
  const isNoneComplete = completed === 0

  return (
    <motion.div
      className="relative flex items-center justify-center select-none"
      animate={
        isAllComplete
          ? { y: [0, -6, 0], rotate: [-2, 2, -2] }
          : { y: [0, -3, 0] }
      }
      transition={{
        repeat: Infinity,
        duration: isAllComplete ? 0.7 : 1.8,
        ease: 'easeInOut',
      }}
    >
      {/* Celebration Stars when all complete */}
      {isAllComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-3 -right-2 text-base pointer-events-none"
        >
          ✨
        </motion.div>
      )}

      {/* SVG Retro Cartoon Flower Mascot */}
      <svg
        width="118"
        height="124"
        viewBox="0 0 118 124"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-[1px_2px_0px_rgba(0,0,0,0.8)]"
      >
        {/* Ground shadow beneath feet */}
        <ellipse cx="68" cy="118" rx="34" ry="4" fill="#000000" fillOpacity="0.25" />

        {/* Back Leg (Right leg - stepping back) */}
        <path
          d="M62 82 C65 92 68 100 70 106"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Back Shoe (Right sneaker) */}
        <g transform="translate(62, 102)">
          {/* Sole */}
          <path
            d="M2 13 C2 11 8 9 17 9 C22 9 26 12 26 14 C26 16 22 17 15 17 C6 17 2 15 2 13 Z"
            fill="#000000"
          />
          <path
            d="M3 12 C3 10 9 8 16 8 C21 8 25 10 25 12 C25 14 21 15 15 15 C7 15 3 14 3 12 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="1.5"
          />
          {/* Shoe Body */}
          <path
            d="M6 10 C6 5 9 1 12 1 C14 1 16 4 19 6 C23 7 24 10 24 12 L7 12 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Sneaker lines */}
          <line x1="12" y1="3" x2="15" y2="7" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Back Arm (Right arm - bent back) */}
        <path
          d="M68 62 C78 64 84 68 86 74"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Right Glove */}
        <g transform="translate(83, 70)">
          <circle cx="5" cy="5" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
          <path d="M5 2 C6 4 6 6 5 8" stroke="#000000" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Front Leg (Left leg - stepping forward high stride) */}
        <path
          d="M52 82 C48 94 42 102 36 106"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Front Shoe (Left sneaker - angled forward with thick sole) */}
        <g transform="translate(20, 96) rotate(-14)">
          {/* Heavy Black Outsole */}
          <path
            d="M2 17 C2 15 8 13 18 13 C25 13 29 16 29 18 C29 20 25 21 17 21 C6 21 2 19 2 17 Z"
            fill="#000000"
          />
          {/* White Midsole */}
          <path
            d="M3 15 C3 13 9 11 18 11 C24 11 28 13 28 15 C28 17 24 18 17 18 C7 18 3 17 3 15 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="1.8"
          />
          {/* Upper Body */}
          <path
            d="M5 13 C5 7 10 3 14 3 C16 3 18 6 22 8 C26 9 27 12 27 15 L5 15 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Toe Cap & Laces */}
          <path d="M6 13 C8 9 12 8 14 8" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="5" x2="17" y2="9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="8" x2="19" y2="12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* FLOWER PETALS (8 petals around center) */}
        <g transform="translate(10, 2)">
          {/* Petal Top */}
          <path
            d="M48 24 C48 10 54 4 60 4 C66 4 72 10 72 24 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Petal Top-Right */}
          <path
            d="M62 30 C74 20 84 18 88 23 C93 28 90 38 78 48 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Petal Right */}
          <path
            d="M68 45 C82 45 92 51 92 57 C92 63 82 69 68 69 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Petal Bottom-Right */}
          <path
            d="M62 60 C75 70 82 80 77 84 C72 89 62 84 50 74 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Petal Bottom */}
          <path
            d="M48 66 C48 80 54 86 60 86 C66 86 72 80 72 66 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Petal Bottom-Left */}
          <path
            d="M40 60 C27 70 20 80 25 84 C30 89 40 84 52 74 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Petal Left */}
          <path
            d="M34 45 C20 45 10 51 10 57 C10 63 20 69 34 69 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Petal Top-Left */}
          <path
            d="M40 30 C28 20 18 18 14 23 C9 28 12 38 24 48 Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Yellow Flower Center / Face */}
          <circle
            cx="51"
            cy="47"
            r="19"
            fill="#FDE047"
            stroke="#000000"
            strokeWidth="2.5"
          />

          {/* FACE EXPRESSION */}
          {!isNoneComplete ? (
            /* Cool Sunglasses Face (as in Reference Image) */
            <g>
              {/* Left Lens */}
              <path
                d="M38 41 C37 38 45 37 49 40 C49 44 46 47 42 47 C39 47 38 44 38 41 Z"
                fill="#000000"
              />
              {/* Right Lens */}
              <path
                d="M51 40 C55 37 63 38 63 41 C63 44 61 47 57 47 C53 47 51 44 51 40 Z"
                fill="#000000"
              />
              {/* Sunglasses Bridge */}
              <path d="M47 40 L52 40" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
              {/* Lens White Glare Reflections */}
              <line x1="41" y1="40" x2="43" y2="44" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="55" y1="40" x2="57" y2="44" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

              {/* Big Cheerful Smile */}
              <path
                d="M43 51 C46 56 54 56 57 51"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Cheerful mouth open if all completed */}
              {isAllComplete && (
                <path
                  d="M44 51 Q50 58 56 51 Z"
                  fill="#FF70A6"
                  stroke="#000000"
                  strokeWidth="1.5"
                />
              )}
            </g>
          ) : (
            /* Sleepy / Waking Up Face */
            <g>
              {/* Closed curved smiling eyes */}
              <path d="M39 43 Q43 39 47 43" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M53 43 Q57 39 61 43" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M47 52 Q50 55 53 52" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Cute rosy cheeks */}
              <circle cx="39" cy="48" r="2.5" fill="#FF70A6" />
              <circle cx="61" cy="48" r="2.5" fill="#FF70A6" />
            </g>
          )}
        </g>

        {/* Front Arm (Left arm - energetic rubber hose with 3-finger glove) */}
        <g>
          <path
            d="M38 52 C28 48 24 40 24 35"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Left Glove */}
          <g transform="translate(14, 25)">
            <ellipse cx="9" cy="9" rx="6" ry="6" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
            {/* Glove thumb / fingers */}
            <path d="M7 6 C6 3 9 2 11 4" stroke="#000000" strokeWidth="1.8" fill="#FFFFFF" />
            {/* Glove back creases */}
            <line x1="8" y1="8" x2="8" y2="12" stroke="#000000" strokeWidth="1" strokeLinecap="round" />
            <line x1="11" y1="8" x2="11" y2="11" stroke="#000000" strokeWidth="1" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </motion.div>
  )
}
