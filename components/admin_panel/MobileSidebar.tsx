"use client"

import { ChevronDown, Search, UserCog, LogOut, X, Home, BookOpen, FileText, Users, User } from "lucide-react"
import Image from 'next/image'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from "@/contexts/AuthContext"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface MobileSidebarProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  expandedItems: Record<string, boolean>
  toggleExpanded: (title: string) => void
}

type SidebarItem = {
  title: string
  icon: React.ReactNode
  value?: string
  badge?: string
  items?: { title: string; url?: string; badge?: string }[]
}

const sidebarItems: SidebarItem[] = [
  { title: 'Overview', icon: <Home className="h-4 w-4" />, value: 'overview' },
  { title: 'Instituts', icon: <BookOpen className="h-4 w-4" />, value: 'instituts' },
  { title: 'Demandes', icon: <FileText className="h-4 w-4" />, value: 'demandes' },
  { title: 'Intervenants', icon: <Users className="h-4 w-4" />, value: 'intervenants' },
  { title: 'Utilisateurs', icon: <User className="h-4 w-4" />, value: 'utilisateurs' },
]

export default function MobileSidebar({
  mobileMenuOpen,
  setMobileMenuOpen,
  expandedItems,
  toggleExpanded,
}: MobileSidebarProps) {
  const { user: authUser, logout } = useAuth()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('Home')
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return sidebarItems

    return sidebarItems
      .map((item) => {
        const titleMatch = item.title.toLowerCase().includes(q)
        if (item.items) {
          const matchingSub = item.items.filter((si) => si.title.toLowerCase().includes(q))
          if (titleMatch) return item
          if (matchingSub.length > 0) return { ...item, items: matchingSub }
        }
        return titleMatch ? item : null
      })
      .filter(Boolean) as SidebarItem[]
  }, [searchQuery])

  const anyMatch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return sidebarItems.some((it) =>
      it.title.toLowerCase().includes(q) || (it.items && it.items.some((si) => si.title.toLowerCase().includes(q))),
    )
  }, [searchQuery])

  return (
    <>
      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col border-r">
          {/* Header (logo centered, close button on right) */}
          <div className="relative p-4">
            {/* Centered logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link href="/" aria-label="Home">
                <div className="flex aspect-square size-20 items-center justify-center rounded-2xl overflow-hidden bg-white mt-4">
                  <Image
                    src="/universitedesousse.png"
                    alt="Logo"
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Close button aligned right */}
            <div className="flex items-center justify-end">
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-sm"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2"
              />
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <div key={item.title} className="mb-1">
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium transition",
                      item.title === activeTab ? "bg-[#E7E7E7] text-black" : "hover:bg-muted",
                    )}
                    onClick={() => {
                      setActiveTab(item.title)
                      if (item.items) {
                        toggleExpanded(item.title)
                      } else {
                        setMobileMenuOpen(false)
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
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

                  {item.items && (expandedItems[item.title] || searchQuery.trim() !== "") && (
                    <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                      {item.items.map((subItem) => (
                        <button
                          key={subItem.title}
                          onClick={() => {
                            setActiveTab(subItem.title)
                            setMobileMenuOpen(false)
                          }}
                          className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted text-left"
                        >
                          {subItem.title}
                          {subItem.badge && (
                            <Badge variant="outline" className="ml-auto rounded-full px-2 py-0.5 text-xs">
                              {subItem.badge}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {searchQuery.trim() !== "" && !anyMatch && (
                <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
              )}
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
    </>
  )
}