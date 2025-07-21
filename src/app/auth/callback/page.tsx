'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../components/AuthProvider'

export default function AuthCallback() {
  const router = useRouter()
  const { supabase } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error during auth callback:', error)
        router.push('/login?error=callback_error')
        return
      }

      if (data.session) {
        router.push('/')
      } else {
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [supabase, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
        <p className="text-gray-600">Please wait while we verify your email address.</p>
      </div>
    </div>
  )
}