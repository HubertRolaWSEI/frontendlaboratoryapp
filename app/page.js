'use client'; 
import { useAuth } from '@/app/lib/AuthContext'; 
import Link from 'next/link';

// Widok mobilny - uproszczony, ale spójny stylistycznie
const MobileView = ({ user, today, greetingText }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-in fade-in zoom-in duration-500">
       {user ? (
          <>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full mb-6 uppercase tracking-widest shadow-sm">
              {today}
            </span>
            <h1 className="text-4xl font-black text-gray-900 mb-3 leading-tight">
              {greetingText}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {user.displayName || user.email.split('@')[0]}
              </span>!
            </h1>
            <p className="text-gray-600 text-base mt-4 px-2 leading-relaxed max-w-xs mx-auto">
              Jesteś zalogowany. Przejdź do swojego planu zajęć.
            </p>
            <div className="mt-8 w-full max-w-xs">
                <Link href="/schedule" className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-95 transition-transform">
                    Otwórz Plan
                </Link>
            </div>
          </>
       ) : (
          <>
            <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-2xl">🚀</div>
            </div>
            <h1 className="title-font text-4xl mb-4 font-black text-gray-900">
              Twój harmonogram zajęć
              <br/> pod kontrolą
            </h1>
            <p className="mb-8 leading-relaxed text-gray-500 text-lg">
              Prosty, szybki i przejrzysty sposób na zarządzanie studenckim życiem.
            </p>
            <Link href="/user/signin" className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200">
                Zaloguj się / Zarejestruj
            </Link>
          </>
       )}
    </div>
  );
};

// Widok desktopowy
const DesktopView = ({ user, today, greetingText }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[80vh]">
      
      {/* LEWA STRONA - TREŚĆ */}
      <div className="md:w-1/2 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center space-y-6 z-10">
        {user ? (
          <>
            <span className="inline-block py-1.5 px-4 rounded-full bg-white border border-indigo-100 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-2 shadow-sm">
              📅 {today}
            </span>
            <h1 className="title-font sm:text-6xl text-5xl mb-4 font-black text-gray-900 leading-tight">
              {greetingText}, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {user.displayName || user.email.split('@')[0]}
              </span>
            </h1>
            <p className="mb-8 leading-relaxed text-gray-500 text-xl max-w-md">
              To twój harmonogram. Sprawdź, co masz zaplanowane na dziś lub dodaj nowe zajęcia.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
                <Link href="/schedule" className="inline-flex text-white bg-indigo-600 border-0 py-3.5 px-8 focus:outline-none hover:bg-indigo-700 rounded-xl text-lg font-medium shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1">
                    Przejdź do Planu
                </Link>
                <Link href="/user/profile" className="inline-flex text-gray-700 bg-white border border-gray-200 py-3.5 px-8 focus:outline-none hover:bg-gray-50 hover:border-gray-300 rounded-xl text-lg font-medium transition-all shadow-sm">
                    Mój Profil
                </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="title-font sm:text-6xl text-5xl mb-4 font-black text-gray-900 leading-tight">
              Zarządzaj czasem
              <br className="hidden lg:inline-block" /> 
              <span className="text-indigo-600"> bez stresu</span>
            </h1>
            <p className="mb-8 leading-relaxed text-gray-500 text-lg max-w-lg">
              Twój osobisty asystent harmonogramu. Planuj zajęcia i miej wszystko pod kontrolą w jednym miejscu.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
                <Link href="/user/signin" className="inline-flex text-white bg-indigo-600 border-0 py-3.5 px-8 focus:outline-none hover:bg-indigo-700 rounded-xl text-lg font-medium shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1">
                    Zaloguj się / Zarejestruj
                </Link>
                <Link href="/about" className="inline-flex text-gray-700 bg-white border border-gray-200 py-3.5 px-8 focus:outline-none hover:bg-gray-50 hover:border-gray-300 rounded-xl text-lg font-medium transition-all shadow-sm">
                    Dowiedz się więcej
                </Link>
            </div>
          </>
        )}
      </div>

      {/* PRAWA STRONA - OBRAZEK I TŁO */}
      <div className="md:w-1/2 w-5/6 flex justify-center relative">
        {/* Efekty tła */}
        <div className="absolute top-0 right-10 -z-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-10 -z-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>

        {/* Główny obrazek aplikacji */}
        <div className="relative rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl transform rotate-2 hover:rotate-0 transition duration-700 ease-out">
            <div className="h-6 bg-white border-b border-gray-100 flex items-center px-4 space-x-1.5 rounded-t-lg mb-2">
              <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
            </div>
            <img 
              src="/app-screen.png" 
              alt="Widok aplikacji Planer" 
              className="rounded-lg w-full h-auto object-cover border border-gray-100 shadow-inner"
            />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const { user } = useAuth(); 

  const hour = new Date().getHours();
  let greetingText = "Dzień dobry";
  if (hour >= 18) greetingText = "Dobry wieczór";

  const today = new Date().toLocaleDateString('pl-PL', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  return (
    <section className="text-gray-600 body-font h-full flex flex-col justify-center">
      <div className="block md:hidden">
        <MobileView user={user} today={today} greetingText={greetingText} />
      </div>

      <div className="hidden md:block">
        <DesktopView user={user} today={today} greetingText={greetingText} />
      </div>
    </section>
  );
}