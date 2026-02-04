import { Building2, MapPin, Phone, Mail, Globe } from 'lucide-react'
import Image from 'next/image'

export function InstitutionTab() {
  // This would come from the student's actual faculty data
  const studentFaculty = {
    name: 'Faculté de Médecine de Sousse',
    code: 'FMS',
    address: 'Avenue Mohamed Karoui, 4000 Sousse',
    phone: '+216 73 325 300',
    email: 'decanat@fms.rnu.tn',
    website: 'www.fms.rnu.tn',
    services: ['Consultation Psychologique', 'Orientation Académique', 'Support Étudiant', 'Services Médicaux']
  }

  return (
    <div className="space-y-8">
      {/* Title Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Mon Institution</h2>
      </div>

      {/* Institution Content */}
      <div className="space-y-8">
        {/* Faculty Info Section (Main) */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-gray-200 p-2">
            <Image 
              src="/universitedesousse.png" 
              alt="Université de Sousse" 
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-semibold text-foreground">{studentFaculty.name}</h3>
              <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">
                {studentFaculty.code}
              </span>
            </div>
            <p className="text-gray-600 text-sm">Université de Sousse</p>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 min-w-[100px]">Adresse:</span>
                <span className="text-foreground font-medium">{studentFaculty.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 min-w-[100px]">Téléphone:</span>
                <span className="text-foreground font-medium">{studentFaculty.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 min-w-[100px]">Email:</span>
                <span className="text-foreground font-medium">{studentFaculty.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 min-w-[100px]">Site web:</span>
                <span className="text-foreground font-medium">{studentFaculty.website}</span>
              </div>
            </div>
          </div>

          {/* Services Available */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Services Disponibles</h4>
            <div className="grid grid-cols-2 gap-2">
              {studentFaculty.services.map((service, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-foreground font-medium">{service}</span>
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}
