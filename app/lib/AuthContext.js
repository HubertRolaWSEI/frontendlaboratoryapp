'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/app/lib/firebase' 
import { usePathname, useRouter } from 'next/navigation'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)


      if (currentUser && !currentUser.emailVerified) {
        const isPublicAuthPage = pathname.startsWith('/user/signin') 
                              || pathname.startsWith('/user/register') 
                              || pathname.startsWith('/user/verify');

        if (!isPublicAuthPage) {
            const userEmail = currentUser.email;
            router.push(`/user/verify?email=${userEmail}`);
        }
      }
    })
    return () => unsubscribe()
  }, [router, pathname])

  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Ładowanie...</h1>
            <p className="text-gray-600">Przygotowanie kontekstu autoryzacji.</p>
        </div>
      );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)