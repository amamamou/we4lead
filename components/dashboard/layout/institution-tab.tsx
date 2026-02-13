import { MapPin, Phone, Mail, Globe } from 'lucide-react'
import Image from 'next/image'

export function InstitutionTab() {
  const studentFaculty = {
    name: 'Faculté de Médecine de Sousse',
    university: 'Université de Sousse',
    address: 'Avenue Mohamed Karoui, 4000 Sousse',
    phone: '+216 73 325 300',
    email: 'decanat@fms.rnu.tn',
    website: 'www.fms.rnu.tn'
  }

  return (
    <div className="max-w-6xl space-y-10">

      {/* Identity Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 ">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-xl  border-gray-100 bg-white flex items-center justify-center">
            <Image
              src="/universitedesousse.png"
              alt="Université de Sousse"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              {studentFaculty.university}
            </p>
            <h2 className="text-lg font-semibold text-gray-900">
              {studentFaculty.name}
            </h2>
            <p className="text-sm text-gray-500">
              {studentFaculty.address}
            </p>
          </div>
        </div>
      </div>

      {/* Contact + Location Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Contact Card */}
        <div className="bg-white rounded-lg shadow-sm p-6  space-y-6">
          <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">
            Contact
          </div>

          <div className="space-y-4">

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Address</div>
                <div className="text-sm text-gray-900">
                  {studentFaculty.address}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Phone className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Phone</div>
                <div className="text-sm text-gray-900">
                  {studentFaculty.phone}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Mail className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm text-gray-900">
                  {studentFaculty.email}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Website</div>
                <div className="text-sm text-gray-900">
                  {studentFaculty.website}
                </div>
              </div>
            </div>
          </div>

        <div className="pt-4 flex gap-3">

        <a
          href={`mailto:${studentFaculty.email}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <Mail className="w-4 h-4" />
          Contact
        </a>

        <a
          href={`https://${studentFaculty.website}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <Globe className="w-4 h-4 text-gray-500" />
          Visit Website
        </a>

        </div>

        </div>

        {/* Location Card */}
        <div className="bg-white rounded-lg shadow-sm p-6  space-y-6">
          <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">
            Location
          </div>

          <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-100">
            <iframe
              src="https://www.google.com/maps?q=Avenue%20Mohamed%20Karoui,%204000%20Sousse&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
