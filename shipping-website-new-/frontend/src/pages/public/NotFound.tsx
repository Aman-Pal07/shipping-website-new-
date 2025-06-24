import { Link } from 'wouter';
import { Package, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 mx-auto">
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}