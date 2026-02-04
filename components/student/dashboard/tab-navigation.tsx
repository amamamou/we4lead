'use client';

type TabType = 'overview' | 'appointments' | 'profile' | 'institution' | 'doctors'

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Vue Générale' },
  { id: 'appointments', label: 'Rendez-vous' },
  { id: 'profile', label: 'Profil' },
  { id: 'institution', label: 'Institution' },
  { id: 'doctors', label: 'Médecins' }
]

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap px-0 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-gray-500 text-foreground'
                : 'border-transparent text-gray-500 hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
