import { useState } from 'react'
import { Mail, Phone, Edit, Building2, GraduationCap, Calendar, Hash, Save, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Profil Personnel</h2>
        {!isEditing ? (
          <button 
            onClick={handleEdit}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier le profil
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
            <button 
              onClick={handleCancel}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-2"
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
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-gray-200">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={editData.name} />
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
          <div className="flex-1">
            {!isEditing ? (
              <>
                <h3 className="text-xl font-semibold text-foreground mb-1">{editData.name}</h3>
                <p className="text-gray-600 text-sm">{major}</p>
                <p className="text-gray-500 text-sm">{institution}</p>
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
                <p className="text-gray-600 text-sm">{major}</p>
                <p className="text-gray-500 text-sm">{institution}</p>
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
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 min-w-[100px]">Email:</span>
                <span className="text-foreground font-medium">{email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 min-w-[100px]">Téléphone:</span>
                {!isEditing ? (
                  <span className="text-foreground font-medium">{editData.phone}</span>
                ) : (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 text-sm text-foreground font-medium bg-white border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Téléphone"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Informations Académiques</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 min-w-[100px]">Institution:</span>
                <span className="text-foreground font-medium">{institution}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 min-w-[100px]">Spécialité:</span>
                <span className="text-foreground font-medium">{major}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 min-w-[100px]">Niveau:</span>
                <span className="text-foreground font-medium">{year}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 min-w-[100px]">Inscription:</span>
                <span className="text-foreground font-medium font-mono">{enrollment}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
