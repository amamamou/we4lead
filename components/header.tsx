"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`
        w-full
        z-50
        transition-all
        duration-300
        border-b
        border-gray-200
        ${
          scrolled
            ? "fixed top-0 bg-white/70 backdrop-blur-md shadow-md"
            : "relative bg-white"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex justify-between items-center h-20">

          {/* ================= LOGOS ================= */}

          <div className="flex items-center gap-3">

            {/* University Logo */}
            <Image
              src="/universitedesousse.png"
              alt="University of Sousse"
              width={82}
              height={62}
              className="object-contain"
            />

            <div className="w-px h-8 bg-gray-300" />

            {/* WE4LEAD Logo */}
            <Image
              src="/we4lead.png"
              alt="WE4LEAD"
              width={100}
              height={92}
              className="object-contain"
            />

          </div>

          {/* ================= NAVIGATION ================= */}

          <nav className="hidden md:flex items-center gap-8">

            <Link
              href="/"
              className="text-gray-700 text-sm font-medium hover:text-[#2B61D6]"
            >
              Accueil
            </Link>

            <Link
              href="/institutions"
              className="text-gray-700 text-sm font-medium hover:text-[#2B61D6]"
            >
              Institutions
            </Link>

            <Link
              href="/consultants"
              className="text-gray-700 text-sm font-medium hover:text-[#2B61D6]"
            >
              Consultants
            </Link>

            <Link
              href="/apropos"
              className="text-gray-700 text-sm font-medium hover:text-[#2B61D6]"
            >
              À propos
            </Link>

          </nav>

          {/* ================= USER PROFILE ================= */}

          <div className="hidden md:flex items-center gap-3">

            {/* User Profile with Dropdown */}
            <div className="relative" data-dropdown>
              <button 
                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[#2B61D6] flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">JD</span>
                </div>

                {/* User Info */}
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium text-gray-900">John Doe</span>
                  <span className="text-xs text-gray-500">Étudiant</span>
                </div>

                {/* Dropdown Arrow */}
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>

              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2B61D6] flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">JD</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">John Doe</div>
                        <div className="text-xs text-gray-500">john.doe@student.us.tn</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link 
                      href="/dashboard"
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002 2v10a2 2 0 01-2 2H9V7z" />
                      </svg>
                      Dashboard
                    </Link>
                    
                    <Link 
                      href="/profile"
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mon profil
                    </Link>
                    
                    <Link
                      href="/mes-rdv"
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 7h.01M12 12v4" />
                      </svg>
                      Mes rendez-vous
                    </Link>
                    
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Paramètres
                    </button>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Se déconnecter
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* ================= MOBILE MENU ================= */}

          <button className="md:hidden">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

        </div>
      </div>
    </header>
  );
}
