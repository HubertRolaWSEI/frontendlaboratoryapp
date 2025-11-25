'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/app/lib/firebase' // Importujemy auth z naszego pliku firebase.js

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Nasłuchiwanie zmian stanu autoryzacji
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe() // Oczyszczenie subskrypcji
  }, [])

  // Dodajemy loading, aby uniknąć błędów podczas pierwszego renderowania
  if (loading) {
      return <div>Ładowanie...</div> 
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)