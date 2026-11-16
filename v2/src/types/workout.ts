export type WorkoutType = 'Strength' | 'Cardio' | 'Mobility' | 'Other'

export interface Workout {
  id: string
  name: string
  type: WorkoutType
  date: string
  duration: string // e.g. "45 min"
  calories?: number
  notes?: string
  completedAt?: string
}
