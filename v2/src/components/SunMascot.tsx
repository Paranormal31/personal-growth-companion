import React from 'react'

interface SunMascotProps {
  className?: string
  size?: number | string
}

export const SunMascot: React.FC<SunMascotProps> = ({
  className = '',
  size = '100%',
}) => {
  return (
    <img
      src="/sun-mascot.svg"
      alt="Cartoon Sun Mascot"
      style={{ width: size, height: size }}
      className={`object-contain select-none pointer-events-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] ${className}`}
    />
  )
}
