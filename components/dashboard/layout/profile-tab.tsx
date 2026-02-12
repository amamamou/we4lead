"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Edit, Camera, Save, X, Sun, Moon } from 'lucide-react'
import DashboardFooter from './DashboardFooter'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'

interface ProfileTabProps {
  name: string
  email: string
  phone: string
  enrollment: string
  major: string
  year: string
  institution: string
  avatar: string
}

export function ProfileTab({
  name,
  email,
  phone,
  enrollment,
  major,
  year,
  institution,
  avatar
}: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name,
    phone
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatar || null)
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState<'fr' | 'en'>(() => (typeof window !== 'undefined' && (localStorage.getItem('we4lead_lang') as 'fr' | 'en')) || 'fr')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    // Ici vous pouvez ajouter la logique pour sauvegarder les données
    console.log('Données sauvegardées:', editData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      name,
      phone
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  // Persist language selection and set html lang for immediate effect
  useEffect(() => {
    try {
      localStorage.setItem('we4lead_lang', language)
      if (typeof document !== 'undefined') document.documentElement.lang = language
    } catch { /* ignore */ }
  }, [language])

  // Ensure theme is synced to next-themes default
  useEffect(() => {
    if (!theme) setTheme('light')
  }, [theme, setTheme])

  return (
    <div className="max-w-8xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 space-y-10">

      {/* Header / title */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
      </div>

      {/* Top: avatar + name */}
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white relative flex-shrink-0">
          <Avatar className="w-20 h-20 rounded-xl">
            <AvatarImage src={avatarPreview || avatar || '/placeholder.svg'} alt={editData.name} className="object-cover w-full h-full rounded-xl" />
            <AvatarFallback className="bg-gray-100 text-gray-600 text-sm font-medium rounded-xl flex items-center justify-center">
              {editData.name.split(' ').reduce((initials, word) => initials + word[0], '')}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Modifier la photo"
            >
              <span className="bg-white/80 backdrop-blur p-2 rounded-md">
                <Camera className="w-4 h-4 text-gray-600" />
              </span>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-lg font-semibold text-gray-900 truncate">{editData.name}</div>
          <div className="text-sm text-gray-900 mt-1 truncate">{major} • {institution}</div>
        </div>

        <div className="flex-shrink-0">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            >
              <Edit className="w-4 h-4 text-gray-600" />
              Modifier
            </button>
          ) : null}
        </div>
      </div>

      {/* Personal Information */}
      <div className="border-t border-gray-100 pt-6">
        <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Personal Information</div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-gray-500">Email</div>
            <div className="text-sm text-gray-900">{email}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Téléphone</div>
            {!isEditing ? (
              <div className="text-sm text-gray-900">{editData.phone}</div>
            ) : (
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full text-sm bg-transparent border-b border-gray-200 px-0 py-1 focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="Téléphone"
              />
            )}
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="border-t border-gray-100 pt-6">
        <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Academic Information</div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-xs text-gray-500">Institution</div>
            <div className="text-sm text-gray-900">{institution}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Spécialité</div>
            <div className="text-sm text-gray-900">{major}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Niveau</div>
            <div className="text-sm text-gray-900">{year}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Inscription</div>
            <div className="text-sm text-gray-900 font-mono">{enrollment}</div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="border-t border-gray-100 pt-6">
        <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Preferences</div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-xs text-gray-500">Language</div>
            <div className="mt-2">
              <div className="inline-flex border border-gray-200 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => { console.debug('lang fr'); setLanguage('fr') }}
                  className={`px-3 py-1 text-sm ${language === 'fr' ? 'bg-[#020E68] text-white rounded-md' : 'text-gray-700'}`}
                >
                  FR
                </button>
                <button
                  type="button"
                  onClick={() => { console.debug('lang en'); setLanguage('en') }}
                  className={`px-3 py-1 text-sm ${language === 'en' ? 'bg-[#020E68] text-white rounded-md' : 'text-gray-700'}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Appearance</div>
            <div className="mt-2">
              <div className="inline-flex border border-gray-200 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => { console.debug('set light'); setTheme?.('light') }}
                  className={`inline-flex items-center gap-2 px-2 py-1 text-xs whitespace-nowrap ${theme === 'light' ? 'bg-[#020E68] text-white rounded-md ring-1 ring-[#020E68]/30' : 'text-gray-700'}`}
                >
                  <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-white' : 'text-gray-600'}`} />
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => { console.debug('set dark'); setTheme?.('dark') }}
                  className={`inline-flex items-center gap-2 px-2 py-1 text-xs whitespace-nowrap ${theme === 'dark' ? 'bg-[#020E68] text-white rounded-md ring-1 ring-[#020E68]/30' : 'text-gray-700'}`}
                >
                  <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions (no divider under Preferences) */}
      <div className="pt-6 flex items-center justify-end gap-3">
        {isEditing ? (
          <>
            <button type="button" onClick={handleCancel} className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
              <X className="w-4 h-4 text-gray-600" />
              Annuler
            </button>
            <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
              <Save className="w-4 h-4 text-gray-600" />
              Sauvegarder
            </button>
          </>
        ) : null}
      </div>
      </div>
      {/* Desktop-only footer for Profile page (aligned right) */}
      <div className="hidden md:flex mt-6 justify-end items-start">
        <div className="w-64">
          <DashboardFooter />
        </div>
      </div>
    </div>
  )
}
