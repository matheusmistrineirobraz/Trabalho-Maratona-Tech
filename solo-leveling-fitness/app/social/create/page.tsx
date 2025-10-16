"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { userStorage, postsStorage } from "@/lib/storage"
import type { Post, PostType } from "@/lib/types"
import { ArrowLeft, Dumbbell, Utensils, Trophy } from "lucide-react"

export default function CreatePostPage() {
  const router = useRouter()
  const [postType, setPostType] = useState<PostType>("workout")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    const user = userStorage.get()
    if (!user) {
      router.push("/onboarding")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const user = userStorage.get()
    if (!user) return

    const post: Post = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      type: postType,
      title,
      content,
      likes: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
    }

    postsStorage.add(post)
    router.push("/social")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 pb-20 md:pt-20">
      <Navigation />

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Button onClick={() => router.back()} variant="ghost" className="mb-4 text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="bg-slate-900/80 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-blue-400">Nova Postagem</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-slate-200">Tipo de Postagem</Label>
                <RadioGroup value={postType} onValueChange={(value) => setPostType(value as PostType)}>
                  <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                    <RadioGroupItem value="workout" id="workout" />
                    <Label htmlFor="workout" className="flex items-center gap-2 flex-1 cursor-pointer text-slate-200">
                      <Dumbbell className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="font-semibold">Treino</div>
                        <div className="text-sm text-slate-400">Compartilhe seu treino do dia</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                    <RadioGroupItem value="meal" id="meal" />
                    <Label htmlFor="meal" className="flex items-center gap-2 flex-1 cursor-pointer text-slate-200">
                      <Utensils className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="font-semibold">Alimentação</div>
                        <div className="text-sm text-slate-400">Mostre suas refeições</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                    <RadioGroupItem value="achievement" id="achievement" />
                    <Label
                      htmlFor="achievement"
                      className="flex items-center gap-2 flex-1 cursor-pointer text-slate-200"
                    >
                      <Trophy className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="font-semibold">Conquista</div>
                        <div className="text-sm text-slate-400">Celebre suas metas alcançadas</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-200">
                  Título
                </Label>
                <Input
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-slate-100"
                  placeholder="Ex: Treino de Peito Completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-200">
                  Descrição
                </Label>
                <Textarea
                  id="content"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-slate-100 min-h-32"
                  placeholder="Conte mais sobre seu treino, alimentação ou conquista..."
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Publicar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
