'use client';
import Link from 'next/link';
import { 
    FiCalendar, 
    FiShield, 
    FiSmartphone, 
    FiArrowRight, 
    FiCode,       
    FiDatabase,   
    FiLayout,     
    FiFeather     
} from 'react-icons/fi';

export default function AboutPage() {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-12 mx-auto">
        
        {/* === NAGŁÓWEK === */}
        <div className="text-center mb-12">
          <h1 className="sm:text-3xl text-2xl font-bold title-font text-gray-900 mb-4">
            O Aplikacji:
          </h1>
          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500">
            FrontendLaboratoryApp to projekt zaliczeniowy, którego celem jest ułatwienie zarządzania czasem. Aplikacja umożliwia tworzenie i edycję harmonogramu zajęć w prosty i przejrzysty sposób.
          </p>
        </div>

        {/* === GŁÓWNE FUNKCJE === */}
        <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
          
          <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
            <div className="w-16 h-16 inline-flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4 shadow-sm">
              <FiCalendar className="w-8 h-8" />
            </div>
            <h2 className="text-gray-900 text-lg title-font font-bold mb-2">Harmonogram</h2>
            <p className="leading-relaxed text-base text-gray-500">
              Interaktywny kalendarz tygodniowy. Pozwala na dodawanie, edytowanie oraz usuwanie zajęć i wydarzeń.
            </p>
          </div>

          <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
            <div className="w-16 h-16 inline-flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4 shadow-sm">
              <FiShield className="w-8 h-8" />
            </div>
            <h2 className="text-gray-900 text-lg title-font font-bold mb-2">Bezpieczeństwo</h2>
            <p className="leading-relaxed text-base text-gray-500">
              System logowania i rejestracji oparty na Firebase Auth. Dane użytkownika są chronione i prywatne.
            </p>
          </div>

          <div className="p-4 md:w-1/3 flex flex-col text-center items-center">
            <div className="w-16 h-16 inline-flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4 shadow-sm">
              <FiSmartphone className="w-8 h-8" />
            </div>
            <h2 className="text-gray-900 text-lg title-font font-bold mb-2">Responsywność</h2>
            <p className="leading-relaxed text-base text-gray-500">
              Interfejs aplikacji automatycznie dostosowuje się do ekranów komputerów, tabletów i telefonów.
            </p>
          </div>

        </div>

        {/* === WYKORZYSTANE TECHNOLOGIE === */}
        <div className="mt-20 pt-10 border-t border-gray-100">
            <div className="text-center mb-10">
                <h2 className="text-xl font-bold text-gray-900 mt-3">Wykorzystane technologie:</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
                
                <div className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm w-full md:w-auto min-w-[200px]">
                    <div className="p-2 bg-black text-white rounded-lg mr-4">
                        <FiCode className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Next.js 16</h3>
                        <p className="text-xs text-gray-500">Framework React</p>
                    </div>
                </div>

                <div className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm w-full md:w-auto min-w-[200px]">
                    <div className="p-2 bg-yellow-500 text-white rounded-lg mr-4">
                        <FiDatabase className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Firebase</h3>
                        <p className="text-xs text-gray-500">Baza danych i Autoryzacja</p>
                    </div>
                </div>

                <div className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm w-full md:w-auto min-w-[200px]">
                    <div className="p-2 bg-cyan-500 text-white rounded-lg mr-4">
                        <FiLayout className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Tailwind CSS</h3>
                        <p className="text-xs text-gray-500">System Stylów CSS</p>
                    </div>
                </div>

                 <div className="flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm w-full md:w-auto min-w-[200px]">
                    <div className="p-2 bg-pink-500 text-white rounded-lg mr-4">
                        <FiFeather className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">React Icons</h3>
                        <p className="text-xs text-gray-500">Biblioteka Ikon</p>
                    </div>
                </div>

            </div>
        </div>

        {/* === STOPKA AUTORA === */}
        <div className="flex flex-col items-center mt-16">
            <Link href="/" className="inline-flex items-center text-white bg-indigo-600 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-700 rounded-lg text-lg transition-colors shadow-md">
                Wróć do strony głównej
                <FiArrowRight className="ml-2" />
            </Link>
            <p className="text-sm text-gray-400 mt-6">Autor: Hubert Rola</p>
        </div>

      </div>
    </section>
  );
}
