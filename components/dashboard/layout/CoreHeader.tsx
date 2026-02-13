import React from 'react'
import { Search } from 'lucide-react'

type Props = {
  name?: string
}

export default function CoreHeader({ name = 'User' }: Props) {
  return (
    <header className="mb-6">

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

        {/* Left */}
        <div>
          <p className="text-sm text-gray-500">Hi, {name}</p>
          <h1 className="text-3xl font-bold mt-1">Welcome back!</h1>
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
