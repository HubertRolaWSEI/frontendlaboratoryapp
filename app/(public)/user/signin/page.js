'use client';
import { useState, useLayoutEffect } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from '@/app/lib/firebase';
import Link from 'next/link';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'; 

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const returnUrl = params.get("returnUrl");
  const reauth = params.get("reauth");
  const passwordChanged = params.get("message") === 'password-changed';
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 

  useLayoutEffect(() => {
    if (reauth) {
        setError("Twoja sesja wygasła. Wymagane jest ponowne zalogowanie.");
    } else if (passwordChanged) {
        setError("✅ Hasło zostało pomyślnie zmienione. Zaloguj się nowym hasłem.");
    }
  }, [reauth, passwordChanged]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            router.push(returnUrl || "/");
          })
          .catch((error) => {
             let errorMessage = "Błąd logowania.";
             if (error.code === 'auth/invalid-credential') errorMessage = "Błędny e-mail lub hasło.";
             setError(errorMessage);
             setLoading(false);
          });
      })
      .catch(error => {
          setError("Błąd sesji przeglądarki.");
          setLoading(false);
      });
  };

  return (
    <section className="text-gray-600 body-font h-full flex items-center justify-center">
      <div className="container px-5 py-24 mx-auto flex justify-center items-center">
        
        <div className="lg:w-1/3 md:w-1/2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
          {/* Ozdobny pasek na górze */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>

          <div className="text-center mb-8">
            <h2 className="text-gray-900 text-2xl font-bold title-font mb-2">Witaj ponownie!</h2>
            <p className="text-gray-500 text-sm">
              Zaloguj się, aby zarządzać swoim harmonogramem.
            </p>
          </div>

          {error && (
            <div className={`mb-6 text-sm font-medium p-3 rounded-lg flex items-center ${error.startsWith('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            
            {/* Pole Email z ikoną */}
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiMail />
                  </div>
                  <input 
                    type="email" id="email" name="email" required placeholder="jan@przyklad.pl"
                    className="w-full bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2.5 pl-10 pr-3 transition-colors duration-200 ease-in-out" 
                  />
              </div>
            </div>
            
            {/* Pole Hasło z ikoną */}
            <div className="relative mb-2">
              <label htmlFor="password" className="leading-7 text-xs font-bold text-gray-500 uppercase tracking-wide">Hasło</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiLock />
                  </div>
                  <input 
                    type="password" id="password" name="password" required placeholder="••••••••"
                    className="w-full bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2.5 pl-10 pr-3 transition-colors duration-200 ease-in-out" 
                  />
              </div>
            </div>
            
            <div className="relative mb-6 text-right">
                <Link href="/user/reset-password" className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors font-medium">
                    Zapomniałeś hasła?
                </Link>
            </div>

            <button disabled={loading} className="w-full text-white bg-indigo-600 border-0 py-3 px-6 focus:outline-none hover:bg-indigo-700 rounded-xl text-lg font-medium shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Logowanie...' : <><FiLogIn /> Zaloguj się</>}
            </button>
          </form>
          
          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              Nie masz jeszcze konta? <Link href="/user/register" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">Zarejestruj się</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}