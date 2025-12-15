'use client';
import { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { useAuth } from '@/app/lib/AuthContext'; 
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword.length < 6) {
        setError("Nowe hasło musi mieć co najmniej 6 znaków.");
        setLoading(false);
        return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Hasła nie pasują do siebie.");
      setLoading(false);
      return;
    }
    
    try {
      await updatePassword(user, newPassword);
      setSuccess(true);
      setError(null);
      
      await signOut(auth);
      router.push('/user/signin?message=password-changed');

    } catch (err) {
        let errorMessage = "Błąd zmiany hasła.";
        if (err.code === 'auth/requires-recent-login') {
            errorMessage = "Wymagane jest ponowne zalogowanie! Wylogujemy Cię teraz. Zaloguj się ponownie i spróbuj zmienić hasło w ciągu 1 minuty.";
            signOut(auth).finally(() => {
                 router.push('/user/signin?reauth=true');
            });
        } else if (err.code === 'auth/weak-password') {
            errorMessage = "Hasło jest za słabe. Użyj silniejszego hasła (min. 6 znaków).";
        } else {
            errorMessage = `Wystąpił błąd: ${err.message}`;
        }

        setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Ładowanie profilu...</div>;
  }

  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap justify-center">
        <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 shadow-md rounded-lg p-8 border border-gray-200">
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Zmień Hasło</h2>
          <p className="leading-relaxed mb-5 text-gray-600">
            Wprowadź nowe hasło do swojego konta ({user.email}).
          </p>

          {error && (
            <div className="mb-4 text-red-500 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-green-500 text-sm font-medium">
              ✅ Hasło zmienione pomyślnie! Przekierowywanie do logowania...
            </div>
          )}

          <form onSubmit={onSubmit}>
            
            <div className="relative mb-4">
              <label htmlFor="newPassword" className="leading-7 text-sm text-gray-600">Nowe hasło</label>
              <input 
                type="password" id="newPassword" name="newPassword" required
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" 
              />
            </div>
            
            <div className="relative mb-6">
              <label htmlFor="confirmPassword" className="leading-7 text-sm text-gray-600">Powtórz nowe hasło</label>
              <input 
                type="password" id="confirmPassword" name="confirmPassword" required
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`text-white border-0 py-2 px-6 focus:outline-none rounded text-lg w-full ${loading ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'}`}
            >
              {loading ? 'Zmienianie...' : 'Zmień hasło'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}