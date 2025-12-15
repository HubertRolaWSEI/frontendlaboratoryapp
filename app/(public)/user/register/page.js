'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import Link from 'next/link';
import { FiMail, FiLock, FiUserPlus, FiShield } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;

    if (password !== passwordConfirm) {
      setError("Hasła nie pasują do siebie.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      router.push(`/user/verify?email=${email}`);
    } catch (err) {
      let errorMessage = "Błąd rejestracji.";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "Email jest już zajęty. Użyj innego adresu lub zaloguj się."; 
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Hasło jest za słabe (min. 6 znaków).";
      } else if (err.message) {
        errorMessage = err.message; 
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <section className="text-gray-600 body-font h-full flex items-center justify-center">
      <div className="container px-5 py-24 mx-auto flex justify-center items-center">
        
        <div className="lg:w-1/3 md:w-1/2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          <div className="text-center mb-8">
            <h2 className="text-gray-900 text-2xl font-bold title-font mb-2">Utwórz konto</h2>
            <p className="text-gray-500 text-sm">
              Dołącz do nas i zacznij planować swój czas efektywnie.
            </p>
          </div>

          {error && (
            <div className="mb-6 text-sm font-medium p-3 rounded-lg bg-red-50 text-red-600 flex items-center border border-red-100">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiMail />
                  </div>
                  <input type="email" id="email" name="email" required placeholder="twoj@email.com" className="w-full bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2.5 pl-10 pr-3 transition-colors duration-200 ease-in-out" />
              </div>
            </div>

            <div className="relative mb-4">
              <label htmlFor="password" className="leading-7 text-xs font-bold text-gray-500 uppercase tracking-wide">Hasło</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiLock />
                  </div>
                  <input type="password" id="password" name="password" required placeholder="Minimum 6 znaków" className="w-full bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2.5 pl-10 pr-3 transition-colors duration-200 ease-in-out" />
              </div>
            </div>

            <div className="relative mb-6">
              <label htmlFor="passwordConfirm" className="leading-7 text-xs font-bold text-gray-500 uppercase tracking-wide">Powtórz Hasło</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiShield />
                  </div>
                  <input type="password" id="passwordConfirm" name="passwordConfirm" required placeholder="Powtórz hasło" className="w-full bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2.5 pl-10 pr-3 transition-colors duration-200 ease-in-out" />
              </div>
            </div>

            <button disabled={loading} className="w-full text-white bg-indigo-600 border-0 py-3 px-6 focus:outline-none hover:bg-indigo-700 rounded-xl text-lg font-medium shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? 'Rejestrowanie...' : <><FiUserPlus /> Zarejestruj się</>}
            </button>
          </form>
          
          <div className="mt-6 text-center border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              Masz już konto? <Link href="/user/signin" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">Zaloguj się</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}