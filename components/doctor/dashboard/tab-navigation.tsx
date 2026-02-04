'use client';

type TabType = 'overview' | 'availability' | 'history' | 'profile'

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Vue Générale' },
  { id: 'availability', label: 'Disponibilité' },
  { id: 'history', label: 'Historique' },
  { id: 'profile', label: 'Profil' }
]

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 -mx-4 sm:mx-0">
      <div className="flex gap-6 overflow-x-auto px-4 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`whitespace-nowrap px-4 sm:px-0 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors ${
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
