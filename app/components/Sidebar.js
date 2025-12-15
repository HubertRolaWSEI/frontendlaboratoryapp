'use client'; 
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/lib/AuthContext';
import { usePathname } from 'next/navigation';
import { FiHome, FiCalendar, FiInfo, FiLogOut, FiLayers, FiUser, FiUserPlus } from 'react-icons/fi';

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  
  const profileImageSrc = user?.photoURL || 'https://dummyimage.com/80x80/ccc/000.png&text=User'; 


  const linkClass = (path) => `
    flex items-center py-3 px-4 rounded-lg transition-all duration-200 mb-1 font-medium
    ${pathname === path 
      ? 'bg-indigo-50 text-indigo-600' 
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900' 
    }
  `;

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 font-sans shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
      {/* --- LOGO --- */}
      <div className="p-6 flex items-center border-b border-gray-100">
        <Link href="/" className="flex title-font font-medium items-center text-gray-900">
          <div className="bg-indigo-500 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-200">
             <FiLayers className="w-6 h-6" />
          </div>
          <span className="ml-3 text-xl font-bold tracking-tight text-gray-800">Harmonogram Zajęć</span>
        </Link>
      </div>

      {/* --- MENU --- */}
      <nav className="flex-grow p-4 overflow-y-auto">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-4 pt-2">Menu</div>
        
        <Link href="/" className={linkClass('/')}>
            <FiHome className={`w-5 h-5 mr-3 ${pathname === '/' ? 'text-indigo-600' : 'text-gray-400'}`} />
            Strona Główna
        </Link>

        {user && (
            <Link href="/schedule" className={linkClass('/schedule')}>
                <FiCalendar className={`w-5 h-5 mr-3 ${pathname === '/schedule' ? 'text-indigo-600' : 'text-gray-400'}`} />
                Plan Zajęć
            </Link>
        )}

        <Link href="/about" className={linkClass('/about')}>
            <FiInfo className={`w-5 h-5 mr-3 ${pathname === '/about' ? 'text-indigo-600' : 'text-gray-400'}`} />
            O Aplikacji
        </Link>
      </nav>

      {/* --- PROFIL UŻYTKOWNIKA (Footer) --- */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        {user ? (
            <div className="flex flex-col gap-3">
                {/* Wiersz z danymi użytkownika */}
                <Link href="/user/profile" className="flex items-center group cursor-pointer p-2 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-gray-200">
                    <Image 
                        src={profileImageSrc} 
                        alt="Profil" 
                        width={40} 
                        height={40} 
                        unoptimized 
                        className="rounded-full object-cover border border-gray-200 group-hover:border-indigo-300 transition-colors" 
                    />
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
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
                    className="flex items-center justify-center w-full bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 py-2 px-3 rounded-lg text-sm transition-all duration-200 group shadow-sm"
                >
                    <span className="font-medium mr-2">Wyloguj</span>
                    <FiLogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        ) : (
            <div className="flex flex-col gap-2">
                <Link href="/user/signin" className="w-full flex items-center justify-center bg-indigo-500 text-white py-2.5 rounded-lg shadow-md hover:bg-indigo-600 transition-colors font-medium text-sm">
                    <FiUser className="w-4 h-4 mr-2" />
                    Zaloguj się
                </Link>
                
                {/* Przycisk Rejestracji z ikoną */}
                <Link href="/user/register" className="w-full flex items-center justify-center bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium group">
                    <FiUserPlus className="w-4 h-4 mr-2 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    Załóż konto
                </Link>
            </div>
        )}
      </div>
    </aside>
  );
}