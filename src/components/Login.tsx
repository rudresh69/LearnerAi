import React from 'react';
import { API_BASE } from '../services/api';

const Login: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/google-login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 px-4">
      <div className="bg-white w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-xl text-center space-y-6 animate-fadeIn">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Welcome to Learner.ai</h2>
        <p className="text-gray-600 text-base">Log in to continue</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center space-x-3 transition-all duration-200"
          aria-label="Sign in with Google"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
