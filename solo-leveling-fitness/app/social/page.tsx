"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Navigation } from "@/components/navigation"
import { userStorage, postsStorage } from "@/lib/storage"
import type { User, Post } from "@/lib/types"
import { Heart, MessageCircle, Plus, Dumbbell, Utensils, Trophy } from "lucide-react"
import Link from "next/link"

export default function SocialPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const userData = userStorage.get()
    if (!userData) {
      router.push("/onboarding")
      return
    }
    setUser(userData)
    loadPosts()
  }, [router])

  const loadPosts = () => {
    const allPosts = postsStorage.getAll()
    setPosts(allPosts)
  }

  const handleLike = (postId: string) => {
    if (!user) return
    postsStorage.like(postId, user.id)
    loadPosts()
  }

  const getPostIcon = (type: Post["type"]) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="h-4 w-4" />
      case "meal":
        return <Utensils className="h-4 w-4" />
      case "achievement":
        return <Trophy className="h-4 w-4" />
    }
  }

  const getPostTypeLabel = (type: Post["type"]) => {
    switch (type) {
      case "workout":
        return "Treino"
      case "meal":
        return "Alimentação"
      case "achievement":
        return "Conquista"
    }
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 mb-2 text-balance">Feed Social</h1>
            <p className="text-slate-400 text-pretty">Compartilhe seu progresso</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/social/create">
              <Plus className="h-4 w-4 mr-2" />
              Postar
            </Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <Card className="bg-slate-900/80 border-blue-500/30">
            <CardContent className="py-12 text-center">
              <MessageCircle className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">Nenhuma postagem ainda</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/social/create">Criar Primeira Postagem</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="bg-slate-900/80 border-blue-500/30">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 bg-blue-600">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {post.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-200">{post.userName}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-blue-400">
                        {getPostIcon(post.type)}
                        <span>{getPostTypeLabel(post.type)}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-slate-200 mb-2">{post.title}</h3>
                    <p className="text-slate-400 text-sm whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {post.imageUrl && (
                    <div className="rounded-lg overflow-hidden bg-slate-800">
                      <img src={post.imageUrl || "/placeholder.svg"} alt={post.title} className="w-full h-auto" />
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        post.isLiked ? "text-red-400" : "text-slate-400 hover:text-red-400"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>Comentar</span>
                    </button>
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
