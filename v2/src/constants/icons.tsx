import React from 'react'
import {
  Dumbbell,
  Droplet,
  BookOpen,
  Utensils,
  Laptop,
  Users,
  Bed,
  Footprints,
  Heart,
  Sprout,
  Star,
  Code,
  Briefcase,
  ListChecks,
  Calendar,
  Mail,
  Video,
  BarChart2,
  Monitor,
  Layers,
  Database,
  Presentation,
  Activity,
  Pill,
  Stethoscope,
  BriefcaseMedical,
  Apple,
  Flower2,
  Brain,
  Wind,
  Shield,
  ClipboardCheck,
  Scale,
  Gamepad2,
  Beer,
  Coffee,
  Clapperboard,
  Music,
  Headphones,
  Film,
  Wine,
  Tent,
  Mountain,
  Camera,
  Sparkles,
  Car,
  ShoppingBag,
  Zap,
  Repeat,
  CircleDot,
  HeartPulse,
  Wallet,
  CreditCard,
  Tag,
  Home,
  Plane,
  Bus,
  Gift,
  GraduationCap,
  Fuel,
  Wifi,
  DollarSign,
  Smile,
  Package,
} from 'lucide-react'

// Custom Meditation SVG Icon matching the original reference
export const MeditateIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-black' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="5" r="2.8" stroke="currentColor" strokeWidth="2.2" />
    <path
      d="M12 8 C9 8 8 11 8 13 C8 15 10 16 12 16 C14 16 16 15 16 13 C16 11 15 8 12 8 Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path
      d="M5 19 C5 16 8 16 12 16 C16 16 19 16 19 19 C18 20 15 20.5 12 20.5 C9 20.5 6 20 5 19 Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="18" r="1.5" fill="currentColor" />
    <circle cx="18" cy="18" r="1.5" fill="currentColor" />
  </svg>
)

export interface IconDefinition {
  id: string
  label: string
  component: React.ComponentType<{ className?: string }>
}

export interface IconCategory {
  id: 'common' | 'productivity' | 'wellness' | 'leisure'
  label: 'Common' | 'Productivity' | 'Wellness' | 'Leisure'
  icons: IconDefinition[]
}

export const ICON_CATEGORIES: IconCategory[] = [
  {
    id: 'common',
    label: 'Common',
    icons: [
      { id: 'dumbbell', label: 'Workout', component: Dumbbell },
      { id: 'droplet', label: 'Hydrate', component: Droplet },
      { id: 'book', label: 'Read', component: BookOpen },
      { id: 'utensils', label: 'Meal', component: Utensils },
      { id: 'laptop', label: 'Work', component: Laptop },
      { id: 'users', label: 'Team', component: Users },
      { id: 'meditate', label: 'Meditate', component: MeditateIcon },
      { id: 'bed', label: 'Sleep', component: Bed },
      { id: 'footprints', label: 'Run', component: Footprints },
      { id: 'heart', label: 'Health', component: Heart },
      { id: 'sprout', label: 'Growth', component: Sprout },
      { id: 'star', label: 'Focus', component: Star },
    ],
  },
  {
    id: 'productivity',
    label: 'Productivity',
    icons: [
      { id: 'laptop', label: 'Work', component: Laptop },
      { id: 'code', label: 'Code', component: Code },
      { id: 'briefcase', label: 'Job', component: Briefcase },
      { id: 'list-checks', label: 'Tasks', component: ListChecks },
      { id: 'calendar', label: 'Schedule', component: Calendar },
      { id: 'mail', label: 'Email', component: Mail },
      { id: 'video', label: 'Meeting', component: Video },
      { id: 'barchart', label: 'Analytics', component: BarChart2 },
      { id: 'monitor', label: 'Screen', component: Monitor },
      { id: 'layers', label: 'Design', component: Layers },
      { id: 'database', label: 'Data', component: Database },
      { id: 'presentation', label: 'Pitch', component: Presentation },
    ],
  },
  {
    id: 'wellness',
    label: 'Wellness',
    icons: [
      { id: 'activity', label: 'Cardio', component: Activity },
      { id: 'pill', label: 'Vitamins', component: Pill },
      { id: 'stethoscope', label: 'Checkup', component: Stethoscope },
      { id: 'first-aid', label: 'Care', component: BriefcaseMedical },
      { id: 'apple', label: 'Diet', component: Apple },
      { id: 'flower', label: 'Mindful', component: Flower2 },
      { id: 'brain', label: 'Mental', component: Brain },
      { id: 'wind', label: 'Breathe', component: Wind },
      { id: 'shield', label: 'Immunity', component: Shield },
      { id: 'clipboard', label: 'Habits', component: ClipboardCheck },
      { id: 'scale', label: 'Weight', component: Scale },
      { id: 'dumbbell-wellness', label: 'Fitness', component: Dumbbell },
    ],
  },
  {
    id: 'leisure',
    label: 'Leisure',
    icons: [
      { id: 'gamepad', label: 'Gaming', component: Gamepad2 },
      { id: 'beer', label: 'Social', component: Beer },
      { id: 'coffee', label: 'Coffee', component: Coffee },
      { id: 'clapperboard', label: 'Cinema', component: Clapperboard },
      { id: 'music', label: 'Music', component: Music },
      { id: 'headphones', label: 'Podcast', component: Headphones },
      { id: 'film', label: 'Movie', component: Film },
      { id: 'wine', label: 'Dinner', component: Wine },
      { id: 'tent', label: 'Outdoors', component: Tent },
      { id: 'mountain', label: 'Hike', component: Mountain },
      { id: 'camera', label: 'Photos', component: Camera },
      { id: 'sparkles', label: 'Fun', component: Sparkles },
    ],
  },
]

// 8 Pastel Color Options (4 per row, 2 rows)
export const COLOR_SWATCHES = [
  '#FF70A6', // Accent Pink
  '#FFD027', // Accent Yellow
  '#B8F25A', // Accent Lime Green
  '#56CFE1', // Accent Sky Cyan
  '#C7B9FF', // Accent Lavender
  '#FFAC81', // Accent Peach
  '#93C5FD', // Soft Periwinkle
  '#F0ABFC', // Soft Bubblegum / Lilac
]

// Universal Icon Resolver
export function getHabitIconComponent(iconName: string): React.ComponentType<{ className?: string }> {
  for (const cat of ICON_CATEGORIES) {
    const found = cat.icons.find((i) => i.id === iconName)
    if (found) return found.component
  }
  // Fallbacks
  if (iconName === 'meditate') return MeditateIcon
  if (iconName === 'utensils') return Utensils
  if (iconName === 'droplet') return Droplet
  if (iconName === 'book') return BookOpen
  if (iconName === 'laptop') return Laptop
  if (iconName === 'users') return Users
  return Dumbbell
}

export interface CategoryIconChoice {
  id: string
  label: string
  component: React.ComponentType<{ className?: string }>
}

export const CATEGORY_ICON_CHOICES: CategoryIconChoice[] = [
  { id: 'utensils', label: 'Dining', component: Utensils },
  { id: 'coffee', label: 'Coffee', component: Coffee },
  { id: 'car', label: 'Car', component: Car },
  { id: 'bus', label: 'Transit', component: Bus },
  { id: 'plane', label: 'Travel', component: Plane },
  { id: 'fuel', label: 'Fuel', component: Fuel },
  { id: 'shopping-bag', label: 'Shopping', component: ShoppingBag },
  { id: 'package', label: 'Orders', component: Package },
  { id: 'zap', label: 'Utilities', component: Zap },
  { id: 'wifi', label: 'Internet', component: Wifi },
  { id: 'home', label: 'Home', component: Home },
  { id: 'heart', label: 'Health', component: Heart },
  { id: 'heart-pulse', label: 'Medical', component: HeartPulse },
  { id: 'film', label: 'Movies', component: Film },
  { id: 'repeat', label: 'Subs', component: Repeat },
  { id: 'wallet', label: 'Wallet', component: Wallet },
  { id: 'credit-card', label: 'Cards', component: CreditCard },
  { id: 'dollar-sign', label: 'Money', component: DollarSign },
  { id: 'beer', label: 'Drinks', component: Beer },
  { id: 'gift', label: 'Gifts', component: Gift },
  { id: 'book', label: 'Education', component: BookOpen },
  { id: 'briefcase', label: 'Business', component: Briefcase },
  { id: 'dumbbell', label: 'Fitness', component: Dumbbell },
  { id: 'laptop', label: 'Tech', component: Laptop },
  { id: 'gamepad', label: 'Gaming', component: Gamepad2 },
  { id: 'music', label: 'Music', component: Music },
  { id: 'tag', label: 'Tag', component: Tag },
  { id: 'circle-dot', label: 'Other', component: CircleDot },
]

export function getCategoryIconComponent(iconName: string): React.ComponentType<{ className?: string }> {
  const found = CATEGORY_ICON_CHOICES.find((i) => i.id === iconName)
  if (found) return found.component

  // Fallback checks
  if (iconName === 'utensils') return Utensils
  if (iconName === 'car') return Car
  if (iconName === 'shopping-bag') return ShoppingBag
  if (iconName === 'zap') return Zap
  if (iconName === 'heart' || iconName === 'heart-pulse') return HeartPulse
  if (iconName === 'film') return Film
  if (iconName === 'repeat') return Repeat
  if (iconName === 'coffee') return Coffee
  if (iconName === 'wallet') return Wallet
  return CircleDot
}
