"use client"

import type React from "react"

import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { MoonIcon, SunIcon, LogOut, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "./AuthProvider"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export function Layout({ children, title = "Dashboard" }: LayoutProps) {
  const { theme, setTheme } = useTheme()
  const { signOut, user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      setTimeout(() => {
        router.push("/login")
      }, 500)
    } catch {
      toast.error("Error signing out")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9"
              >
                <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-block">{user?.email}</span>
              </div>

              <Button variant="outline" size="sm" onClick={handleSignOut} className="h-9 bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
