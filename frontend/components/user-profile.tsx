"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserProfile() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // サーバーサイドでは中身をレンダリングせず、ハイドレーションエラーを防ぐ
  if (!mounted) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* buttonタグとしてレンダリングされるようにする */}
        <button className="outline-none">
          <Avatar className="h-8 w-8 border hover:opacity-80 transition-opacity">
            <AvatarImage src="" alt="User profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>マイアカウント</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>プロフィール設定</DropdownMenuItem>
        <DropdownMenuItem>システム設定</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">ログアウト</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}