'use client'
import { useAuth } from "@/app/lib/AuthContext"; // Poprawiona ścieżka
import { useLayoutEffect } from "react";
import { redirect } from 'next/navigation';
import { usePathname } from 'next/navigation';

function Protected({children}) {
    const { user, loading } = useAuth(); // Sprawdzamy też loading
    const returnUrl = usePathname();

    useLayoutEffect(() => {
        if (!loading && !user){ // Sprawdzamy dopiero po załadowaniu
            // Używamy /user/signin zamiast /user/singin
            redirect(`/user/signin?returnUrl=${returnUrl}`);
        }
    }, [user, loading, returnUrl]);

    // Dodajemy warunek na czas ładowania, aby uniknąć błysku niechronionej treści
    if (loading || !user) {
        return <div>Sprawdzanie uprawnień...</div>;
    }

    return (
    <>
        { children }
    </> );
}

export default Protected;