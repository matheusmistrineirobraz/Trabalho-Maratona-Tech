"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateBMR, calculateTDEE, calculateDailyCalories, calculateDailyWater } from "@/lib/calculations"
import { userStorage } from "@/lib/storage"
import type { ActivityLevel, Goal, WorkoutType, User } from "@/lib/types"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    activityLevel: "moderada" as ActivityLevel,
    goal: "bulking" as Goal,
    workoutType: "musculacao" as WorkoutType,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
      return
    }

    // Calculate BMR and daily needs
    const bmr = calculateBMR(Number(formData.weight), Number(formData.height), Number(formData.age))
    const tdee = calculateTDEE(bmr, formData.activityLevel)
    const dailyCalories = calculateDailyCalories(tdee, formData.goal)
    const dailyWater = calculateDailyWater(Number(formData.weight))

    // Create user object
    const user: User = {
      id: crypto.randomUUID(),
      email: formData.email,
      name: formData.name,
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      workoutType: formData.workoutType,
      bmr,
      dailyCalories,
      dailyWaterMl: dailyWater,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save to localStorage
    userStorage.set(user)

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900/80 border-blue-500/30 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="text-6xl">⚔️</div>
          </div>
          <CardTitle className="text-3xl font-bold text-blue-400 text-balance">
            Bem-vindo ao Sistema de Leveling
          </CardTitle>
          <CardDescription className="text-slate-400 text-pretty">
            Prepare-se para sua jornada de transformação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="Sung Jin-Woo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    placeholder="hunter@solo-leveling.com"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-slate-200">
                      Idade
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      required
                      min="15"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-slate-200">
                      Altura (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      required
                      min="100"
                      max="250"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                      placeholder="175"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-slate-200">
                      Peso (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      required
                      min="30"
                      max="300"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="bg-slate-800/50 border-slate-700 text-slate-100"
                      placeholder="70"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-200 text-lg">Nível de Atividade Física</Label>
                  <RadioGroup
                    value={formData.activityLevel}
                    onValueChange={(value) => setFormData({ ...formData, activityLevel: value as ActivityLevel })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                      <RadioGroupItem value="baixa" id="baixa" />
                      <Label htmlFor="baixa" className="flex-1 cursor-pointer text-slate-200">
                        <div className="font-semibold">Baixa</div>
                        <div className="text-sm text-slate-400">Pouco ou nenhum exercício</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                      <RadioGroupItem value="moderada" id="moderada" />
                      <Label htmlFor="moderada" className="flex-1 cursor-pointer text-slate-200">
                        <div className="font-semibold">Moderada</div>
                        <div className="text-sm text-slate-400">Exercício leve 1-3 dias/semana</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                      <RadioGroupItem value="alta" id="alta" />
                      <Label htmlFor="alta" className="flex-1 cursor-pointer text-slate-200">
                        <div className="font-semibold">Alta</div>
                        <div className="text-sm text-slate-400">Exercício moderado 3-5 dias/semana</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                      <RadioGroupItem value="intensa" id="intensa" />
                      <Label htmlFor="intensa" className="flex-1 cursor-pointer text-slate-200">
                        <div className="font-semibold">Intensa</div>
                        <div className="text-sm text-slate-400">Exercício pesado 6-7 dias/semana</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-200 text-lg">Objetivo</Label>
                  <RadioGroup
                    value={formData.goal}
                    onValueChange={(value) => setFormData({ ...formData, goal: value as Goal })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                      <RadioGroupItem value="bulking" id="bulking" />
                      <Label htmlFor="bulking" className="flex-1 cursor-pointer text-slate-200">
                        <div className="font-semibold">Ganhar Massa Muscular (Bulking)</div>
                        <div className="text-sm text-slate-400">Superávit calórico para hipertrofia</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                      <RadioGroupItem value="cutting" id="cutting" />
                      <Label htmlFor="cutting" className="flex-1 cursor-pointer text-slate-200">
                        <div className="font-semibold">Emagrecer (Cutting)</div>
                        <div className="text-sm text-slate-400">Déficit calórico para perda de gordura</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-200 text-lg">Tipo de Treino</Label>
                  <RadioGroup
                    value={formData.workoutType}
                    onValueChange={(value) => setFormData({ ...formData, workoutType: value as WorkoutType })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                      <RadioGroupItem value="musculacao" id="musculacao" />
                      <Label htmlFor="musculacao" className="flex-1 cursor-pointer text-slate-200">
                        <div className="font-semibold">Musculação</div>
                        <div className="text-sm text-slate-400">Treino com pesos e equipamentos</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                      <RadioGroupItem value="calistenia" id="calistenia" />
                      <Label htmlFor="calistenia" className="flex-1 cursor-pointer text-slate-200">
                        <div className="font-semibold">Calistenia</div>
                        <div className="text-sm text-slate-400">Treino com peso corporal</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Voltar
                </Button>
              )}
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                {step === 3 ? "Iniciar Jornada" : "Próximo"}
              </Button>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === step ? "bg-blue-500" : "bg-slate-700"}`} />
              ))}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
