import React from 'react'
import Calendar from './Calendar'
import DashboardFooter from './DashboardFooter'
import { Stethoscope, ArrowRight, Clock } from '@/components/ui/icons'

type Widget = { id: string; title: string; content: React.ReactNode; bare?: boolean; headerAction?: { id: string; label: string; onClick?: () => void } }
type Action = { id: string; label: string; icon?: React.ReactNode; onClick?: () => void; primary?: boolean }

type Props = {
  widgets?: Widget[]
  actions?: Action[]
  // pass the current active tab so mobile rendering can be conditional
  activeTab?: string
}

export default function RightAside({ widgets = [], actions = [], activeTab }: Props) {
  const hasWidgets = widgets && widgets.length > 0
  const hasActions = actions && actions.length > 0

  // Desktop/right-panel: visible on md+ (unchanged)
  const desktopAside = (
    <aside className="hidden md:flex md:w-72 bg-white border-l dark:bg-gray-900 dark:border-gray-700 md:h-screen md:sticky md:top-0 p-4 flex flex-col">
      <div className="flex-1 overflow-auto">

        {hasWidgets ? (
          widgets.map((widget) => (
            <div key={widget.id} className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600">{widget.title}</h3>
                {widget.headerAction ? (
                  <button
                    type="button"
                    onClick={widget.headerAction.onClick}
                    className="text-xs text-gray-500 flex-shrink-0 ml-2"
                  >
                    {widget.headerAction.label}
                  </button>
                ) : null}
              </div>

              {widget.bare ? (
                <div className="mt-3">{widget.content}</div>
              ) : (
                <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">{widget.content}</div>
              )}
            </div>
          ))
        ) : (
          // fallback: replicate original static design (Calendar + Upcoming)
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600">Calendar</h3>
                <button className="text-xs text-gray-500">This month</button>
              </div>

              <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <Calendar />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600">Upcoming</h3>
                <button className="text-xs text-gray-500">View all</button>
              </div>

              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center gap-2">
                  <Clock size={16} />
                  <div>
                    <div className="font-medium text-sm">No upcoming events</div>
                    <div className="text-xs text-gray-500">You&apos;re all caught up</div>
                  </div>
                </li>
              </ul>
            </div>
          </>
        )}

        {hasActions ? (
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Quick actions</h3>
            <div className="mt-3 flex flex-col gap-3">
              {actions.map((action) => {
                const isPrimary = !!action.primary
                const className = isPrimary
                  ? 'flex items-center gap-2 py-2 px-3 rounded-md bg-[#020E68] text-white text-sm hover:bg-[#020E68]/90 transition'
                  : 'flex items-center gap-2 py-2 px-3 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition'

                return (
                  <button key={action.id} onClick={action.onClick} className={className}>
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          // fallback quick actions (original look)
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Quick actions</h3>
            <div className="mt-3 flex flex-col gap-3">
              <button className="flex items-center gap-2 py-2 px-3 rounded-md bg-[#020E68] text-white text-sm hover:bg-[#020E68]/90 transition">
                <Stethoscope size={16} />
                <span>New session</span>
              </button>

              <button className="flex items-center gap-2 py-2 px-3 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <ArrowRight size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Desktop footer stays in the right panel */}
      <div className="hidden md:block">
        <DashboardFooter />
      </div>
    </aside>
  )

  // Mobile: only show the right panel when on the overview tab
  const mobileAside = activeTab === 'overview' ? (
    <div className="md:hidden w-full bg-white dark:bg-gray-900 border-t dark:border-gray-700 p-4">
      <div className="flex-1">
        {hasWidgets ? (
          widgets.map((widget) => (
            <div key={widget.id} className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600">{widget.title}</h3>
              </div>

              {widget.bare ? (
                <div className="mt-3">{widget.content}</div>
              ) : (
                <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">{widget.content}</div>
              )}
            </div>
          ))
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600">Calendar</h3>
                <button className="text-xs text-gray-500">This month</button>
              </div>

              <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                <Calendar />
              </div>
            </div>
          </>
        )}

        {hasActions && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Quick actions</h3>
            <div className="mt-3 flex flex-col gap-3">
              {actions.map((action) => (
                <button key={action.id} onClick={action.onClick} className={`flex items-center gap-2 py-2 px-3 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition`}>
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Show footer inside the mobile right panel when viewing overview */}
      <div className="mt-2">
        <DashboardFooter />
      </div>
    </div>
  ) : null

  return (
    <>
      {desktopAside}
      {mobileAside}
    </>
  )
}
