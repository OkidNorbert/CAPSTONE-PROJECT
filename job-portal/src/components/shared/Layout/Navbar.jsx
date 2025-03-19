import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../utils/styles';
import { useState } from 'react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const commonLinkClasses = "hover-effect text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium";

  const renderNavLinks = () => {
    if (!currentUser) {
      return (
        <>
          <Link to="/" className={commonLinkClasses}>Home</Link>
          <Link to="/about" className={commonLinkClasses}>About</Link>
          <Link to="/contact" className={commonLinkClasses}>Contact</Link>
        </>
      );
    }

    switch (currentUser.role) {
      case 'admin':
        return (
          <>
            <Link to="/admin/reports" className={commonLinkClasses}>Dashboard</Link>
            <Link to="/admin/users" className={commonLinkClasses}>Users</Link>
            <Link to="/admin/jobs" className={commonLinkClasses}>Jobs</Link>
            <Link to="/admin/settings" className={commonLinkClasses}>Settings</Link>
          </>
        );
      case 'jobseeker':
        return (
          <>
            <Link to="/jobs/search" className={commonLinkClasses}>Find Jobs</Link>
            <Link to="/profile" className={commonLinkClasses}>Profile</Link>
            <Link to="/applications" className={commonLinkClasses}>Applications</Link>
          </>
        );
      case 'employer':
        return (
          <>
            <Link to="/company/dashboard" className={commonLinkClasses}>Dashboard</Link>
            <Link to="/company/jobs" className={commonLinkClasses}>Manage Jobs</Link>
            <Link to="/company/profile" className={commonLinkClasses}>Company Profile</Link>
          </>
        );
      default:
        return null;
    }
  };

  const renderMobileNavLinks = () => {
    if (!currentUser) {
      return (
        <>
          <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Home</Link>
          <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">About</Link>
          <Link to="/contact" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Contact</Link>
        </>
      );
    }

    switch (currentUser.role) {
      case 'admin':
        return (
          <>
            <Link to="/admin/reports" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Dashboard</Link>
            <Link to="/admin/users" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Users</Link>
            <Link to="/admin/jobs" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Jobs</Link>
            <Link to="/admin/settings" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Settings</Link>
          </>
        );
      case 'jobseeker':
        return (
          <>
            <Link to="/jobs/search" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Find Jobs</Link>
            <Link to="/profile" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Profile</Link>
            <Link to="/applications" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Applications</Link>
          </>
        );
      case 'employer':
        return (
          <>
            <Link to="/company/dashboard" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Dashboard</Link>
            <Link to="/company/jobs" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Manage Jobs</Link>
            <Link to="/company/profile" className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Company Profile</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
      "border-b border-gray-200 dark:border-gray-800"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={currentUser ? `/${currentUser.role}/dashboard` : "/"} className="flex-shrink-0 flex items-center">
              <span className="gradient-text text-2xl font-bold tracking-tight">JOBSEEK</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              {renderNavLinks()}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full transition-colors duration-200",
                "text-gray-600 dark:text-gray-300",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-primary-500"
              )}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
                  {currentUser.email}
                </span>
                <button
                  onClick={logout}
                  className={cn(
                    "button-gradient px-4 py-2 rounded-full",
                    "text-sm font-medium",
                    "hover-effect"
                  )}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className={cn(
                  "button-gradient px-4 py-2 rounded-full",
                  "text-sm font-medium",
                  "hover-effect"
                )}
              >
                Login
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon for close */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          {renderMobileNavLinks()}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
