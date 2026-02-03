'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@student.us.tn',
    phone: '+216 23 456 789',
    university: 'Université de Sousse',
    faculty: 'Faculté des Sciences Économiques et de Gestion',
    level: 'Master 2',
    field: 'Informatique de Gestion',
    bio: 'Étudiant en Master 2 Informatique de Gestion à l&apos;Université de Sousse. Passionné par le développement web et les nouvelles technologies. À la recherche d&apos;opportunités de stage et de conseils pour mon orientation professionnelle.',
    interests: ['Développement Web', 'Intelligence Artificielle', 'Entrepreneuriat', 'Leadership']
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // Here you would typically save to your backend
    setIsEditing(false)
    // Show success message
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data if needed
  }

  return (
    <main className="bg-white min-h-screen">
      <Header />

      {/* ================= HEADER ================= */}
      <section className="pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-[#0A1A3A] mb-2">
                Mon profil
              </h1>
              <p className="text-gray-600">
                Gérez vos informations personnelles et vos préférences
              </p>
            </div>
            
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier le profil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>
                    Enregistrer
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ================= PROFILE OVERVIEW ================= */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Card */}
              <Card>
                <CardContent className="p-6 text-center">
                  {/* Avatar */}
                  <div className="w-24 h-24 mx-auto rounded-full bg-[#2B61D6] flex items-center justify-center mb-4">
                    <span className="text-white text-2xl font-semibold">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-[#0A1A3A] mb-1">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-[#2B61D6] text-sm mb-2">
                    {formData.level} - {formData.field}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {formData.university}
                  </p>
                  
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Compte actif
                  </Badge>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consultations</span>
                    <span className="font-semibold text-[#0A1A3A]">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conseiller favori</span>
                    <span className="font-semibold text-[#0A1A3A]">Dr. Martin</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Membre depuis</span>
                    <span className="font-semibold text-[#0A1A3A]">Jan 2026</span>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* ================= PROFILE DETAILS ================= */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{formData.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{formData.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{formData.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{formData.phone}</p>
                    )}
                  </div>

                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations académiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  <div>
                    <Label htmlFor="university">Université</Label>
                    {isEditing ? (
                      <Input
                        id="university"
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{formData.university}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="faculty">Faculté</Label>
                    {isEditing ? (
                      <Input
                        id="faculty"
                        value={formData.faculty}
                        onChange={(e) => handleInputChange('faculty', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{formData.faculty}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="level">Niveau d&apos;études</Label>
                      {isEditing ? (
                        <Input
                          id="level"
                          value={formData.level}
                          onChange={(e) => handleInputChange('level', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{formData.level}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="field">Spécialité</Label>
                      {isEditing ? (
                        <Input
                          id="field"
                          value={formData.field}
                          onChange={(e) => handleInputChange('field', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{formData.field}</p>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">À propos de moi</CardTitle>
                </CardHeader>
                <CardContent>
                  
                  <div>
                    <Label htmlFor="bio">Biographie</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder="Parlez-nous de vous, vos objectifs, vos intérêts..."
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 leading-relaxed">{formData.bio}</p>
                    )}
                  </div>

                </CardContent>
              </Card>

              {/* Interests */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Centres d&apos;intérêt</CardTitle>
                </CardHeader>
                <CardContent>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="border-[#2B61D6] text-[#2B61D6]">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  {isEditing && (
                    <div className="mt-4">
                      <Label htmlFor="newInterest">Ajouter un intérêt</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="newInterest"
                          placeholder="Ex: Marketing Digital"
                          className="flex-1"
                        />
                        <Button size="sm">Ajouter</Button>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}