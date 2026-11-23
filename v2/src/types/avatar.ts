export interface AvataaarsConfig {
  seed: string
  backgroundColor: string // Hex code without '#', e.g. 'FDE047'
  top?: string
  accessories?: string
  clothing?: string
  eyes?: string
  mouth?: string
  facialHair?: string
  skinColor?: string
  hairColor?: string
}

export interface UserProfile {
  name: string
  tagline: string
  avatarConfig: AvataaarsConfig
}

export interface AvatarPreset {
  id: string
  label: string
  config: AvataaarsConfig
}
