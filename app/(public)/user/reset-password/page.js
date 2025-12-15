'use client';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import Link from 'next/link';
import { FiMail, FiArrowLeft, FiLock } from 'react-icons/fi';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null); 
  const [error, setError] = useState(null);   
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      
      setMessage(`✅ Link został wysłany na adres: ${email}. Sprawdź skrzynkę (i spam).`);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError("Nie znaleziono konta z tym adresem email.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Niepoprawny format adresu email.");
      } else {
        setError("Wystąpił błąd. Spróbuj ponownie.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="text-gray-600 body-font h-full flex items-center justify-center">
      <div className="container px-5 py-24 mx-auto flex justify-center items-center">
        
        <div className="lg:w-1/3 md:w-1/2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden text-center">
          
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500 shadow-sm">
                <FiLock className="w-8 h-8" />
            </div>
            <h2 className="text-gray-900 text-2xl font-bold title-font mb-2">Resetuj hasło</h2>
            <p className="text-gray-500 text-sm">
              Wyślemy Ci bezpieczny link do ustawienia nowego hasła.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 text-sm font-medium p-3 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 text-sm font-medium p-3 rounded-lg bg-green-50 text-green-700 border border-green-100 text-left">
              {message}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="relative mb-6 text-left">
              <label htmlFor="email" className="leading-7 text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email</label>
              <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FiMail />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="twoj@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2.5 pl-10 pr-3 transition-colors" 
                  />
              </div>
            </div>
            
            <button 
              disabled={loading}
              className="w-full text-white bg-indigo-600 border-0 py-3 px-6 focus:outline-none hover:bg-indigo-700 rounded-xl text-lg font-medium shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Wysyłanie...' : 'Wyślij link'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link href="/user/signin" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium group">
                <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Wróć do logowania
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}