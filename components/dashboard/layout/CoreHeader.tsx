/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Search, ChevronRight } from 'lucide-react'

type Crumb = { label: string; href?: string }

type Props = {
  name?: string
  breadcrumbs?: Crumb[]
  // variant controls special header for admin/super-admin. Leave undefined for regular users.
  variant?: 'default' | 'admin' | 'super-admin'
  // faculty title to show for admin variant
  faculty?: string
  // optional logo src; if not provided a simple fallback SVG will be shown
  logoSrc?: string
}

export default function CoreHeader({ name = 'User', breadcrumbs, variant = 'default', faculty, logoSrc }: Props) {
  return (
    <header className="mb-6">

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

        {/* Left */}
        <div>
          {variant === 'admin' || variant === 'super-admin' ? (
            <div className="flex items-start gap-4">
              {/* Logo: prefer provided src, otherwise simple fallback */}
              {/* Always show the official university logo from public/icons */}
              <img src="/universitedesousse.png" alt="Université de Sousse" className="w-12 h-12 object-contain rounded-md" />

                <div>
                <p className="text-sm text-gray-500">{variant === 'super-admin' ? 'WE4LEAD' : 'UNIVERSITÉ DE SOUSSE'}</p>
                {variant === 'admin' ? (
                  <h1 className="text-3xl font-bold mt-1">{faculty ?? 'Faculté'}</h1>
                ) : (
                  <h1 className="text-3xl font-bold mt-1">Université de Sousse</h1>
                )}
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">Hi, {name}</p>
              <h1 className="text-3xl font-bold mt-1">Welcome back!</h1>
            </>
          )}

          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mt-6 pt-2 text-sm text-gray-500 flex items-center gap-2 border-t border-transparent" aria-label="Breadcrumb">
              {breadcrumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={i === 0 ? 'text-gray-600 font-medium' : 'text-gray-500'}>{c.label}</span>
                  {i < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3 text-gray-400" />}
                </span>
              ))}
            </nav>
          )}
        </div>

        {/* Search */}
        <div className="w-full md:w-auto md:mt-[2px]">
          <div className="
            group flex items-center gap-2
            rounded-lg
            bg-gray-100/80
            px-3 py-2
            text-sm text-gray-600
            transition
            focus-within:bg-white
            focus-within:ring-2 focus-within:ring-[#020E68]/20
            hover:bg-gray-100
            w-full md:w-auto
          ">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />

            <input
              type="text"
              placeholder="Search..."
              className="
                bg-transparent
                outline-none
                placeholder:text-gray-400
                w-full md:w-40
                md:focus:w-56
                transition-all duration-200
              "
            />
          </div>
        </div>

      </div>

    </header>
  )
}
