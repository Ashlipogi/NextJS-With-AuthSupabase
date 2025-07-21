'use client'

import { useAuth } from './components/AuthProvider'
import Link from 'next/link'
import { Button } from './components/ui/button'

export default function Home() {
  const { session, user, isLoading, signOut } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to FIRSTNEXT
          </h1>
          
          {session && user ? (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Hello, {user.email}!
                </h2>
                <p className="text-gray-600">
                  You are successfully signed in.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link href="/dashboard">
                  <Button className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                
                <Button 
                  onClick={() => signOut()} 
                  variant="outline" 
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-600 mb-6">
                Get started by signing in or creating a new account.
              </p>
              
              <div className="space-y-4">
                <Link href="/login">
                  <Button className="w-full">
                    Sign In
                  </Button>
                </Link>
                
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}