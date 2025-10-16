"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { workoutsStorage, dailyTrackingStorage, userStorage } from "@/lib/storage"
import type { Workout } from "@/lib/types"
import { ArrowLeft, Check, Timer } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function StartWorkoutPage() {
  const router = useRouter()
  const params = useParams()
  const workoutId = params.id as string

  const [workout, setWorkout] = useState<Workout | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [completedSets, setCompletedSets] = useState<number[]>([])
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const workoutData = workoutsStorage.get(workoutId)
    if (!workoutData) {
      router.push("/workouts")
      return
    }
    setWorkout(workoutData)
  }, [workoutId, router])

  const completeSet = (setIndex: number) => {
    if (completedSets.includes(setIndex)) {
      setCompletedSets(completedSets.filter((s) => s !== setIndex))
    } else {
      setCompletedSets([...completedSets, setIndex])
    }
  }

  const nextExercise = () => {
    if (!workout) return
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCompletedSets([])
    }
  }

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
      setCompletedSets([])
    }
  }

  const finishWorkout = () => {
    const user = userStorage.get()
    if (!user) return

    const duration = Math.round((Date.now() - startTime) / 1000 / 60)

    // Update daily tracking
    const today = new Date().toISOString().split("T")[0]
    const tracking = dailyTrackingStorage.get(user.id, today)
    if (tracking) {
      tracking.workoutCompleted = true
      dailyTrackingStorage.set(tracking)
    }

    router.push("/workouts")
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Carregando...</div>
      </div>
    )
  }

  const currentExercise = workout.exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pb-20 md:pt-20">
      <Navigation />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button onClick={() => router.back()} variant="ghost" className="mb-4 text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancelar
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-400 mb-2">{workout.name}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
            <span>
              Exercício {currentExerciseIndex + 1} de {workout.exercises.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="bg-slate-900/80 border-blue-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-blue-400 text-2xl">{currentExercise.name}</CardTitle>
            <div className="flex items-center gap-4 text-slate-400">
              <span>
                {currentExercise.sets} séries × {currentExercise.reps} reps
              </span>
              {currentExercise.restSeconds && (
                <span className="flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  {currentExercise.restSeconds}s descanso
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: currentExercise.sets }).map((_, index) => (
              <button
                key={index}
                onClick={() => completeSet(index)}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  completedSets.includes(index)
                    ? "bg-blue-600/20 border-blue-500"
                    : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-semibold">Série {index + 1}</span>
                  {completedSets.includes(index) && <Check className="h-5 w-5 text-blue-400" />}
                </div>
              </button>
            ))}
            {currentExercise.notes && (
              <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-400">{currentExercise.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          {currentExerciseIndex > 0 && (
            <Button
              onClick={previousExercise}
              variant="outline"
              className="flex-1 border-slate-700 text-slate-300 bg-transparent"
            >
              Anterior
            </Button>
          )}
          {currentExerciseIndex < workout.exercises.length - 1 ? (
            <Button onClick={nextExercise} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Próximo
            </Button>
          ) : (
            <Button onClick={finishWorkout} className="flex-1 bg-green-600 hover:bg-green-700">
              Finalizar Treino
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
