"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { userStorage } from "@/lib/storage"
import type { User } from "@/lib/types"
import { UserIcon, LogOut, Info } from "lucide-react"
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

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = userStorage.get()
    if (!userData) {
      router.push("/onboarding")
      return
    }
    setUser(userData)
  }, [router])

  const handleLogout = () => {
    userStorage.clear()
    router.push("/onboarding")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pb-20 md:pt-20">
      <Navigation />

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-balance">Configurações</h1>

        <div className="space-y-4">
          <Card className="bg-slate-900/80 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Nome</span>
                <span className="text-slate-200 font-semibold">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="text-slate-200 font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Idade</span>
                <span className="text-slate-200 font-semibold">{user.age} anos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Altura</span>
                <span className="text-slate-200 font-semibold">{user.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peso</span>
                <span className="text-slate-200 font-semibold">{user.weight} kg</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/80 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Meta</span>
                <span className="text-slate-200 font-semibold">
                  {user.goal === "bulking" ? "Ganhar Massa" : "Emagrecer"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tipo de Treino</span>
                <span className="text-slate-200 font-semibold">
                  {user.workoutType === "musculacao" ? "Musculação" : "Calistenia"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nível de Atividade</span>
                <span className="text-slate-200 font-semibold capitalize">{user.activityLevel}</span>
              </div>
            </CardContent>
          </Card>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sair da Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-slate-100">Sair da conta?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Você precisará fazer o onboarding novamente para acessar o app.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300">Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                  Sair
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
