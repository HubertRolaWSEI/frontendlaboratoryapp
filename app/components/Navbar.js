// app/components/Navbar.js
'use client'; 
import Link from 'next/link';
import { useAuth } from '@/app/lib/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="text-gray-600 body-font bg-white shadow-sm">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {/* LOGO */}
        <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Frontend Lab</span>
        </Link>

        {/* LINKI ŚRODKOWE */}
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/" className="mr-5 hover:text-gray-900">Harmonogram</Link>
          <Link href="/about" className="mr-5 hover:text-gray-900">O Aplikacji</Link>
        </nav>

        {/* PRZYCISKI LOGOWANIA / PROFILU */}
        <div className="flex items-center">
            {user ? (
                <>
                    <Link href="/user/profile" className="mr-4 hover:text-gray-900 font-medium">
                        {user.email}
                    </Link>
                    <Link href="/user/signout" className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                        Wyloguj
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                </>
            ) : (
                <>
                    <Link href="/user/signin" className="inline-flex items-center bg-indigo-500 text-white border-0 py-1 px-3 focus:outline-none hover:bg-indigo-600 rounded text-base mt-4 md:mt-0 mr-2">
                        Zaloguj
                    </Link>
                    <Link href="/user/register" className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                        Rejestracja
                    </Link>
                </>
            )}
        </div>
      </div>
    </header>
  );
}