import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext'; 
import { LogOut, User, Heart, Sun, Moon, Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext); 

  return (
    <header className="bg-white dark:bg-gray-900 shadow transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="md:hidden mr-2 text-gray-600 dark:text-gray-300 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="text-xl font-bold text-primary-600 dark:text-blue-400 flex items-center">
            <Heart className="mr-2" size={24} fill="#0087e0" stroke="#0087e0" />
            <span>HealthAI Assistant</span>
          </Link>
        </div>

        {isAuthenticated && (
          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <User size={16} className="mr-1" />
              <span>{user?.name}</span>
            </div>

            <div className="relative flex items-center">
              <button
                onClick={toggleTheme}
                className="relative w-16 h-8 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 cursor-pointer transition-all duration-500 ease-in-out focus:outline-none"
                aria-label="Toggle theme"
              >
                <div
                  className={`absolute w-6 h-6 bg-white dark:bg-blue-500 rounded-full shadow-md transform transition-transform duration-500 ease-in-out ${
                    darkMode ? 'translate-x-9' : 'translate-x-0'
                  }`}
                >
                  {darkMode ? (
                    <Moon size={16} className="text-gray-900 m-1" />
                  ) : (
                    <Sun size={16} className="text-yellow-500 m-1" />
                  )}
                </div>
              </button>
            </div>

            <button
              onClick={logout}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
            >
              <LogOut size={16} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
