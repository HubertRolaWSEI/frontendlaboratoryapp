'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { auth } from '@/app/lib/firebase';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const returnUrl = params.get("returnUrl");
  const [error, setError] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);
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
          });
      })
      .catch(error => setError("Błąd sesji przeglądarki."));
  };

  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap justify-center">
        <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 shadow-md rounded-lg p-8 border border-gray-200">
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Zaloguj się</h2>
          <p className="leading-relaxed mb-5 text-gray-600">
            Wprowadź swoje dane, aby uzyskać dostęp do planera.
          </p>

          {/* Wyświetlanie błędu w stylu Tailblocks */}
          {error && (
            <div className="mb-4 text-red-500 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="relative mb-4">
              <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
              <input 
                type="email" id="email" name="email" required
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" 
              />
            </div>
            <div className="relative mb-4">
              <label htmlFor="password" className="leading-7 text-sm text-gray-600">Hasło</label>
              <input 
                type="password" id="password" name="password" required
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" 
              />
            </div>
            <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg w-full">
              Zaloguj
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Nie masz konta? <Link href="/user/register" className="text-indigo-500 hover:text-indigo-600">Zarejestruj się</Link>
          </p>
        </div>
      </div>
    </section>
  );
}