'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { FiLogOut } from 'react-icons/fi'; // Używamy ikony, która jest już w projekcie

export default function SignOutPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Trwa wylogowywanie...");

  useEffect(() => {
    // Funkcja asynchroniczna obsługująca proces wylogowania
    const performLogout = async () => {
      try {
        // 1. Wywołaj Firebase signOut
        await signOut(auth);
        
        // 2. Po sukcesie zaktualizuj komunikat
        setMessage("Pomyślnie wylogowano. Do zobaczenia!");
        
        // 3. Dodaj opóźnienie (np. 2000ms = 2 sekundy) dla płynnego przejścia
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } catch (error) {
        console.error('Błąd wylogowania:', error);
        // W razie błędu również przekieruj
        setMessage("Wystąpił błąd. Przekierowywanie...");
        setTimeout(() => {
           router.push('/');
        }, 2000);
      }
    };

    performLogout();
  }, [router]);

  // Zwracamy interfejs użytkownika (UI), który wyświetli się podczas czekania
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-700">
      {/* Kółko z ikoną */}
      <div className="bg-indigo-50 p-6 rounded-full mb-6 shadow-sm">
        <FiLogOut className="w-10 h-10 text-indigo-600 animate-pulse" />
      </div>
      
      {/* Nagłówek komunikatu */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        {message}
      </h1>
      
      {/* Dodatkowy tekst */}
      <p className="text-gray-500">
        Za chwilę zostaniesz przeniesiony na stronę główną.
      </p>
    </div>
  );
}