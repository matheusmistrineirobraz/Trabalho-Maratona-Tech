"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { userStorage, workoutsStorage } from "@/lib/storage"
import type { Workout, Exercise } from "@/lib/types"
import { Plus, Trash2, GripVertical, ArrowLeft } from "lucide-react"

export default function CreateWorkoutPage() {
  const router = useRouter()
  const [workoutName, setWorkoutName] = useState("")
  const [exercises, setExercises] = useState<Omit<Exercise, "id" | "workoutId" | "createdAt">[]>([
    { name: "", sets: 3, reps: "10", restSeconds: 60, orderIndex: 0 },
  ])

  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 3, reps: "10", restSeconds: 60, orderIndex: exercises.length }])
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index).map((ex, i) => ({ ...ex, orderIndex: i })))
  }

  const updateExercise = (index: number, field: string, value: string | number) => {
    const updated = [...exercises]
    updated[index] = { ...updated[index], [field]: value }
    setExercises(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const user = userStorage.get()
    if (!user) {
      router.push("/onboarding")
      return
    }

    const workoutId = crypto.randomUUID()
    const workout: Workout = {
      id: workoutId,
      userId: user.id,
      name: workoutName,
      isTemplate: false,
      exercises: exercises.map((ex) => ({
        ...ex,
        id: crypto.randomUUID(),
        workoutId,
        createdAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    workoutsStorage.add(workout)
    router.push("/workouts")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pb-20 md:pt-20">
      <Navigation />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button onClick={() => router.back()} variant="ghost" className="mb-4 text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-blue-400">Criar Treino Personalizado</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">
                  Nome do Treino
                </Label>
                <Input
                  id="name"
                  required
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-slate-100"
                  placeholder="Ex: Treino A - Peito e Tríceps"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200 text-lg">Exercícios</Label>
                  <Button type="button" onClick={addExercise} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                {exercises.map((exercise, index) => (
                  <div key={index} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700 space-y-3">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-5 w-5 text-slate-600 mt-2" />
                      <div className="flex-1 space-y-3">
                        <Input
                          required
                          value={exercise.name}
                          onChange={(e) => updateExercise(index, "name", e.target.value)}
                          className="bg-slate-800/50 border-slate-700 text-slate-100"
                          placeholder="Nome do exercício"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs text-slate-400">Séries</Label>
                            <Input
                              type="number"
                              required
                              min="1"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(index, "sets", Number(e.target.value))}
                              className="bg-slate-800/50 border-slate-700 text-slate-100"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-400">Reps</Label>
                            <Input
                              required
                              value={exercise.reps}
                              onChange={(e) => updateExercise(index, "reps", e.target.value)}
                              className="bg-slate-800/50 border-slate-700 text-slate-100"
                              placeholder="10-12"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-slate-400">Descanso (s)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={exercise.restSeconds || ""}
                              onChange={(e) => updateExercise(index, "restSeconds", Number(e.target.value))}
                              className="bg-slate-800/50 border-slate-700 text-slate-100"
                            />
                          </div>
                        </div>
                      </div>
                      {exercises.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeExercise(index)}
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Criar Treino
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
