"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { StatsRadarChart } from "@/components/stats-radar-chart"
import { userStorage, dailyTrackingStorage } from "@/lib/storage"
import { calculateMacros } from "@/lib/calculations"
import type { User, DailyTracking } from "@/lib/types"
import { Droplet, Flame, Target, TrendingUp, Plus, Minus } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [dailyTracking, setDailyTracking] = useState<DailyTracking | null>(null)

  useEffect(() => {
    const userData = userStorage.get()
    if (!userData) {
      router.push("/onboarding")
      return
    }
    setUser(userData)

    // Get or create today's tracking
    const today = new Date().toISOString().split("T")[0]
    let tracking = dailyTrackingStorage.get(userData.id, today)
    if (!tracking) {
      tracking = {
        id: crypto.randomUUID(),
        userId: userData.id,
        date: today,
        waterConsumedMl: 0,
        caloriesConsumed: 0,
        workoutCompleted: false,
        createdAt: new Date().toISOString(),
      }
      dailyTrackingStorage.set(tracking)
    }
    setDailyTracking(tracking)
  }, [router])

  const addWater = (amount: number) => {
    if (!user || !dailyTracking) return
    const updated = {
      ...dailyTracking,
      waterConsumedMl: Math.max(0, Math.min(dailyTracking.waterConsumedMl + amount, user.dailyWaterMl * 2)),
    }
    dailyTrackingStorage.set(updated)
    setDailyTracking(updated)
  }

  const addCalories = (amount: number) => {
    if (!user || !dailyTracking) return
    const updated = {
      ...dailyTracking,
      caloriesConsumed: Math.max(0, dailyTracking.caloriesConsumed + amount),
    }
    dailyTrackingStorage.set(updated)
    setDailyTracking(updated)
  }

  if (!user || !dailyTracking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Carregando...</div>
      </div>
    )
  }

  const macros = calculateMacros(user.dailyCalories, user.goal)
  const waterProgress = (dailyTracking.waterConsumedMl / user.dailyWaterMl) * 100
  const caloriesProgress = (dailyTracking.caloriesConsumed / user.dailyCalories) * 100

  // Calculate stats for radar chart
  const statsData = [
    { stat: "Força", value: 65, max: 100 },
    { stat: "Resistência", value: 70, max: 100 },
    { stat: "Agilidade", value: 60, max: 100 },
    { stat: "Nutrição", value: caloriesProgress > 80 ? 85 : 50, max: 100 },
    { stat: "Hidratação", value: waterProgress > 80 ? 90 : 55, max: 100 },
    { stat: "Consistência", value: dailyTracking.workoutCompleted ? 75 : 40, max: 100 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pb-20 md:pt-20">
      <Navigation />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-400 mb-2 text-balance">Bem-vindo, {user.name}</h1>
          <p className="text-slate-400 text-pretty">
            Nível de Hunter: <span className="text-blue-400 font-semibold">E-Rank</span>
          </p>
        </div>

        {/* Stats Radar Chart */}
        <Card className="mb-6 bg-slate-900/80 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Status do Hunter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatsRadarChart data={statsData} />
          </CardContent>
        </Card>

        {/* Daily Goals Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Water Tracking */}
          <Card className="bg-slate-900/80 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2 text-lg">
                <Droplet className="h-5 w-5" />
                Hidratação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progresso</span>
                  <span className="text-blue-400 font-semibold">
                    {dailyTracking.waterConsumedMl}ml / {user.dailyWaterMl}ml
                  </span>
                </div>
                <Progress value={waterProgress} className="h-3" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => addWater(250)} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  250ml
                </Button>
                <Button onClick={() => addWater(500)} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  500ml
                </Button>
                <Button
                  onClick={() => addWater(-250)}
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-300"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calories Tracking */}
          <Card className="bg-slate-900/80 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2 text-lg">
                <Flame className="h-5 w-5" />
                Calorias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progresso</span>
                  <span className="text-blue-400 font-semibold">
                    {dailyTracking.caloriesConsumed} / {user.dailyCalories} kcal
                  </span>
                </div>
                <Progress value={caloriesProgress} className="h-3" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => addCalories(200)} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  200
                </Button>
                <Button onClick={() => addCalories(500)} size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  500
                </Button>
                <Button
                  onClick={() => addCalories(-200)}
                  size="sm"
                  variant="outline"
                  className="border-slate-700 text-slate-300"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Macros & Goal */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Macros */}
          <Card className="bg-slate-900/80 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Macronutrientes Diários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Proteína</span>
                  <span className="text-blue-400 font-semibold">{macros.protein}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Carboidratos</span>
                  <span className="text-blue-400 font-semibold">{macros.carbs}g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Gorduras</span>
                  <span className="text-blue-400 font-semibold">{macros.fats}g</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goal Info */}
          <Card className="bg-slate-900/80 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2 text-lg">
                <Target className="h-5 w-5" />
                Seu Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Meta</span>
                  <span className="text-blue-400 font-semibold">
                    {user.goal === "bulking" ? "Ganhar Massa" : "Emagrecer"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Tipo de Treino</span>
                  <span className="text-blue-400 font-semibold">
                    {user.workoutType === "musculacao" ? "Musculação" : "Calistenia"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">TMB</span>
                  <span className="text-blue-400 font-semibold">{Math.round(user.bmr)} kcal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
