"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { userStorage, workoutsStorage } from "@/lib/storage"
import { getWorkoutTemplates } from "@/lib/workout-templates"
import type { User, Workout } from "@/lib/types"
import { Plus, Dumbbell, Calendar, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function WorkoutsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    const userData = userStorage.get()
    if (!userData) {
      router.push("/onboarding")
      return
    }
    setUser(userData)
    loadWorkouts(userData.id)
  }, [router])

  const loadWorkouts = (userId: string) => {
    const userWorkouts = workoutsStorage.getAll(userId)
    setWorkouts(userWorkouts)
  }

  const createFromTemplate = (templateIndex: number) => {
    if (!user) return

    const templates = getWorkoutTemplates(user.workoutType)
    const template = templates[templateIndex]

    const workout: Workout = {
      id: crypto.randomUUID(),
      userId: user.id,
      name: template.name,
      isTemplate: false,
      exercises: template.exercises.map((ex, index) => ({
        id: crypto.randomUUID(),
        workoutId: "",
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        restSeconds: ex.restSeconds,
        notes: ex.notes,
        orderIndex: index,
        createdAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    workout.exercises.forEach((ex) => {
      ex.workoutId = workout.id
    })

    workoutsStorage.add(workout)
    loadWorkouts(user.id)
    setShowTemplates(false)
  }

  const deleteWorkout = (id: string) => {
    workoutsStorage.delete(id)
    if (user) loadWorkouts(user.id)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Carregando...</div>
      </div>
    )
  }

  const templates = getWorkoutTemplates(user.workoutType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pb-20 md:pt-20">
      <Navigation />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 mb-2 text-balance">Meus Treinos</h1>
            <p className="text-slate-400 text-pretty">Gerencie seus treinos de {user.workoutType}</p>
          </div>
          <Button onClick={() => setShowTemplates(!showTemplates)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo
          </Button>
        </div>

        {/* Templates Selection */}
        {showTemplates && (
          <Card className="mb-6 bg-slate-900/80 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400">Escolha um Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {templates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => createFromTemplate(index)}
                  className="w-full text-left p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                >
                  <div className="font-semibold text-blue-400 mb-1">{template.name}</div>
                  <div className="text-sm text-slate-400">{template.exercises.length} exercícios</div>
                </button>
              ))}
              <Button
                onClick={() => router.push("/workouts/create")}
                variant="outline"
                className="w-full border-slate-700 text-slate-300"
              >
                Criar Treino Personalizado
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Workouts List */}
        {workouts.length === 0 ? (
          <Card className="bg-slate-900/80 border-blue-500/30">
            <CardContent className="py-12 text-center">
              <Dumbbell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">Nenhum treino criado ainda</p>
              <Button onClick={() => setShowTemplates(true)} className="bg-blue-600 hover:bg-blue-700">
                Criar Primeiro Treino
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <Card key={workout.id} className="bg-slate-900/80 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-blue-400 mb-2">{workout.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Dumbbell className="h-4 w-4" />
                          {workout.exercises.length} exercícios
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(workout.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-900 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-slate-100">Excluir treino?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            Esta ação não pode ser desfeita. O treino será permanentemente excluído.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteWorkout(workout.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {workout.exercises.slice(0, 3).map((exercise) => (
                      <div key={exercise.id} className="flex justify-between text-sm">
                        <span className="text-slate-300">{exercise.name}</span>
                        <span className="text-slate-500">
                          {exercise.sets}x{exercise.reps}
                        </span>
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <div className="text-sm text-slate-500">+{workout.exercises.length - 3} exercícios</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Link href={`/workouts/${workout.id}/start`}>Iniciar Treino</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 border-slate-700 text-slate-300 bg-transparent">
                      <Link href={`/workouts/${workout.id}/edit`}>Editar</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
