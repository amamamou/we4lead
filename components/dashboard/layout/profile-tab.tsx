"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Edit, Camera, Save, X, Sun, Moon, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'
import { supabase } from '@/lib/supabaseClient'

interface UniversityData {
  id: number
  nom: string
  ville: string
  adresse: string
  telephone: string
  nbEtudiants: number
  horaire: string | null
  logoPath: string
  code: string
}

interface UserData {
  id: string
  email: string
  nom: string | null
  prenom: string | null
  telephone: string | null
  role: string
  photoPath: string | null
  universite: UniversityData | null
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export function ProfileTab() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [university, setUniversity] = useState<UniversityData | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ name: '', phone: '' })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState<'fr' | 'en'>(
    () => (typeof window !== 'undefined' && (localStorage.getItem('we4lead_lang') as 'fr' | 'en')) || 'fr'
  )

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Get user ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('userId')
      console.log('Retrieved userId from localStorage:', id)
      setUserId(id)
    }
  }, [])

  // Fetch user from Supabase auth and backend for university data
  const fetchUser = async () => {
    try {
      setLoadingUser(true)

      if (!userId) {
        console.log('No userId available')
        setLoadingUser(false)
        return
      }

      // Get token from localStorage
      const token = localStorage.getItem('supabaseAccessToken')

      // Fetch from backend /me endpoint for complete user data with university
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (response.ok) {
            const backendData: UserData = await response.json()
            console.log('Backend user data:', backendData)
            
            setUser(backendData)
            setUniversity(backendData.universite)
            setEditData({ 
              name: `${backendData.prenom || ''} ${backendData.nom || ''}`.trim(), 
              phone: backendData.telephone || '' 
            })
            setAvatarPreview(backendData.photoPath || null)
            setLoadingUser(false)
            return
          }
        } catch (backendErr) {
          console.warn('Backend fetch failed, falling back to Supabase:', backendErr)
        }
      }

      // Fallback to Supabase auth if backend fails
      const { data: authData, error: authError } = await supabase.auth.getUser()
      
      if (!authError && authData?.user) {
        console.log('Auth user data:', authData.user)
        
        const metadata = authData.user.user_metadata || {}
        const email = authData.user.email
        
        setUser({
          id: authData.user.id,
          email: email || '',
          prenom: metadata.full_name?.split(' ')[0] || '',
          nom: metadata.full_name?.split(' ').slice(1).join(' ') || '',
          telephone: metadata.phone || '', // Get phone from metadata
          photoPath: authData.user.avatar_url || null,
          role: metadata.role || 'user',
          universite: null
        })
        
        setEditData({ 
          name: `${metadata.full_name || ''}`.trim(), 
          phone: metadata.phone || '' 
        })
        setAvatarPreview(authData.user.avatar_url || null)
      }
    } catch (err) {
      console.error('Failed to fetch user:', err)
      setSaveError(err instanceof Error ? err.message : 'Failed to load user')
    } finally {
      setLoadingUser(false)
    }
  }

  // Initial fetch when userId is available
  useEffect(() => {
    if (userId) {
      fetchUser()
    } else {
      setLoadingUser(false)
    }
  }, [userId])

  // Update theme & language
  useEffect(() => {
    localStorage.setItem('we4lead_lang', language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    if (!theme) setTheme('light')
  }, [theme, setTheme])

  const initials = editData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  // Handlers
  const handleEdit = () => {
    setIsEditing(true)
    setSaveError(null)
    setSaveSuccess(false)
  }

  const handleCancel = () => {
    if (!user) return
    setIsEditing(false)
    setEditData({ 
      name: `${user.prenom || ''} ${user.nom || ''}`.trim(), 
      phone: user.telephone || '' 
    })
    setAvatarPreview(user.photoPath || null)
    setSaveError(null)
  }

  const handleSave = async () => {
    if (!user || !userId) return

    const nameParts = editData.name.split(' ')
    const prenom = nameParts[0] || ''
    const nom = nameParts.slice(1).join(' ') || ''

    if (editData.name === `${user.prenom || ''} ${user.nom || ''}`.trim() && 
        editData.phone === (user.telephone || '')) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      // 1. Update in auth metadata (includes phone)
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          full_name: editData.name,
          phone: editData.phone // This will be stored in user_metadata
        }
      })

      if (authError) throw authError

      // 2. Also update the phone in auth user metadata (separate call to ensure it's set)
      const { error: updateError } = await supabase.auth.updateUser({
        phone: editData.phone // This updates the phone in auth.phone
      })

      if (updateError) {
        console.warn('Phone update in auth failed:', updateError)
      }

      // 3. Update backend if token exists
      const token = localStorage.getItem('supabaseAccessToken')
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/users/me`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prenom,
              nom,
              telephone: editData.phone
            })
          })

          if (!response.ok) {
            console.warn('Backend update failed with status:', response.status)
          } else {
            const updatedData = await response.json()
            console.log('Backend update successful:', updatedData)
          }
        } catch (backendErr) {
          console.warn('Backend update failed:', backendErr)
        }
      }

      // Update local state
      setUser({ ...user, prenom, nom, telephone: editData.phone })
      
      // Also update localStorage if needed
      localStorage.setItem('userPhone', editData.phone)
      
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Save error:', err)
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    // Preview
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)

    setIsUploading(true)
    setSaveError(null)

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      if (authError) throw authError

      // Update user in state
      setUser({ ...user, photoPath: publicUrl })
      setAvatarPreview(publicUrl)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Photo upload error:', err)
      setSaveError(err instanceof Error ? err.message : 'Failed to upload photo')
      setAvatarPreview(user?.photoPath || null)
    } finally {
      setIsUploading(false)
    }
  }

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">No user ID found. Please log in again.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">Failed to load user profile.</p>
        <button 
          onClick={fetchUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-8xl mx-auto px-0 sm:px-0">
      <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8 space-y-10">

        {/* Success/Error Messages */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Profile updated successfully!
          </div>
        )}
        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {saveError}
          </div>
        )}

        {/* ========= HEADER ========= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          {/* Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">

            <div className="relative">
              <Avatar className="w-20 h-20 rounded-md overflow-hidden bg-[#F3F4F6]">
                <AvatarImage 
                  className="object-cover object-center w-full h-full" 
                  src={avatarPreview || '/placeholder.svg'} 
                />
                <AvatarFallback className="bg-[#F3F4F6] text-gray-600 font-medium rounded-md">
                  {initials || 'U'}
                </AvatarFallback>
              </Avatar>

              {isEditing && !isUploading && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-md p-1.5 hover:bg-gray-50"
                  disabled={isSaving}
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              )}

              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}

              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                className="hidden" 
                disabled={isUploading}
              />
            </div>

            <div className="space-y-1">
              {!isEditing ? (
                <div className="text-xl font-semibold text-gray-900">{editData.name || 'No name set'}</div>
              ) : (
                <input
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-xl font-semibold text-gray-900 border-b border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 text-center sm:text-left w-full"
                  disabled={isSaving}
                  placeholder="Full name"
                />
              )}
              <div className="text-sm text-gray-600 capitalize">{user.role?.toLowerCase() || 'Student'}</div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
          </div>

          {/* Edit button */}
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 text-gray-600" />
              Modifier
            </button>
          )}
        </div>

        {/* ========= CONTACT + ACADEMIC ========= */}
        <div className="grid sm:grid-cols-2 gap-10 border-t border-gray-100 pt-8">

          {/* CONTACT */}
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Contact</div>

            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-500">Email</div>
                <div className="text-gray-900">{user.email}</div>
              </div>

              <div>
                <div className="text-gray-500">Téléphone</div>
                {!isEditing ? (
                  <div className="text-gray-900">{editData.phone || 'Not provided'}</div>
                ) : (
                  <input
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 w-full border-b border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 py-1"
                    disabled={isSaving}
                    placeholder="+216 XX XXX XXX"
                  />
                )}
              </div>
            </div>
          </div>

          {/* ACADEMIC - Now with real university data from backend */}
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Academic</div>

            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-500">Institution</div>
                <div>{university?.nom || user.universite?.nom || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-gray-500">Ville</div>
                <div>{university?.ville || user.universite?.ville || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-gray-500">Adresse</div>
                <div className="text-xs">{university?.adresse || user.universite?.adresse || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-gray-500">Code Université</div>
                <div className="font-mono text-xs">{university?.code || user.universite?.code || 'N/A'}</div>
              </div>
              {university?.telephone && (
                <div>
                  <div className="text-gray-500">Tél. Université</div>
                  <div>{university.telephone}</div>
                </div>
              )}
            </div>
          </div>

        </div>
         {isEditing && (
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
            <button 
              onClick={handleCancel} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
              disabled={isSaving}
            >
              <X className="w-4 h-4" /> Annuler
            </button>
            <button 
              onClick={handleSave} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving || isUploading}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Sauvegarder
                </>
              )}
            </button>
          </div>
        )}

        {/* ========= PREFERENCES ========= */}
        <div className="border-t border-gray-100 pt-8 space-y-6">
          <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Preferences</div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-12">

            {/* Language */}
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Language</div>
              <div className="relative inline-flex bg-gray-100 rounded-lg p-1 w-fit">
                <div className={`absolute top-1 bottom-1 w-[72px] rounded-md bg-white shadow-sm transition-all duration-200 ${language === 'fr' ? 'left-1' : 'left-[73px]'}`} />
                <button 
                  onClick={() => setLanguage('fr')} 
                  className="relative z-10 w-[72px] text-sm py-1.5 text-gray-700"
                  disabled={isSaving}
                >
                  🇫🇷 FR
                </button>
                <button 
                  onClick={() => setLanguage('en')} 
                  className="relative z-10 w-[72px] text-sm py-1.5 text-gray-700"
                  disabled={isSaving}
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Appearance</div>
              <div className="relative inline-flex bg-gray-100 rounded-lg p-1 w-fit">
                <div className={`absolute top-1 bottom-1 w-[88px] rounded-md bg-white shadow-sm transition-all duration-200 ${theme === 'light' ? 'left-1' : 'left-[89px]'}`} />
                <button 
                  onClick={() => setTheme('light')} 
                  className="relative z-10 flex items-center justify-center gap-2 w-[88px] py-1.5 text-sm text-gray-700"
                  disabled={isSaving}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
                <button 
                  onClick={() => setTheme('dark')} 
                  className="relative z-10 flex items-center justify-center gap-2 w-[88px] py-1.5 text-sm text-gray-700"
                  disabled={isSaving}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
              </div>
            </div>

          </div>
        </div>

       

      </div>
    </div>
  )
}