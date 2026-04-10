// client/src/components/Layout.jsx
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Layout = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <nav className="banner-topbar shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="topbar-row">
            <div className="topbar-side">
              <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
                Mini CRM
              </Link>
            </div>
            {user && (
              <div className="banner-center">
                <Link to="/" className="banner-link">
                  Dashboard
                </Link>
                <Link to="/leads" className="banner-link">
                  Leads
                </Link>
                <Link to="/activities" className="banner-link">
                  Activities
                </Link>
              </div>
            )}
            <div className="topbar-side topbar-actions">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/profile" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
                    {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-gray-700 dark:text-gray-300">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
