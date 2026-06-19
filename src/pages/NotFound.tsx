import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-teal-600 leading-none">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-gray-800">Page not found</h1>
        <p className="mt-2 text-gray-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            Go back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
}
