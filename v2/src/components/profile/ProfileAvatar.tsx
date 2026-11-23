import React, { useMemo } from 'react'
import { AvataaarsConfig } from '../../types/avatar'
import { generateAvatarDataUri, DEFAULT_AVATAAARS_CONFIG } from '../../utils/avatarGenerator'

interface ProfileAvatarProps {
  config?: AvataaarsConfig
  className?: string
  sizeClassName?: string
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  config = DEFAULT_AVATAAARS_CONFIG,
  className = '',
  sizeClassName = 'w-14 h-14',
}) => {
  const dataUri = useMemo(() => {
    return generateAvatarDataUri(config)
  }, [config])

  const bgColor = config.backgroundColor
    ? `#${config.backgroundColor.replace('#', '')}`
    : '#FDE047'

  return (
    <div
      className={`${sizeClassName} neo-border rounded-2xl flex items-center justify-center overflow-hidden shrink-0 select-none shadow-sm ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <img
        src={dataUri}
        alt={config.seed || 'Avatar'}
        className="w-full h-full object-cover scale-110 translate-y-1"
        loading="lazy"
      />
    </div>
  )
}
