"use client"

import { Menu, PanelLeft, User, UserCog } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

interface NavbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  setMobileMenuOpen: (value: boolean) => void
}

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  setMobileMenuOpen,
}: NavbarProps) {
  const { user: authUser, isAuthenticated: authIsAuthenticated } = useAuth()

  const displayedUserName = authUser
    ? (`${authUser.prenom ?? ''} ${authUser.nom ?? ''}`.trim() || authUser.email || '')
    : ''

  const displayedUserEmail = authUser?.email ?? ''
  const _authObj = authUser as unknown as Record<string, unknown>
  const displayedUserImage =
    (typeof _authObj?.avatar === 'string'
      ? (_authObj.avatar as string)
      : typeof _authObj?.image === 'string'
      ? (_authObj.image as string)
      : typeof _authObj?.photo === 'string'
      ? (_authObj.photo as string)
      : '') || ''

  // Note: profile dropdown removed per request; clicking avatar/name will do nothing.
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center justify-between">
<div className="flex flex-col leading-tight">
  <h1 className="text-lg font-semibold tracking-tight text-foreground">
    Université de Sousse
  </h1>
  <span className="text-xs text-muted-foreground">
    WE4LEAD Platform · Erasmus+ Programme
  </span>
</div>
        <div className="flex items-center gap-3">



          {authIsAuthenticated ? (
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
                <div className="hidden sm:flex relative h-8 w-8 rounded-md overflow-hidden bg-secondary items-center justify-center">
                  {displayedUserImage ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={displayedUserImage} alt={displayedUserName || 'User'} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  ) : (
                    <UserCog size={16} className="text-foreground/50" />
                  )}
                </div>

                <span className="hidden sm:inline text-sm font-semibold tracking-tight text-foreground">
                  {displayedUserName || displayedUserEmail || ''}
                </span>
              </div>
            </div>
          ) : (
            <Avatar className="h-9 w-9 border-2 border-primary">
              <div className="flex h-full w-full items-center justify-center">
                <UserCog className="h-5 w-5 text-foreground/70" />
              </div>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  )
}