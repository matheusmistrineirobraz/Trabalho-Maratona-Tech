import type { ActivityLevel, Goal } from "./types"

// Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
export function calculateBMR(
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: "male" | "female" = "male",
): number {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

// Activity multipliers
const activityMultipliers: Record<ActivityLevel, number> = {
  baixa: 1.2, // Sedentary
  moderada: 1.375, // Light exercise 1-3 days/week
  alta: 1.55, // Moderate exercise 3-5 days/week
  intensa: 1.725, // Heavy exercise 6-7 days/week
}

// Calculate Total Daily Energy Expenditure
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * activityMultipliers[activityLevel])
}

// Calculate daily calories based on goal
export function calculateDailyCalories(tdee: number, goal: Goal): number {
  if (goal === "bulking") {
    return Math.round(tdee + 300) // Surplus for muscle gain
  } else {
    return Math.round(tdee - 500) // Deficit for fat loss
  }
}

// Calculate daily water intake (ml)
export function calculateDailyWater(weight: number): number {
  return Math.round(weight * 35) // 35ml per kg of body weight
}

// Calculate macros (protein, carbs, fats in grams)
export function calculateMacros(dailyCalories: number, goal: Goal): { protein: number; carbs: number; fats: number } {
  if (goal === "bulking") {
    // Bulking: 30% protein, 50% carbs, 20% fats
    return {
      protein: Math.round((dailyCalories * 0.3) / 4),
      carbs: Math.round((dailyCalories * 0.5) / 4),
      fats: Math.round((dailyCalories * 0.2) / 9),
    }
  } else {
    // Cutting: 40% protein, 30% carbs, 30% fats
    return {
      protein: Math.round((dailyCalories * 0.4) / 4),
      carbs: Math.round((dailyCalories * 0.3) / 4),
      fats: Math.round((dailyCalories * 0.3) / 9),
    }
  }
}
