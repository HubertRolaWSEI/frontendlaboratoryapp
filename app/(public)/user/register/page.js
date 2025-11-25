'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const email = e.target.email.value;
    const password = e.target.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;

    if (password !== passwordConfirm) {
      setError("Hasła nie pasują do siebie.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError("Email zajęty.");
      else if (err.code === 'auth/weak-password') setError("Hasło za słabe (min. 6 znaków).");
      else setError("Błąd rejestracji.");
    }
  };

  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap justify-center">
        <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 shadow-md rounded-lg p-8 border border-gray-200">
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Rejestracja</h2>
          <p className="leading-relaxed mb-5 text-gray-600">
            Utwórz nowe konto, aby zarządzać swoim czasem.
          </p>

          {/* Obsługa błędów i sukcesu */}
          {error && <div className="mb-4 text-red-500 text-sm">⚠️ {error}</div>}
          {success && <div className="mb-4 text-green-500 text-sm">✅ Konto utworzone! Przekierowywanie...</div>}

          <form onSubmit={onSubmit}>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
              <input type="email" id="email" name="email" required className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div className="relative mb-4">
              <label htmlFor="password" className="leading-7 text-sm text-gray-600">Hasło</label>
              <input type="password" id="password" name="password" required className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div className="relative mb-4">
              <label htmlFor="passwordConfirm" className="leading-7 text-sm text-gray-600">Powtórz Hasło</label>
              <input type="password" id="passwordConfirm" name="passwordConfirm" required className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg w-full">
              Zarejestruj się
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Masz już konto? <Link href="/user/signin" className="text-indigo-500 hover:text-indigo-600">Zaloguj się</Link>
          </p>
        </div>
      </div>
    </section>
  );
}