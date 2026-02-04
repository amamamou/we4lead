"use client"

import { useState } from 'react'
import { Mail, Phone, Edit, Building2, Calendar, Hash, Save, X, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface DoctorProfileProps {
  name: string
  email: string
  phone: string
  specialty: string
  institution: string
  experience: string
  avatar: string
  licenseNumber: string
  address: string
}

export function DoctorProfile({
  name,
  email,
  phone,
  specialty,
  institution,
  experience,
  avatar,
  licenseNumber,
  address
}: DoctorProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ name, phone })

  const handleEdit = () => setIsEditing(true)
  const handleSave = () => {
    setIsEditing(false)
    // persist changes (placeholder)
    console.log('Saved doctor profile:', editData)
  }
  const handleCancel = () => {
    setIsEditing(false)
    setEditData({ name, phone })
  }

  const handleInputChange = (field: string, value: string) =>
    setEditData((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-foreground">Profil Professionnel</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier le profil
          </button>
        ) : (
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
            <button
              onClick={handleCancel}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="space-y-8">
        {/* User Info Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-gray-200">
              <AvatarImage src={avatar || '/placeholder.svg'} alt={editData.name} />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-xl font-semibold">
                {editData.name.split(' ').reduce((initials, word) => initials + word[0], '')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border border-gray-200 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1 w-full">
            {!isEditing ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-1">{editData.name}</h3>
                {specialty && <p className="text-gray-600 text-sm">{specialty}</p>}
                {institution && <p className="text-gray-500 text-sm">{institution}</p>}
              </>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="block w-full text-xl font-semibold text-foreground bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom complet"
                />
                {specialty && <p className="text-gray-600 text-sm">{specialty}</p>}
                {institution && <p className="text-gray-500 text-sm">{institution}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contact</h4>
                <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 sm:min-w-[100px]">Email:</span>
                  <span className="text-foreground font-medium">{email}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 sm:min-w-[100px]">Téléphone:</span>
                  {!isEditing ? (
                    <span className="text-foreground font-medium">{editData.phone}</span>
                  ) : (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full sm:flex-1 text-sm text-foreground font-medium bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Téléphone"
                    />
                  )}
                </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Informations Professionnelles</h4>
            <div className="space-y-3">
              {institution && (
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 min-w-[100px]">Établissement:</span>
                  <span className="text-foreground font-medium">{institution}</span>
                </div>
              )}
              {experience && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 min-w-[100px]">Expérience:</span>
                  <span className="text-foreground font-medium">{experience}</span>
                </div>
              )}
              {licenseNumber && (
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 min-w-[100px]">Numéro de Licence:</span>
                  <span className="text-foreground font-medium font-mono">{licenseNumber}</span>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 min-w-[100px]">Adresse:</span>
                  <span className="text-foreground font-medium">{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
