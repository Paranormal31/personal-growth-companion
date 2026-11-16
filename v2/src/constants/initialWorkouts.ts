import { Workout } from '../types/workout'

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'workout-1',
    name: 'Push Day',
    type: 'Strength',
    date: 'Yesterday',
    duration: '50 min',
    calories: 380,
    notes: 'Bench Press 4x8 (70kg), Incline Dumbbell Press 3x10, Overhead Dumbbell Press, Tricep Pushdowns 4x12. Felt explosive!',
    completedAt: '2026-11-15T18:30:00Z',
  },
  {
    id: 'workout-2',
    name: 'Pull Day',
    type: 'Strength',
    date: '3 days ago',
    duration: '45 min',
    calories: 340,
    notes: 'Weighted Pull-ups 4x6 (+10kg), Barbell Bent-over Rows 4x10, Face Pulls, Alternating Dumbbell Bicep Curls.',
    completedAt: '2026-11-13T17:45:00Z',
  },
  {
    id: 'workout-3',
    name: 'Leg Day',
    type: 'Strength',
    date: '5 days ago',
    duration: '60 min',
    calories: 490,
    notes: 'Barbell Back Squats 5x5 (95kg), Romanian Deadlifts 4x10, Bulgarian Split Squats, Standing Calf Raises.',
    completedAt: '2026-11-11T19:00:00Z',
  },
  {
    id: 'workout-4',
    name: 'Morning HIIT Cardio',
    type: 'Cardio',
    date: '6 days ago',
    duration: '30 min',
    calories: 280,
    notes: 'Treadmill sprints 10 rounds (30s sprint / 30s rest), jump rope intervals, abdominal circuit.',
    completedAt: '2026-11-10T07:15:00Z',
  },
]
