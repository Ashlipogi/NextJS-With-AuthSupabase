"use client"

import { useAuth } from "../components/AuthProvider"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { Layout } from "../components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Skeleton } from "../components/ui/skeleton"
import { User, Mail, Calendar, Shield, Clock } from "lucide-react"
import { toast } from "sonner"
import { CredentialsTable } from "../components/credentials/CredentialsTable"

export default function Dashboard() {
  const { session, user, isLoading } = useAuth()
  const router = useRouter()
  const hasWelcomed = useRef(false)

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login")
    }
    // Show welcome toast only once when user is present
    if (!isLoading && session && user && !hasWelcomed.current) {
      toast.success("Welcome back!")
      hasWelcomed.current = true
    }
  }, [session, isLoading, router, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back!</h2>
          <p className="text-muted-foreground">Here's an overview of your account and credentials.</p>
        </div>

        {/* User Info Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-sm text-muted-foreground break-all">{user.email}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">ID:</span>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{user.id.slice(0, 8)}...</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status Card */}
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verification</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Status</span>
                  <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                    {user.email_confirmed_at ? "Verified" : "Pending"}
                  </Badge>
                </div>
                {user.email_confirmed_at && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Verified on {new Date(user.email_confirmed_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Card */}
          <Card className="shadow-md md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Last Sign In</p>
                  <p className="text-xs text-muted-foreground">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-xs text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credentials Management Section */}
        <CredentialsTable />

        {/* Getting Started Section */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Security Tips</CardTitle>
            <CardDescription>
              Keep your credentials safe with these best practices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Use Strong Passwords</h4>
                <p className="text-sm text-muted-foreground">
                  Create unique, complex passwords for each account to enhance security.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Regular Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Review and update your stored credentials regularly for optimal security.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Secure Access</h4>
                <p className="text-sm text-muted-foreground">
                  Your credentials are encrypted and only accessible to you.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Backup Important Data</h4>
                <p className="text-sm text-muted-foreground">
                  Consider keeping secure backups of critical credentials.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}