import { Link } from 'react-router';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl text-orange-600 dark:text-orange-500 mb-4">404</h1>
        <h2 className="text-3xl lg:text-4xl mb-4">Página No Encontrada</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Home className="mr-2 w-5 h-5" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
