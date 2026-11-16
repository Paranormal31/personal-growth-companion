import React from 'react'

export const ProfileAvatar: React.FC = () => {
  return (
    <div className="w-14 h-14 bg-[#FDE047] neo-border rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-hidden"
      >
        {/* Background is yellow */}
        <rect width="56" height="56" fill="#FDE047" />

        {/* Hoodie Collar / Torso */}
        <path
          d="M12 56 C12 46, 18 42, 28 42 C38 42, 44 46, 44 56 Z"
          fill="#1E293B"
          stroke="#000000"
          strokeWidth="2.5"
        />
        {/* Inner Shirt / Strings */}
        <path d="M25 44 L25 50" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M31 44 L31 50" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="28" cy="47" r="1.5" fill="#FDE047" />

        {/* Neck */}
        <rect x="24" y="36" width="8" height="8" fill="#FCD34D" stroke="#000000" strokeWidth="2" />

        {/* Head / Face */}
        <ellipse cx="28" cy="27" rx="10" ry="11" fill="#FDE68A" stroke="#000000" strokeWidth="2.2" />

        {/* Cute pixel ears */}
        <circle cx="17.5" cy="28" r="2.5" fill="#FDE68A" stroke="#000000" strokeWidth="1.8" />
        <circle cx="38.5" cy="28" r="2.5" fill="#FDE68A" stroke="#000000" strokeWidth="1.8" />

        {/* Silver earring on left ear */}
        <circle cx="17" cy="30" r="1" fill="#FFFFFF" stroke="#000000" strokeWidth="0.8" />

        {/* Anime Eyes */}
        <ellipse cx="23.5" cy="27" rx="1.8" ry="2.2" fill="#000000" />
        <ellipse cx="32.5" cy="27" rx="1.8" ry="2.2" fill="#000000" />
        {/* Eye reflections */}
        <circle cx="24" cy="26" r="0.7" fill="#FFFFFF" />
        <circle cx="33" cy="26" r="0.7" fill="#FFFFFF" />

        {/* Cheeks Blush */}
        <ellipse cx="21" cy="30" rx="1.8" ry="1" fill="#FCA5A5" opacity="0.8" />
        <ellipse cx="35" cy="30" rx="1.8" ry="1" fill="#FCA5A5" opacity="0.8" />

        {/* Gentle Smile */}
        <path d="M26 31 Q28 32.5 30 31" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />

        {/* Messy Black Anime Hair */}
        <path
          d="M17 25 C15 15, 23 11, 28 11 C35 11, 41 15, 39 25 C37 20, 35 16, 31 16 C30 18, 29 20, 27 22 C25 18, 23 16, 19 22 Z"
          fill="#0F172A"
          stroke="#000000"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Forehead fringe bangs */}
        <path
          d="M20 20 L22 24 L25 19 L28 24 L31 19 L34 23 L36 20"
          fill="#0F172A"
          stroke="#000000"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
