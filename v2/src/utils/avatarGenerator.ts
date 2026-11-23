import { createAvatar } from '@dicebear/core'
import { avataaars } from '@dicebear/collection'
import { AvataaarsConfig, UserProfile, AvatarPreset } from '../types/avatar'

export const DEFAULT_AVATAAARS_CONFIG: AvataaarsConfig = {
  seed: 'User',
  backgroundColor: 'FDE047',
  top: 'shortFlat',
  accessories: 'none',
  clothing: 'hoodie',
  eyes: 'default',
  mouth: 'smile',
  facialHair: 'none',
  skinColor: 'ffdbb4',
  hairColor: '2c1b18',
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'User',
  tagline: 'Personal Growth Journey',
  avatarConfig: DEFAULT_AVATAAARS_CONFIG,
}

export const BG_COLOR_OPTIONS = [
  { label: 'Yellow', hex: 'FDE047' },
  { label: 'Lime', hex: 'D4F972' },
  { label: 'Sky', hex: '7DD3FC' },
  { label: 'Pink', hex: 'FF85A2' },
  { label: 'Purple', hex: 'DDD6FE' },
  { label: 'Peach', hex: 'FED7AA' },
]

export const TOP_OPTIONS = [
  { label: 'Short Flat', value: 'shortFlat' },
  { label: 'Curly', value: 'curly' },
  { label: 'The Caesar', value: 'theCaesar' },
  { label: 'Dreads', value: 'dreads01' },
  { label: 'Bun', value: 'bun' },
  { label: 'Bob', value: 'bob' },
  { label: 'Shaved Sides', value: 'shavedSides' },
  { label: 'Straight', value: 'straight01' },
  { label: 'Beanie', value: 'winterHat02' },
  { label: 'Hat', value: 'hat' },
  { label: 'Big Hair', value: 'bigHair' },
]

export const ACCESSORY_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Sunglasses', value: 'sunglasses' },
  { label: 'Round Specs', value: 'round' },
  { label: 'Wayfarers', value: 'wayfarers' },
  { label: 'Modern Specs', value: 'prescription02' },
  { label: 'Kurt Shades', value: 'kurt' },
  { label: 'Eyepatch', value: 'eyepatch' },
]

export const CLOTHING_OPTIONS = [
  { label: 'Hoodie', value: 'hoodie' },
  { label: 'Graphic Tee', value: 'graphicShirt' },
  { label: 'Crewneck', value: 'shirtCrewNeck' },
  { label: 'Sweater', value: 'collarAndSweater' },
  { label: 'Blazer', value: 'blazerAndShirt' },
  { label: 'Overalls', value: 'overall' },
]

export const EYE_OPTIONS = [
  { label: 'Normal', value: 'default' },
  { label: 'Happy', value: 'happy' },
  { label: 'Wink', value: 'wink' },
  { label: 'Surprised', value: 'surprised' },
  { label: 'Squint', value: 'squint' },
  { label: 'Hearts', value: 'hearts' },
]

export const MOUTH_OPTIONS = [
  { label: 'Smile', value: 'smile' },
  { label: 'Twinkle', value: 'twinkle' },
  { label: 'Tongue Out', value: 'tongue' },
  { label: 'Eating', value: 'eating' },
  { label: 'Serious', value: 'serious' },
  { label: 'Neutral', value: 'default' },
]

export const SKIN_COLOR_OPTIONS = [
  { label: 'Fair', hex: 'ffdbb4' },
  { label: 'Warm', hex: 'edb98a' },
  { label: 'Golden', hex: 'f8d25c' },
  { label: 'Tan', hex: 'fd9841' },
  { label: 'Medium', hex: 'd08b5b' },
  { label: 'Deep', hex: '614335' },
]

export const HAIR_COLOR_OPTIONS = [
  { label: 'Black', hex: '2c1b18' },
  { label: 'Dark Brown', hex: '4a312c' },
  { label: 'Brown', hex: '724133' },
  { label: 'Chestnut', hex: 'b58143' },
  { label: 'Blonde', hex: 'd6b370' },
  { label: 'Red', hex: 'c93305' },
  { label: 'Pink', hex: 'f59797' },
  { label: 'Silver', hex: 'e8e1e1' },
]

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'cool-cat',
    label: 'Cool Shades',
    config: {
      seed: 'cool-cat',
      backgroundColor: 'FDE047',
      top: 'shortFlat',
      accessories: 'sunglasses',
      clothing: 'hoodie',
      eyes: 'default',
      mouth: 'smile',
      skinColor: 'ffdbb4',
      hairColor: '2c1b18',
    },
  },
  {
    id: 'scholar',
    label: 'The Scholar',
    config: {
      seed: 'scholar',
      backgroundColor: '7DD3FC',
      top: 'curly',
      accessories: 'round',
      clothing: 'collarAndSweater',
      eyes: 'default',
      mouth: 'smile',
      skinColor: 'edb98a',
      hairColor: '4a312c',
    },
  },
  {
    id: 'zen-seeker',
    label: 'Zen Seeker',
    config: {
      seed: 'zen-seeker',
      backgroundColor: 'D4F972',
      top: 'bun',
      accessories: 'none',
      clothing: 'shirtCrewNeck',
      eyes: 'happy',
      mouth: 'smile',
      skinColor: 'f8d25c',
      hairColor: '2c1b18',
    },
  },
  {
    id: 'athlete',
    label: 'Beanie Athlete',
    config: {
      seed: 'athlete',
      backgroundColor: 'FED7AA',
      top: 'winterHat02',
      accessories: 'none',
      clothing: 'hoodie',
      eyes: 'default',
      mouth: 'twinkle',
      skinColor: 'ffdbb4',
      hairColor: '724133',
    },
  },
  {
    id: 'trendsetter',
    label: 'Trendsetter',
    config: {
      seed: 'trendsetter',
      backgroundColor: 'DDD6FE',
      top: 'dreads01',
      accessories: 'wayfarers',
      clothing: 'graphicShirt',
      eyes: 'wink',
      mouth: 'smile',
      skinColor: 'd08b5b',
      hairColor: '2c1b18',
    },
  },
  {
    id: 'visionary',
    label: 'Visionary',
    config: {
      seed: 'visionary',
      backgroundColor: 'FF85A2',
      top: 'shavedSides',
      accessories: 'prescription02',
      clothing: 'blazerAndShirt',
      eyes: 'default',
      mouth: 'default',
      skinColor: 'edb98a',
      hairColor: 'd6b370',
    },
  },
  {
    id: 'cheerful',
    label: 'Cheerful Bob',
    config: {
      seed: 'cheerful',
      backgroundColor: 'FDE047',
      top: 'bob',
      accessories: 'none',
      clothing: 'overall',
      eyes: 'happy',
      mouth: 'smile',
      skinColor: 'ffdbb4',
      hairColor: 'b58143',
    },
  },
  {
    id: 'explorer',
    label: 'The Explorer',
    config: {
      seed: 'explorer',
      backgroundColor: 'D4F972',
      top: 'hat',
      accessories: 'sunglasses',
      clothing: 'shirtCrewNeck',
      eyes: 'default',
      mouth: 'twinkle',
      skinColor: 'fd9841',
      hairColor: '4a312c',
    },
  },
]

export const generateAvatarDataUri = (config: AvataaarsConfig): string => {
  try {
    const cleanBg = config.backgroundColor ? [config.backgroundColor.replace('#', '').toLowerCase()] : ['fde047']
    const hasAccessories = config.accessories && config.accessories !== 'none'
    const hasFacialHair = config.facialHair && config.facialHair !== 'none'

    const avatar = createAvatar(avataaars, {
      seed: config.seed || 'User',
      backgroundColor: cleanBg,
      ...(config.top ? { top: [config.top as any], topProbability: 100 } : {}),
      ...(hasAccessories ? { accessories: [config.accessories as any], accessoriesProbability: 100 } : { accessoriesProbability: 0 }),
      ...(hasFacialHair ? { facialHair: [config.facialHair as any], facialHairProbability: 100 } : { facialHairProbability: 0 }),
      ...(config.clothing ? { clothing: [config.clothing as any] } : {}),
      ...(config.eyes ? { eyes: [config.eyes as any] } : {}),
      ...(config.mouth ? { mouth: [config.mouth as any] } : {}),
      ...(config.skinColor ? { skinColor: [config.skinColor as any] } : {}),
      ...(config.hairColor ? { hairColor: [config.hairColor as any] } : {}),
    })

    return avatar.toDataUri()
  } catch (e) {
    console.error('Failed to generate avatar, falling back', e)
    const fallback = createAvatar(avataaars, { seed: config.seed || 'User', backgroundColor: ['fde047'] })
    return fallback.toDataUri()
  }
}

export const getRandomAvataaarsConfig = (seedPrefix = 'user'): AvataaarsConfig => {
  const randomTop = TOP_OPTIONS[Math.floor(Math.random() * TOP_OPTIONS.length)].value
  const randomAcc = ACCESSORY_OPTIONS[Math.floor(Math.random() * ACCESSORY_OPTIONS.length)].value
  const randomClothing = CLOTHING_OPTIONS[Math.floor(Math.random() * CLOTHING_OPTIONS.length)].value
  const randomEyes = EYE_OPTIONS[Math.floor(Math.random() * EYE_OPTIONS.length)].value
  const randomMouth = MOUTH_OPTIONS[Math.floor(Math.random() * MOUTH_OPTIONS.length)].value
  const randomSkin = SKIN_COLOR_OPTIONS[Math.floor(Math.random() * SKIN_COLOR_OPTIONS.length)].hex
  const randomHair = HAIR_COLOR_OPTIONS[Math.floor(Math.random() * HAIR_COLOR_OPTIONS.length)].hex
  const randomBg = BG_COLOR_OPTIONS[Math.floor(Math.random() * BG_COLOR_OPTIONS.length)].hex

  return {
    seed: `${seedPrefix}-${Math.floor(Math.random() * 10000)}`,
    backgroundColor: randomBg,
    top: randomTop,
    accessories: randomAcc,
    clothing: randomClothing,
    eyes: randomEyes,
    mouth: randomMouth,
    skinColor: randomSkin,
    hairColor: randomHair,
  }
}
