import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/app/lib/AuthContext';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';

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

const Footer = () => (
    <footer className="text-gray-500 body-font border-t border-gray-200 mt-auto bg-white/50 backdrop-blur-sm">
        <div className="container px-5 py-6 mx-auto flex items-center justify-center sm:flex-row flex-col">
            <p className="text-sm text-center sm:text-left">
                © {new Date().getFullYear()} Harmonogram Zajęć - Hubert Rola
            </p>
        </div>
    </footer>
);

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      {/* Zmieniono tło całej strony na szare (bg-gray-50), co da kontrast dla białego Sidebara */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex h-screen overflow-hidden text-slate-800`}>
        <AuthProvider>
            {/* Sidebar (Desktop) */}
            <Sidebar />
            
            {/* Główny kontener treści */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* Navbar (Tylko Mobile) */}
                <div className="md:hidden sticky top-0 z-40">
                    <Navbar />
                </div>
                
                {/* Główny obszar scrollowania */}
                <main className="flex-grow overflow-y-auto bg-gray-50 w-full h-full flex flex-col">
                    <div className="container mx-auto px-5 py-8 pb-24 md:pb-8 max-w-7xl flex-grow">
                        {children}
                    </div>
                    {/* Stopka jest teraz częścią scrollowanego kontenera i zawsze na dole */}
                    <Footer />
                </main>
            </div>
        </AuthProvider>
      </body>
    </html>
  );
}