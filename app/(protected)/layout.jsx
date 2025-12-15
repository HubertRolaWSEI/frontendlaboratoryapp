'use client'
import { useAuth } from "@/app/lib/AuthContext";
import { useLayoutEffect } from "react";
import { redirect, usePathname } from 'next/navigation';

function Protected({children}) {
    const { user, loading } = useAuth();
    const returnUrl = usePathname();

    useLayoutEffect(() => {
        if (!loading && !user){ 
            redirect(`/user/signin?returnUrl=${returnUrl}`);
        }
    }, [user, loading, returnUrl]);

    if (loading || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Sprawdzanie uprawnień...</h1>
                <p className="text-gray-600">Ładowanie danych użytkownika dla chronionej strony.</p>
            </div>
        );
    }

    return (
    <>
        { children }
    </> );
}

export default Protected;