export type ActivityLevel = "baixa" | "moderada" | "alta" | "intensa"
export type Goal = "bulking" | "cutting"
export type WorkoutType = "musculacao" | "calistenia"
export type PostType = "workout" | "meal" | "achievement"

export interface User {
  id: string
  email: string
  name: string
  age: number
  height: number // cm
  weight: number // kg
  activityLevel: ActivityLevel
  goal: Goal
  workoutType: WorkoutType
  bmr: number
  dailyCalories: number
  dailyWaterMl: number
  createdAt: string
  updatedAt: string
}

export interface DailyTracking {
  id: string
  userId: string
  date: string
  waterConsumedMl: number
  caloriesConsumed: number
  workoutCompleted: boolean
  createdAt: string
}

export interface Workout {
  id: string
  userId: string
  name: string
  isTemplate: boolean
  exercises: Exercise[]
  createdAt: string
  updatedAt: string
}

export interface Exercise {
  id: string
  workoutId: string
  name: string
  sets: number
  reps: string
  restSeconds?: number
  notes?: string
  orderIndex: number
  createdAt: string
}

export interface WorkoutLog {
  id: string
  userId: string
  workoutId?: string
  date: string
  durationMinutes?: number
  notes?: string
  createdAt: string
}

export interface Post {
  id: string
  userId: string
  userName: string
  type: PostType
  title: string
  content: string
  imageUrl?: string
  likes: number
  createdAt: string
  isLiked?: boolean
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}
