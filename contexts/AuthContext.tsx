'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

// Types
export type UserRole = 'medecin' | 'patient' | 'admin' | 'super_admin'

export interface BackendUser {
  id: string
  email: string
  nom: string
  prenom: string
  telephone?: string
  role: UserRole
  photoPath?: string
  universites?: any[] // For medecins
  universite?: any // For admins
}

interface AuthContextType {
  user: BackendUser | null
  supabaseUser: any | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  hasRole: (roles: UserRole | UserRole[]) => boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  
  const router = useRouter()

  // Sync with backend to get user details
  const syncWithBackend = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!res.ok) throw new Error('Backend /me failed')

      const backendUser = await res.json()
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(backendUser))
      localStorage.setItem('userId', backendUser.id)
      localStorage.setItem('userRole', backendUser.role)
      
      if (backendUser.universite?.id) {
        localStorage.setItem('universityId', backendUser.universite.id.toString())
      } else {
        localStorage.removeItem('universityId')
      }
      
      setUser(backendUser)
      return backendUser
    } catch (err) {
      console.error('Backend sync error:', err)
      return null
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true)
      
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setSupabaseUser(session.user)
          
          const accessToken = session.access_token
          localStorage.setItem('supabaseAccessToken', accessToken)
          setToken(accessToken)
          
          // Try to get user from localStorage first (faster)
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
          
          // Sync with backend to get fresh data
          await syncWithBackend(accessToken)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        
        if (session?.user) {
          setSupabaseUser(session.user)
          
          const accessToken = session.access_token
          localStorage.setItem('supabaseAccessToken', accessToken)
          setToken(accessToken)
          
          // Sync with backend
          await syncWithBackend(accessToken)
          
          // Refresh the page to update UI
          router.refresh()
        } else {
          // User is logged out
          setSupabaseUser(null)
          setUser(null)
          setToken(null)
          localStorage.removeItem('supabaseAccessToken')
          localStorage.removeItem('user')
          localStorage.removeItem('userId')
          localStorage.removeItem('userRole')
          localStorage.removeItem('universityId')
          
          router.refresh()
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, syncWithBackend])

  // Auto-refresh token
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) return

      const { access_token } = data.session
      localStorage.setItem('supabaseAccessToken', access_token)
      setToken(access_token)
    }, 30 * 60 * 1000) // 30 minutes

    return () => clearInterval(interval)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      
      // Auth state change will handle the rest
    } catch (err: any) {
      setError(err.message || 'Échec de connexion')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const signup = async (email: string, password: string, fullName: string) => {
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/verify`,
        },
      })

      if (error) throw error
      
      // Auth state change will handle the rest
    } catch (err: any) {
      setError(err.message || "Échec de l'inscription")
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setLoading(true)
    
    try {
      await supabase.auth.signOut()
      // Auth state change will handle cleanup
    } catch (err: any) {
      console.error('Logout error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Refresh user data
  const refreshUser = useCallback(async () => {
    const accessToken = localStorage.getItem('supabaseAccessToken')
    if (!accessToken || !supabaseUser) return
    
    setLoading(true)
    await syncWithBackend(accessToken)
    setLoading(false)
  }, [supabaseUser, syncWithBackend])

  // Check if user has required role(s)
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false
    
    const roleList = Array.isArray(roles) ? roles : [roles]
    return roleList.includes(user.role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        loading,
        error,
        login,
        signup,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        hasRole,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}