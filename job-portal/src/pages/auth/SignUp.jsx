import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/styles';

const SignUp = () => {
  const navigate = useNavigate();
  const { register, error, clearError, redirectPath, clearRedirectPath } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
      clearRedirectPath();
    }
  }, [redirectPath, navigate, clearRedirectPath]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) clearError();
    if (formError) setFormError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setFormError('');

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col justify-center bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold gradient-text">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={cn(
          "glass-effect py-8 px-4 shadow sm:rounded-2xl sm:px-10",
          "hover-effect"
        )}>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {(formError || error) && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">⚠️</div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      {formError || error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={cn(
                    "mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm",
                    "focus:outline-none focus:ring-primary-500 focus:border-primary-500",
                    "text-gray-900 dark:text-white",
                    "bg-white dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-600"
                  )}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={cn(
                    "mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm",
                    "focus:outline-none focus:ring-primary-500 focus:border-primary-500",
                    "text-gray-900 dark:text-white",
                    "bg-white dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-600"
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  "mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm",
                  "focus:outline-none focus:ring-primary-500 focus:border-primary-500",
                  "text-gray-900 dark:text-white",
                  "bg-white dark:bg-gray-800",
                  "border-gray-300 dark:border-gray-600"
                )}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={cn(
                  "mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm",
                  "focus:outline-none focus:ring-primary-500 focus:border-primary-500",
                  "text-gray-900 dark:text-white",
                  "bg-white dark:bg-gray-800",
                  "border-gray-300 dark:border-gray-600"
                )}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={cn(
                  "mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm",
                  "focus:outline-none focus:ring-primary-500 focus:border-primary-500",
                  "text-gray-900 dark:text-white",
                  "bg-white dark:bg-gray-800",
                  "border-gray-300 dark:border-gray-600"
                )}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                I want to
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={cn(
                  "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm",
                  "focus:outline-none focus:ring-primary-500 focus:border-primary-500",
                  "text-gray-900 dark:text-white",
                  "bg-white dark:bg-gray-800",
                  "border-gray-300 dark:border-gray-600"
                )}
              >
                <option value="jobseeker">Find a job</option>
                <option value="employer">Hire talent</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
                "button-gradient",
                "hover-effect",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 