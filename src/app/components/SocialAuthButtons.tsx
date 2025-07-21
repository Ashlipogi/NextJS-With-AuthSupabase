'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Button } from './ui/button'
import { Mail, Facebook } from 'lucide-react'

interface SocialAuthButtonsProps {
  mode: 'login' | 'register'
}

export function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
  const { supabase } = useAuth()
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setLoadingProvider(provider)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error(`${provider} auth error:`, error)
        alert(`Error signing in with ${provider}: ${error.message}`)
      }
    } catch (error) {
      console.error(`${provider} auth error:`, error)
      alert(`An unexpected error occurred with ${provider} authentication`)
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or {mode === 'login' ? 'sign in' : 'sign up'} with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialAuth('google')}
          disabled={loadingProvider !== null}
          className="w-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          {loadingProvider === 'google' ? (
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <Mail className="w-4 h-4 text-red-500" />
          )}
          <span className="text-sm font-medium">Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialAuth('facebook')}
          disabled={loadingProvider !== null}
          className="w-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          {loadingProvider === 'facebook' ? (
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <Facebook className="w-4 h-4 text-blue-600" />
          )}
          <span className="text-sm font-medium">Facebook</span>
        </Button>
      </div>
    </div>
  )
}