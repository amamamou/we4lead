'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Consultant } from '@/types/consultant'

interface ConsultantProfileContentProps {
  consultant: Consultant
}

export function ConsultantProfileContent({ consultant }: ConsultantProfileContentProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-900">À propos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 leading-relaxed text-base">{consultant.description}</p>
              
              {/* Languages */}
              {consultant.languages && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Langues parlées</h4>
                  <div className="flex flex-wrap gap-2">
                    {consultant.languages.map((language: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-gray-200 text-gray-700 bg-gray-50">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Availability Schedule */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-gray-900">Disponibilités</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consultant.workingHours && Object.entries(consultant.workingHours)
                  .filter(([day]) => day !== 'Dimanche')
                  .map(([day, hours]: [string, string[]]) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{day}</span>
                    <span className="text-sm text-gray-600">
                      {hours.length === 0 ? 'Indispo' : 
                       hours.length >= 4 ? `${hours[0]} - ${hours[1]}, ${hours[2]} - ${hours[3]}` :
                       hours.length >= 2 ? `${hours[0]} - ${hours[1]}` : 'Indispo'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}