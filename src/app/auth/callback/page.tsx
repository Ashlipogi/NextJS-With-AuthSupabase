'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../components/AuthProvider'
import { Suspense } from 'react'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { supabase } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const type = searchParams.get('type')
      
      // Handle password recovery
      if (type === 'recovery') {
        try {
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Error getting session for recovery:', error)
            router.push('/forgot-password?error=invalid_link')
            return
          }

          if (data.session) {
            router.push('/reset-password')
            return
          } else {
            const code = searchParams.get('code')
            if (code) {
              const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
              
              if (exchangeError) {
                console.error('Error exchanging code:', exchangeError)
                router.push('/forgot-password?error=invalid_link')
                return
              }
              
              if (exchangeData.session) {
                router.push('/reset-password')
                return
              }
            }
            
            console.error('No valid session or code found for recovery')
            router.push('/forgot-password?error=invalid_link')
            return
          }
        } catch (error) {
          console.error('Error in recovery flow:', error)
          router.push('/forgot-password?error=invalid_link')
          return
        }
      }
      
      // Handle regular auth callback
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error during auth callback:', error)
          router.push('/login?error=callback_error')
          return
        }

        if (data.session) {
          router.push('/dashboard')
        } else {
          const code = searchParams.get('code')
          if (code) {
            const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
            
            if (exchangeError) {
              console.error('Error exchanging code:', exchangeError)
              router.push('/login?error=callback_error')
              return
            }
            
            if (exchangeData.session) {
              router.push('/dashboard')
            } else {
              router.push('/login')
            }
          } else {
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('Error in regular auth callback:', error)
        router.push('/login?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [supabase, router, searchParams])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <h2 className="text-lg font-semibold text-foreground">Processing...</h2>
        <p className="text-muted-foreground">Please wait while we verify your request.</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-lg font-semibold text-foreground">Loading...</h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}