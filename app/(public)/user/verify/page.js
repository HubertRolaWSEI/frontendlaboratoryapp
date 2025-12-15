'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendEmailVerification, signOut } from 'firebase/auth'; 
import { useAuth } from '@/app/lib/AuthContext'; 
import { auth } from '@/app/lib/firebase'; 
import { FiMail, FiCheckCircle, FiRefreshCw, FiArrowLeft, FiLogOut } from 'react-icons/fi';

export default function VerifyEmail() {
    const { user } = useAuth(); 
    const params = useSearchParams();
    const router = useRouter();
    const initialEmail = params.get('email');

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    const [isVerified, setIsVerified] = useState(false);

    const displayEmail = user?.email || initialEmail || "Twój adres e-mail";

    useEffect(() => {
        let interval;

        // Jeśli użytkownik jest zalogowany, ale niezweryfikowany - sprawdzaj co 3s
        if (user && !user.emailVerified) {
            interval = setInterval(async () => {
                try {
                    await user.reload();
                    
                    if (user.emailVerified) {
                        setIsVerified(true);
                        clearInterval(interval); 
                        setMessage({ 
                            type: 'success', 
                            text: '✅ Twoje konto zostało pomyślnie zweryfikowane!' 
                        });
                    }
                } catch (error) {
                    console.error("Błąd sprawdzania statusu:", error);
                }
            }, 3000); 
        } 
        // Jeśli użytkownik wszedł na stronę i już jest zweryfikowany
        else if (user && user.emailVerified) {
             setIsVerified(true);
        }

        return () => clearInterval(interval);
    }, [user]);

    const handleFinish = async () => {
        try {
            await signOut(auth); 
            router.push('/user/signin'); 
        } catch (error) {
            console.error("Błąd wylogowania:", error);
        }
    };

    const handleResend = async () => {
        if (!user) {
            setMessage({ type: 'error', text: 'Musisz być zalogowany, aby wysłać e-mail. Zaloguj się ponownie.' });
            return;
        }
        setIsLoading(true);
        setMessage(null);
        try {
            await sendEmailVerification(user); 
            setMessage({ 
                type: 'success', 
                text: `✅ E-mail weryfikacyjny został wysłany ponownie na adres ${user.email}.` 
            });
        } catch (error) {
            setMessage({ type: 'error', text: `⚠️ Błąd: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="text-gray-600 body-font h-full flex items-center justify-center">
            <div className="container px-5 py-24 mx-auto flex justify-center items-center">
                
                <div className="lg:w-1/3 md:w-1/2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden text-center">
                    
                    {/* Pasek dekoracyjny - zmienia kolor w zależności od statusu */}
                    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${isVerified ? 'from-green-400 to-emerald-500' : 'from-indigo-500 to-purple-500'}`}></div>
                    
                    <div className="mb-8 mt-2">
                        {/* Ikona statusu */}
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isVerified ? 'bg-green-100 text-green-500' : 'bg-indigo-50 text-indigo-500'}`}>
                            {isVerified ? <FiCheckCircle className="w-10 h-10" /> : <FiMail className="w-10 h-10" />}
                        </div>
                        
                        <h2 className="text-gray-900 text-2xl font-bold title-font mb-2">
                            {isVerified ? 'Konto Zweryfikowane!' : 'Weryfikacja Email'}
                        </h2>
                        
                        {!isVerified && (
                             <p className="text-gray-500 text-sm">
                                Aby kontynuować, musimy potwierdzić, że to Ty.
                            </p>
                        )}
                    </div>

                    {message && (
                        <div className={`mb-6 text-sm font-medium p-3 rounded-lg flex items-center justify-center border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {message.text}
                        </div>
                    )}
                    
                    {isVerified ? (
                        <>
                            <p className="leading-relaxed mb-8 text-gray-600">
                                Dziękujemy za potwierdzenie adresu. Możesz teraz bezpiecznie korzystać ze wszystkich funkcji aplikacji.
                            </p>
                            <button 
                                onClick={handleFinish}
                                className="w-full text-white bg-green-500 border-0 py-3 px-6 focus:outline-none hover:bg-green-600 rounded-xl text-lg font-medium shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                            >
                                <FiLogOut /> Przejdź do logowania
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Wyświetlanie emaila */}
                            <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase font-bold mb-1 tracking-wide">Wysłano na adres</p>
                                <p className="text-gray-900 font-semibold break-all text-lg">{displayEmail}</p>
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                Kliknij w link, który wysłaliśmy na Twoją skrzynkę.<br/>
                                <span className="text-xs text-indigo-500 font-medium animate-pulse">(Czekamy na potwierdzenie...)</span>
                            </p>

                            <button 
                                onClick={handleResend}
                                disabled={!user || isLoading}
                                className="w-full text-white bg-indigo-600 border-0 py-3 px-6 focus:outline-none hover:bg-indigo-700 rounded-xl text-lg font-medium shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Wysyłanie...' : <><FiRefreshCw /> Wyślij ponownie</>}
                            </button>
                            
                            <div className="mt-6 text-center border-t border-gray-100 pt-4">
                                <Link href="/user/signin" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium group">
                                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                    Wróć do logowania
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}