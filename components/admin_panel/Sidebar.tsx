"use client"

import { ChevronDown, Search, UserCog, LogOut } from "lucide-react"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/contexts/AuthContext"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface SidebarItem {
  title: string
  icon: React.ReactNode
  value?: string
  badge?: string
  items?: {
    title: string
    url?: string
    badge?: string
  }[]
}

interface SidebarProps {
  sidebarItems: SidebarItem[]
  sidebarOpen: boolean
  expandedItems: Record<string, boolean>
  toggleExpanded: (title: string) => void
  setActiveTab: (tab: string) => void
  activeTab: string
}

export default function Sidebar({
  sidebarItems,
  sidebarOpen,
  expandedItems,
  toggleExpanded,
  setActiveTab,
  activeTab,
}: SidebarProps) {
  const { user: authUser, logout } = useAuth()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const displayedUserName = authUser
    ? (`${authUser.prenom ?? ''} ${authUser.nom ?? ''}`.trim() || authUser.email || '')
    : ''

  const handleSignOut = async () => {
    if (signingOut) return
    setSigningOut(true)
    try {
      await logout()
      void router.push('/login')
    } catch {
      void router.refresh()
    } finally {
      setSigningOut(false)
    }
  }
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="p-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex aspect-square size-20 items-center justify-center rounded-2xl overflow-hidden bg-white ">
              <img
                src="/universitedesousse.png"
                alt="University of Sousse"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2"
            />
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.title} className="mb-1">
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition",
                    item.value === activeTab
                      ? "bg-[#E7E7E7] text-black"
                      : "hover:bg-muted",
                  )}
                  onClick={() => {
                    if (item.value) {
                      setActiveTab(item.value)
                    }

                    if (item.items) {
                      toggleExpanded(item.title)
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="ml-auto rounded-full px-2 py-0.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}

                  {item.items && (
                    <ChevronDown
                      className={cn(
                        "ml-2 h-4 w-4 transition-transform",
                        expandedItems[item.title] ? "rotate-180" : "",
                      )}
                    />
                  )}
                </button>

                {/* Sub Items */}
                {item.items && expandedItems[item.title] && (
                  <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                    {item.items.map((subItem) => (
                      <button
                        key={subItem.title}
                        onClick={() =>
                          subItem.url && setActiveTab(subItem.url)
                        }
                        className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted text-left"
                      >
                        {subItem.title}
                        {subItem.badge && (
                          <Badge
                            variant="outline"
                            className="ml-auto rounded-full px-2 py-0.5 text-xs"
                          >
                            {subItem.badge}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-3">
          <div className="space-y-1">
         

            <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <div className="flex h-full w-full items-center justify-center">
                    <UserCog className="h-5 w-5 text-foreground/70" />
                  </div>
                </Avatar>
                <span>{displayedUserName || 'Admin'}</span>
              </div>
              <Badge variant="outline" className="ml-auto">
                Admin
              </Badge>
            </button>
            <button onClick={() => { void handleSignOut(); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}