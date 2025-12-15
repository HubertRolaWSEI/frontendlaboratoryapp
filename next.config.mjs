/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dodanie konfiguracji obrazów
  images: {
    // Lista dozwolonych domen dla zewnętrznych obrazów
    remotePatterns: [
        {
            // Domena dla domyślnych placeholderów
            hostname: 'dummyimage.com', 
        },
        {
            // Dodajemy hosta, który spowodował błąd
            hostname: 'www.google.com', 
        },
        {
            // Dodajemy domenę, z której faktycznie ładowane jest zdjęcie z podanego URL-a
            hostname: 'media.licdn.com',
        },
        // Możesz dodać inne domeny, jeśli to konieczne
    ],
  },
  /* config options here */
};

export default nextConfig;