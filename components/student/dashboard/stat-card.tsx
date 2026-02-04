import React from 'react'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div>{icon}</div>
      </div>
      <p className="text-sm text-gray-600 font-medium">{label}</p>
    </div>
  )
}
