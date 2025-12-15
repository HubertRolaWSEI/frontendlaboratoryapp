'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut(auth)
      .then(() => {
        console.log("Wylogowano pomyślnie.");
        router.push('/');
      })
      .catch((error) => {
        console.error('Błąd wylogowania:', error);
        router.push('/');
      });
  }, [router]);
}