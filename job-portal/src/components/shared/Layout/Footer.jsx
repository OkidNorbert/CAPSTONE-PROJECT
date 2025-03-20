import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/styles';

const Footer = () => {
  const navigation = {
    main: [
      { name: 'About', href: '/about' },
      { name: 'Jobs', href: '/jobs' },
      { name: 'Companies', href: '/companies' },
      { name: 'Contact', href: '/contact' },
      { name: 'Blog', href: '/blog' },
      { name: 'Help Center', href: '/help' },
    ],
    jobSeeker: [
      { name: 'Find Jobs', href: '/jobs/search' },
      { name: 'Career Resources', href: '/resources' },
      { name: 'Resume Builder', href: '/resume-builder' },
      { name: 'Salary Calculator', href: '/salary-calculator' },
      { name: 'Job Alerts', href: '/job-alerts' },
    ],
    employer: [
      { name: 'Post a Job', href: '/employer/jobs/new' },
      { name: 'Browse Resumes', href: '/employer/resumes' },
      { name: 'Recruiting Solutions', href: '/employer/solutions' },
      { name: 'Pricing', href: '/employer/pricing' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
    social: [
      {
        name: 'LinkedIn',
        href: '#',
        icon: '🔗'
      },
      {
        name: 'Twitter',
        href: '#',
        icon: '🐦'
      },
      {
        name: 'Facebook',
        href: '#',
        icon: '📘'
      },
      {
        name: 'Instagram',
        href: '#',
        icon: '📸'
      }
    ]
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand and Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center">
              <span className="gradient-text text-2xl font-bold tracking-tight">JOBSEEK</span>
            </Link>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400 max-w-md">
              Connecting talented individuals with great opportunities. Find your dream job or the perfect candidate with JOBSEEK.
            </p>
            <div className="mt-6 flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="sr-only">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
              For Job Seekers
            </h3>
            <ul className="mt-4 space-y-4">
              {navigation.jobSeeker.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
              For Employers
            </h3>
            <ul className="mt-4 space-y-4">
              {navigation.employer.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <nav className="flex space-x-4 mb-4 md:mb-0">
              {navigation.main.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <p className="text-base text-gray-400 dark:text-gray-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} JOBSEEK. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
