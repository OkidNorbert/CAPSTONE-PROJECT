import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/styles';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col justify-center">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-accent-500/30 dark:from-primary-500/10 dark:to-accent-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block text-gray-900 dark:text-white mb-2">Find Your Dream Job</span>
              <span className="gradient-text">Or Perfect Candidate</span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-lg text-gray-500 dark:text-gray-400 sm:text-xl md:mt-8 md:max-w-3xl">
              Connect with the best opportunities and talent in the industry. Start your journey today.
            </p>
            <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12 gap-4">
              {!currentUser ? (
                <>
                  <Link
                    to="/signin"
                    className={cn(
                      "w-full sm:w-auto mb-4 sm:mb-0",
                      "button-gradient px-8 py-3 rounded-full",
                      "text-base font-medium",
                      "hover-effect",
                      "inline-flex items-center justify-center"
                    )}
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/signup"
                    className={cn(
                      "w-full sm:w-auto",
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
                    Sign Up
                  </Link>
                </>
              ) : (
                <Link
                  to={currentUser.role === 'jobseeker' ? '/jobs/search' : '/company/jobs'}
                  className={cn(
                    "w-full sm:w-auto",
                    "button-gradient px-8 py-3 rounded-full",
                    "text-base font-medium",
                    "hover-effect",
                    "inline-flex items-center justify-center"
                  )}
                >
                  {currentUser.role === 'jobseeker' ? 'Browse Jobs' : 'Post a Job'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={cn(
              "glass-effect p-6 rounded-2xl",
              "hover-effect"
            )}>
              <div className="text-primary-500 text-2xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Find Perfect Matches
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Our AI-powered matching system connects you with the most relevant opportunities.
              </p>
            </div>
            <div className={cn(
              "glass-effect p-6 rounded-2xl",
              "hover-effect"
            )}>
              <div className="text-primary-500 text-2xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Easy Application
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Apply to multiple jobs with a single click using your saved profile.
              </p>
            </div>
            <div className={cn(
              "glass-effect p-6 rounded-2xl",
              "hover-effect"
            )}>
              <div className="text-primary-500 text-2xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Track Progress
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Monitor your applications and stay updated with real-time status tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
