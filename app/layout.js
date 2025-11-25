import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/app/lib/AuthContext';
import Navbar from '@/app/components/Navbar'; // Importujemy nową nawigację

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Frontend Laboratory App",
  description: "Projekt z uwierzytelnianiem i harmonogramem zajęć.",
};

// Stopka Tailblocks (statyczna)
const Footer = () => (
    <footer className="text-gray-600 body-font bg-white border-t border-gray-200 mt-auto">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
            <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="ml-3 text-xl">Planer</span>
            </a>
            <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                © {new Date().getFullYear()} Frontend Laboratory
            </p>
        </div>
    </footer>
);

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex flex-col min-h-screen`}>
        <AuthProvider>
            
            {/* Nowa Nawigacja z Tailblocks */}
            <Navbar />

            {/* Główna treść w kontenerze */}
            <main className="flex-grow container mx-auto px-5 py-8">
                {children}
            </main>

            {/* Stopka z Tailblocks */}
            <Footer />

        </AuthProvider>
      </body>
    </html>
  );
}