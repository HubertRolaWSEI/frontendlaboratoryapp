import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 p-6">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Nie znaleziono strony</h2>
      <p className="text-lg text-gray-600 mb-8">
        Przepraszamy, ale strona, której szukasz, nie istnieje.
      </p>
      <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
        Wróć do strony głównej
      </Link>
    </div>
  );
}