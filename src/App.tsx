import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Footer from './components/Footer';
import MindMapForm from './components/MindMapForm';
import MindMapDisplay from './components/MindMapDisplay';
import RelatedImages from './components/RelatedImages';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import AdminPanel from './components/AdminPanel';

import { API_BASE, generateMindMap, getRelatedImages } from './services/api';
import { MindMapResponse, ImageResult, TabType } from './types';

axios.defaults.withCredentials = true;

interface User {
  name: string;
  email: string;
  picture: string;
}

const App: React.FC = () => {
  const [mindMapData, setMindMapData] = useState<MindMapResponse | null>(null);
  const [relatedImages, setRelatedImages] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usageLimitReached, setUsageLimitReached] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user`);
        setIsLoggedIn(true);
        setUser(res.data.user);
        setIsAdmin(res.data.isAdmin);
      } catch {
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
      }
    };

    checkSession();
  }, []);

  const handleGenerateMindMap = async (topic: string, type: TabType, text?: string) => {
    if (!isLoggedIn) {
      setError('Please log in to generate a mind map.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUsageLimitReached(false);

    try {
      const response = await generateMindMap({ topic, type, text });
      setMindMapData(response);
      fetchRelatedImages(topic);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Please log in to generate a mind map.');
      } else if (axios.isAxiosError(err) && err.response?.data?.error?.toLowerCase().includes('limit')) {
        setUsageLimitReached(true);
      } else {
        setError('Failed to generate mind map. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedImages = async (topic: string) => {
    setIsLoadingImages(true);
    try {
      const images = await getRelatedImages(topic);
      setRelatedImages(images);
    } catch (err) {
      console.error('Error fetching related images:', err);
      setRelatedImages([]);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleGoogleLogin = () => {
   window.location.href = `${API_BASE}/google-login`;
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`, {});
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        isAdmin={isAdmin}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
                  <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                      Professional Mind Map Generator
                    </h1>
                    <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                      Create beautiful, interactive mind maps from any topic, analogy, or text content.
                    </p>
                    <a
                      href="#generator"
                      className="inline-block bg-white text-blue-600 font-medium py-3 px-6 rounded-md shadow hover:bg-gray-100 transition"
                    >
                      Get Started
                    </a>
                  </div>
                </section>

                <section id="generator" className="py-16 bg-gray-50">
                  <div className="max-w-6xl mx-auto px-4">
                    {!isLoggedIn ? (
                      <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 text-center border">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                          Log in to Generate Mind Maps
                        </h2>
                        <p className="mb-6 text-gray-600">
                          You need to log in to start generating professional mind maps.
                        </p>
                        <button
                          onClick={handleGoogleLogin}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
                        >
                          Sign in with Google
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-5">
                          <MindMapForm onSubmit={handleGenerateMindMap} isLoading={isLoading} />
                          {error && <p className="text-red-600 mt-4">{error}</p>}
                          {usageLimitReached && (
                            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-md border border-yellow-300">
                              <strong>Limit Reached:</strong> You've hit your daily free mind map limit.
                              Please try again tomorrow or contact support for more access.
                            </div>
                          )}
                        </div>
                        <div className="lg:col-span-7">
                          <MindMapDisplay mermaidCode={mindMapData?.mermaidCode || ''} isLoading={isLoading} />
                          <RelatedImages images={relatedImages} isLoading={isLoadingImages} />
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <Features />
                <HowItWorks />
              </>
            }
          />

          <Route
            path="/admin"
            element={
              isLoggedIn && isAdmin ? (
                <AdminPanel />
              ) : (
                <div className="p-6 text-center text-red-600 font-semibold">Access Denied</div>
              )
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
 