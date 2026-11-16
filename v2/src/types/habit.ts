export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export interface Habit {
  id: string
  name: string
  streak: number
  completed: boolean
  category: 'workout' | 'hydrate' | 'read' | 'meditate' | 'meal' | 'work' | 'event' | string
  accentColor: string
  iconName: string
  startTime?: string
  endTime?: string
  activeDays: Weekday[]
  weeklyCompletions?: Partial<Record<Weekday, boolean>>
  completedDates?: Record<string, boolean>
  type?: 'task' | 'event'
}

export interface DayProgress {
  total: number
  completed: number
  percentage: number
}
