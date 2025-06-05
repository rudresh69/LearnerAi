import React, { useState } from 'react';
import { BrainCircuit, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  name: string;
  email: string;
  picture: string;
}

interface HeaderProps {
  isLoggedIn: boolean;
  user: User | null;
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  user,
  isAdmin,
  onLogin,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo & Title */}
        <a href="/" className="flex items-center space-x-2 hover:opacity-90">
          <BrainCircuit className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">
            Learner.Ai
          </h1>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center space-x-6">
          <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</a>
          <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
          <a href="#feedback" className="text-gray-600 hover:text-blue-600">Feedback</a>
          {isAdmin && (
            <a href="/admin" className="text-red-600 font-semibold hover:underline">Admin Panel</a>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden sm:flex items-center gap-3">
          {isLoggedIn && user ? (
            <>
              <img
                src={user.picture}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
              <span className="text-sm text-gray-700">{user.name}</span>
              <button
                onClick={onLogout}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Login with Google
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle + Auth */}
        <div className="sm:hidden flex items-center gap-3">
          {isLoggedIn && user ? (
            <img
              src={user.picture}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <button
              onClick={onLogin}
              className="bg-red-500 text-white px-3 py-1.5 rounded text-sm"
            >
              Login
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="sm:hidden px-4 pb-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-3 mt-2">
              <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600">About</a>
              <a href="#feedback" className="text-gray-600 hover:text-blue-600">Feedback</a>
              {isAdmin && (
                <a href="/admin" className="text-red-600 font-semibold hover:underline">Admin Panel</a>
              )}
              {isLoggedIn && (
                <button
                  onClick={onLogout}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm mt-2"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
