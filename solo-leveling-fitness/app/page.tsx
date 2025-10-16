"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { userStorage } from "@/lib/storage"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = userStorage.get()
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/onboarding")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
      <div className="text-blue-400 text-xl">Carregando...</div>
    </div>
  )
}
