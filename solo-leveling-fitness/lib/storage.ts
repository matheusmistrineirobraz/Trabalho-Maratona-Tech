import type { User, DailyTracking, Workout, Post, Comment } from "./types"

// LocalStorage keys
const KEYS = {
  USER: "solo-leveling-user",
  DAILY_TRACKING: "solo-leveling-daily-tracking",
  WORKOUTS: "solo-leveling-workouts",
  POSTS: "solo-leveling-posts",
  COMMENTS: "solo-leveling-comments",
}

// User storage
export const userStorage = {
  get: (): User | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(KEYS.USER)
    return data ? JSON.parse(data) : null
  },
  set: (user: User) => {
    if (typeof window === "undefined") return
    localStorage.setItem(KEYS.USER, JSON.stringify(user))
  },
  clear: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(KEYS.USER)
  },
}

// Daily tracking storage
export const dailyTrackingStorage = {
  get: (userId: string, date: string): DailyTracking | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(KEYS.DAILY_TRACKING)
    const tracking: DailyTracking[] = data ? JSON.parse(data) : []
    return tracking.find((t) => t.userId === userId && t.date === date) || null
  },
  getAll: (userId: string): DailyTracking[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(KEYS.DAILY_TRACKING)
    const tracking: DailyTracking[] = data ? JSON.parse(data) : []
    return tracking.filter((t) => t.userId === userId)
  },
  set: (tracking: DailyTracking) => {
    if (typeof window === "undefined") return
    const data = localStorage.getItem(KEYS.DAILY_TRACKING)
    const allTracking: DailyTracking[] = data ? JSON.parse(data) : []
    const index = allTracking.findIndex((t) => t.userId === tracking.userId && t.date === tracking.date)
    if (index >= 0) {
      allTracking[index] = tracking
    } else {
      allTracking.push(tracking)
    }
    localStorage.setItem(KEYS.DAILY_TRACKING, JSON.stringify(allTracking))
  },
}

// Workouts storage
export const workoutsStorage = {
  getAll: (userId: string): Workout[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(KEYS.WORKOUTS)
    const workouts: Workout[] = data ? JSON.parse(data) : []
    return workouts.filter((w) => w.userId === userId)
  },
  get: (id: string): Workout | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(KEYS.WORKOUTS)
    const workouts: Workout[] = data ? JSON.parse(data) : []
    return workouts.find((w) => w.id === id) || null
  },
  add: (workout: Workout) => {
    if (typeof window === "undefined") return
    const data = localStorage.getItem(KEYS.WORKOUTS)
    const workouts: Workout[] = data ? JSON.parse(data) : []
    workouts.push(workout)
    localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts))
  },
  update: (workout: Workout) => {
    if (typeof window === "undefined") return
    const data = localStorage.getItem(KEYS.WORKOUTS)
    const workouts: Workout[] = data ? JSON.parse(data) : []
    const index = workouts.findIndex((w) => w.id === workout.id)
    if (index >= 0) {
      workouts[index] = workout
      localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts))
    }
  },
  delete: (id: string) => {
    if (typeof window === "undefined") return
    const data = localStorage.getItem(KEYS.WORKOUTS)
    const workouts: Workout[] = data ? JSON.parse(data) : []
    const filtered = workouts.filter((w) => w.id !== id)
    localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(filtered))
  },
}

// Posts storage
export const postsStorage = {
  getAll: (): Post[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(KEYS.POSTS)
    return data ? JSON.parse(data) : []
  },
  add: (post: Post) => {
    if (typeof window === "undefined") return
    const posts = postsStorage.getAll()
    posts.unshift(post)
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts))
  },
  like: (postId: string, userId: string) => {
    if (typeof window === "undefined") return
    const posts = postsStorage.getAll()
    const post = posts.find((p) => p.id === postId)
    if (post) {
      if (post.isLiked) {
        post.likes--
        post.isLiked = false
      } else {
        post.likes++
        post.isLiked = true
      }
      localStorage.setItem(KEYS.POSTS, JSON.stringify(posts))
    }
  },
}

// Comments storage
export const commentsStorage = {
  getAll: (postId: string): Comment[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(KEYS.COMMENTS)
    const comments: Comment[] = data ? JSON.parse(data) : []
    return comments.filter((c) => c.postId === postId)
  },
  add: (comment: Comment) => {
    if (typeof window === "undefined") return
    const data = localStorage.getItem(KEYS.COMMENTS)
    const comments: Comment[] = data ? JSON.parse(data) : []
    comments.push(comment)
    localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments))
  },
}
