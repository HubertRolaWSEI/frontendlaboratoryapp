'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/lib/AuthContext';
import { FiHome, FiCalendar, FiInfo, FiLogOut, FiLayers, FiUser, FiUserPlus, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const profileImageSrc = user?.photoURL || 'https://dummyimage.com/32x32/ccc/000.png&text=U';

  const closeMenu = () => setIsOpen(false);
  const isActive = (path) => pathname === path;

  const getNavLinkClass = (path) => `
    group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1
    ${isActive(path) 
      ? 'bg-indigo-50 text-indigo-600 font-medium' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }
  `;

  return (
    <header className="text-gray-600 body-font bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center">
        

        <div className="flex justify-between items-center w-full md:w-auto">
            <Link href="/" className="flex title-font font-medium items-center text-gray-900" onClick={closeMenu}>
                <div className="bg-indigo-500 text-white p-2 rounded-lg shadow-md shadow-indigo-200">
                    <FiLayers className="w-6 h-6" />
                </div>
                <span className="ml-3 text-xl font-bold tracking-tight">Harmonogram Zajęć</span>
            </Link>

            <button 
                className="md:hidden p-2 text-gray-600 focus:outline-none hover:text-indigo-500 transition-colors rounded-lg hover:bg-gray-50" 
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
            </button>
        </div>

        {/* === ROZWIJANE MENU MOBILNE === */}
        <div className={`${isOpen ? 'flex' : 'hidden'} md:hidden flex-col w-full mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2`}>
            
            {/* Nawigacja */}
            <nav className="flex flex-col gap-1 mb-6">
                <Link href="/" className={getNavLinkClass('/')} onClick={closeMenu}>
                    <FiHome className={`text-xl ${isActive('/') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span>Strona Główna</span>
                </Link>
                
                {user && (
                    <Link href="/schedule" className={getNavLinkClass('/schedule')} onClick={closeMenu}>
                        <FiCalendar className={`text-xl ${isActive('/schedule') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span>Plan Zajęć</span>
                    </Link>
                )}
                
                <Link href="/about" className={getNavLinkClass('/about')} onClick={closeMenu}>
                    <FiInfo className={`text-xl ${isActive('/about') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span>O Aplikacji</span>
                </Link>
            </nav>

            {/* Sekcja Użytkownika / Logowania */}
            <div className="pt-4 border-t border-gray-100 bg-gray-50/50 -mx-4 px-4 pb-4">
                {user ? (
                    <div className="flex flex-col gap-3 mt-2">
                        {/* Profil */}
                        <Link 
                            href="/user/profile" 
                            onClick={closeMenu}
                            className="flex items-center p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
                        >
                            <Image 
                                src={profileImageSrc} 
                                alt="Profil" 
                                width={40} 
                                height={40} 
                                unoptimized 
                                className="rounded-full object-cover border border-gray-100"
                            />
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user.displayName || 'Użytkownik'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </Link>
                        
                        {/* Przycisk Wyloguj */}
                        <Link 
                            href="/user/signout" 
                            onClick={closeMenu}
                            className="flex items-center justify-center w-full bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 py-2.5 px-3 rounded-lg text-sm transition-all duration-200 group shadow-sm"
                        >
                            <span className="font-medium mr-2">Wyloguj</span>
                            <FiLogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 mt-2">
                        {/* Przycisk Zaloguj */}
                        <Link href="/user/signin" onClick={closeMenu} className="w-full flex items-center justify-center bg-indigo-500 text-white py-3 rounded-lg shadow-md hover:bg-indigo-600 transition-colors font-medium text-sm">
                            <FiUser className="w-4 h-4 mr-2" />
                            Zaloguj się
                        </Link>
                        
                        {/* Przycisk Załóż konto */}
                        <Link href="/user/register" onClick={closeMenu} className="w-full flex items-center justify-center bg-white border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium group">
                            <FiUserPlus className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            Załóż konto
                        </Link>
                    </div>
                )}
            </div>
        </div>

      </div>
    </header>
  );
}