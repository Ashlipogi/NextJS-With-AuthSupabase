'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient, Session, User } from '@supabase/supabase-js'
import { toast } from 'sonner'

type AuthContextType = {
  supabase: SupabaseClient
  session: Session | null
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          toast.error('Error loading session')
        }
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        toast.error('Error loading authentication')
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error signing out:', error)
      toast.error('Error signing out: ' + error.message)
    } else {
      console.error('Unknown error signing out:', error)
      toast.error('An unknown error occurred during sign out.')
    }
    throw error
  }
}


  return (
    <AuthContext.Provider value={{
      supabase,
      session,
      user,
      isLoading,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
