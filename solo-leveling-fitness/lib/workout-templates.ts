import type { WorkoutType } from "./types"

export interface WorkoutTemplate {
  name: string
  exercises: {
    name: string
    sets: number
    reps: string
    restSeconds: number
    notes?: string
  }[]
}

export const musculacaoTemplates: WorkoutTemplate[] = [
  {
    name: "Treino A - Peito e Tríceps",
    exercises: [
      { name: "Supino Reto", sets: 4, reps: "8-12", restSeconds: 90 },
      { name: "Supino Inclinado", sets: 3, reps: "10-12", restSeconds: 90 },
      { name: "Crucifixo", sets: 3, reps: "12-15", restSeconds: 60 },
      { name: "Tríceps Testa", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Tríceps Corda", sets: 3, reps: "12-15", restSeconds: 60 },
    ],
  },
  {
    name: "Treino B - Costas e Bíceps",
    exercises: [
      { name: "Barra Fixa", sets: 4, reps: "6-10", restSeconds: 90 },
      { name: "Remada Curvada", sets: 4, reps: "8-12", restSeconds: 90 },
      { name: "Puxada Frontal", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Rosca Direta", sets: 3, reps: "10-12", restSeconds: 60 },
      { name: "Rosca Martelo", sets: 3, reps: "12-15", restSeconds: 60 },
    ],
  },
  {
    name: "Treino C - Pernas",
    exercises: [
      { name: "Agachamento Livre", sets: 4, reps: "8-12", restSeconds: 120 },
      { name: "Leg Press", sets: 4, reps: "10-15", restSeconds: 90 },
      { name: "Cadeira Extensora", sets: 3, reps: "12-15", restSeconds: 60 },
      { name: "Cadeira Flexora", sets: 3, reps: "12-15", restSeconds: 60 },
      { name: "Panturrilha em Pé", sets: 4, reps: "15-20", restSeconds: 60 },
    ],
  },
  {
    name: "Treino D - Ombros e Abdômen",
    exercises: [
      { name: "Desenvolvimento com Barra", sets: 4, reps: "8-12", restSeconds: 90 },
      { name: "Elevação Lateral", sets: 3, reps: "12-15", restSeconds: 60 },
      { name: "Elevação Frontal", sets: 3, reps: "12-15", restSeconds: 60 },
      { name: "Encolhimento", sets: 3, reps: "12-15", restSeconds: 60 },
      { name: "Abdominal Supra", sets: 3, reps: "15-20", restSeconds: 45 },
    ],
  },
]

export const calisteniaTemplates: WorkoutTemplate[] = [
  {
    name: "Treino A - Push (Empurrar)",
    exercises: [
      { name: "Flexão de Braço", sets: 4, reps: "10-15", restSeconds: 90 },
      { name: "Flexão Diamante", sets: 3, reps: "8-12", restSeconds: 90 },
      { name: "Pike Push-up", sets: 3, reps: "8-12", restSeconds: 90 },
      { name: "Dips", sets: 3, reps: "8-12", restSeconds: 90 },
      { name: "Prancha", sets: 3, reps: "30-60s", restSeconds: 60 },
    ],
  },
  {
    name: "Treino B - Pull (Puxar)",
    exercises: [
      { name: "Barra Fixa", sets: 4, reps: "5-10", restSeconds: 120 },
      { name: "Barra Australiana", sets: 3, reps: "10-15", restSeconds: 90 },
      { name: "Chin-ups", sets: 3, reps: "6-10", restSeconds: 90 },
      { name: "Remada Invertida", sets: 3, reps: "10-15", restSeconds: 90 },
      { name: "Hollow Body Hold", sets: 3, reps: "20-40s", restSeconds: 60 },
    ],
  },
  {
    name: "Treino C - Legs (Pernas)",
    exercises: [
      { name: "Agachamento", sets: 4, reps: "15-20", restSeconds: 90 },
      { name: "Pistol Squat", sets: 3, reps: "5-10", restSeconds: 90, notes: "cada perna" },
      { name: "Afundo", sets: 3, reps: "10-15", restSeconds: 90, notes: "cada perna" },
      { name: "Elevação de Panturrilha", sets: 4, reps: "15-20", restSeconds: 60 },
      { name: "Glute Bridge", sets: 3, reps: "15-20", restSeconds: 60 },
    ],
  },
  {
    name: "Treino D - Core e Habilidades",
    exercises: [
      { name: "L-Sit", sets: 4, reps: "10-30s", restSeconds: 90 },
      { name: "Handstand Hold", sets: 3, reps: "10-30s", restSeconds: 90 },
      { name: "Dragon Flag", sets: 3, reps: "5-10", restSeconds: 90 },
      { name: "Prancha Lateral", sets: 3, reps: "30-45s", restSeconds: 60, notes: "cada lado" },
      { name: "Burpees", sets: 3, reps: "10-15", restSeconds: 60 },
    ],
  },
]

export function getWorkoutTemplates(workoutType: WorkoutType): WorkoutTemplate[] {
  return workoutType === "musculacao" ? musculacaoTemplates : calisteniaTemplates
}
