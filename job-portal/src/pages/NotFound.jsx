import { Link } from 'react-router-dom';
import { cn } from '../utils/styles';

const NotFound = () => {
  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col justify-center">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex justify-center">
          <span className="text-9xl font-bold gradient-text">404</span>
        </div>
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              Page not found
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
              Oops! We couldn't find that page.
            </h1>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                to="/"
                className={cn(
                  "button-gradient px-8 py-3 rounded-full",
                  "text-base font-medium",
                  "hover-effect",
                  "inline-flex items-center justify-center"
                )}
              >
                Go back home
              </Link>
              <Link
                to="/contact"
                className={cn(
                  "px-8 py-3 rounded-full",
                  "text-base font-medium",
                  "hover-effect",
                  "inline-flex items-center justify-center",
                  "bg-white dark:bg-gray-800",
                  "text-primary-600 dark:text-primary-400",
                  "border-2 border-primary-500 dark:border-primary-400",
                  "hover:bg-primary-50 dark:hover:bg-gray-700"
                )}
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
