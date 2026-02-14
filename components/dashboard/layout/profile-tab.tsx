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
  showAcademic?: boolean
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
  , showAcademic = true
}: ProfileTabProps) {

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ name, phone })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatar || null)
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState<'fr' | 'en'>(
    () => (typeof window !== 'undefined' && (localStorage.getItem('we4lead_lang') as 'fr' | 'en')) || 'fr'
  )

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleEdit = () => setIsEditing(true)

  const handleSave = () => {
    setIsEditing(false)
    // API save here later
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({ name, phone })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    localStorage.setItem('we4lead_lang', language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    if (!theme) setTheme('light')
  }, [theme, setTheme])

  const initials = editData.name.split(' ').map(w => w[0]).join('')

 return (
  <div className="max-w-8xl mx-auto px-0 sm:px-0">

    <div className="bg-white rounded-lg shadow-sm p-5 sm:p-8 space-y-10">

      {/* ========= HEADER ========= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

        {/* Identity */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">

          <div className="relative">
            <Avatar className="w-20 h-20 rounded-md overflow-hidden bg-[#F3F4F6]">
              <AvatarImage className="object-cover object-center w-full h-full" src={avatarPreview || avatar || '/placeholder.svg'} />
              <AvatarFallback className="bg-[#F3F4F6] text-gray-600 font-medium rounded-md">
                {initials}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-md p-1.5 hover:bg-gray-50"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>

          <div className="space-y-1">
            {!isEditing ? (
              <div className="text-xl font-semibold text-gray-900">{editData.name}</div>
            ) : (
              <input
                value={editData.name}
                onChange={(e)=>setEditData(prev=>({...prev,name:e.target.value}))}
                className="text-xl font-semibold text-gray-900 border-b border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 text-center sm:text-left"
              />
            )}

            <div className="text-sm text-gray-600">{institution}</div>
            <div className="text-xs text-gray-400">{email}</div>
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
              <div className="text-gray-900">{email}</div>
            </div>

            <div>
              <div className="text-gray-500">Téléphone</div>
              {!isEditing ? (
                <div className="text-gray-900">{editData.phone}</div>
              ) : (
                <input
                  value={editData.phone}
                  onChange={(e)=>setEditData(prev=>({...prev,phone:e.target.value}))}
                  className="mt-1 w-full border-b border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300 py-1"
                />
              )}
            </div>
          </div>
        </div>

        {/* ACADEMIC */}
        {showAcademic && (
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Academic</div>

            <div className="space-y-3 text-sm">
              <div><div className="text-gray-500">Institution</div><div>{institution}</div></div>
              <div><div className="text-gray-500">Spécialité</div><div>{major}</div></div>
              <div><div className="text-gray-500">Niveau</div><div>{year}</div></div>
            </div>
          </div>
        )}

      </div>


      {/* ========= PREFERENCES ========= */}
      <div className="border-t border-gray-100 pt-8 space-y-6">

        <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Preferences</div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-12">

          {/* Language */}
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Language</div>

            <div className="relative inline-flex bg-gray-100 rounded-lg p-1 w-fit">
              <div className={`absolute top-1 bottom-1 w-[72px] rounded-md bg-white shadow-sm transition-all duration-200 ${language==='fr'?'left-1':'left-[73px]'}`} />
              <button onClick={()=>setLanguage('fr')} className="relative z-10 w-[72px] text-sm py-1.5 text-gray-700">🇫🇷 FR</button>
              <button onClick={()=>setLanguage('en')} className="relative z-10 w-[72px] text-sm py-1.5 text-gray-700">🇬🇧 EN</button>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Appearance</div>

            <div className="relative inline-flex bg-gray-100 rounded-lg p-1 w-fit">
              <div className={`absolute top-1 bottom-1 w-[88px] rounded-md bg-white shadow-sm transition-all duration-200 ${theme==='light'?'left-1':'left-[89px]'}`} />
              <button onClick={()=>setTheme('light')} className="relative z-10 flex items-center justify-center gap-2 w-[88px] py-1.5 text-sm text-gray-700">
                <Sun className="w-4 h-4"/> Light
              </button>
              <button onClick={()=>setTheme('dark')} className="relative z-10 flex items-center justify-center gap-2 w-[88px] py-1.5 text-sm text-gray-700">
                <Moon className="w-4 h-4"/> Dark
              </button>
            </div>
          </div>

        </div>
      </div>


      {/* ========= ACTIONS ========= */}
      {isEditing && (
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button onClick={handleCancel} className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50">
            <X className="w-4 h-4"/> Annuler
          </button>
          <button onClick={handleSave} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50">
            <Save className="w-4 h-4"/> Sauvegarder
          </button>
        </div>
      )}

    </div>

  </div>
)

}
