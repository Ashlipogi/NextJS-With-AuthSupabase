"use client"

import Link from "next/link"
import { useAuth } from "./components/AuthProvider"
import { Button } from "./components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { ArrowRight, Shield, Zap, Users } from "lucide-react"

export default function HomePage() {
  const { session } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">FIRSTNEXT</h1>
            <div className="flex items-center space-x-4">
              {session ? (
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">Welcome to FIRSTNEXT</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern authentication system built with Next.js and Supabase, featuring elegant UI components and
              seamless user experience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>Built with Supabase for enterprise-grade security and reliability.</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Modern UI</CardTitle>
              <CardDescription>
                Beautiful, responsive design with shadcn/ui components and dark mode support.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>User-Friendly</CardTitle>
              <CardDescription>Intuitive interface with clear feedback and smooth user experience.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
}
