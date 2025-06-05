import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';

interface Session {
  email: string;
  name: string;
  ip: string;
  agent: string;
  login_time: string;
  mindMapsUsed: number;
  mindMapLimit: number;
  status: string;
}

interface CacheKey {
  topic: string;
  map_type: string;
}

const AdminPanel: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filtered, setFiltered] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [terminatingEmail, setTerminatingEmail] = useState<string | null>(null);
  const [resettingEmail, setResettingEmail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cachedKeys, setCachedKeys] = useState<CacheKey[]>([]);
  const [cacheLoading, setCacheLoading] = useState(false);
  const [cacheError, setCacheError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
    fetchCacheKeys();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/sessions`, {
        withCredentials: true,
      });
      setSessions(res.data);
      setFiltered(res.data);
      setError(null);
    } catch {
      setError('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCacheKeys = async () => {
    setCacheLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/cached-maps`, {
        withCredentials: true,
      });
      setCachedKeys(res.data);
      setCacheError(null);
    } catch {
      setCacheError('Failed to fetch cache keys');
    } finally {
      setCacheLoading(false);
    }
  };

  const clearSpecificCache = async (key: CacheKey) => {
    const { topic, map_type } = key;
    setCacheLoading(true);
    try {
      await axios.post(`${API_BASE}/admin/clear-cache`, {
        topic: topic.trim().toLowerCase(),
        map_type: map_type.trim().toLowerCase(),
      });
      setCachedKeys(prev => prev.filter(k => !(k.topic === topic && k.map_type === map_type)));
      setCacheError(null);
    } catch {
      setCacheError(`Failed to clear cache for ${topic}_${map_type}`);
    } finally {
      setCacheLoading(false);
    }
  };

  const handleTerminateSession = async (email: string) => {
    setTerminatingEmail(email);
    try {
      await axios.post(`${API_BASE}/admin/terminate-session`, { email }, { withCredentials: true });
      const updated = sessions.filter(s => s.email !== email);
      setSessions(updated);
      setFiltered(updated);
    } catch {
      setError('Failed to terminate session');
    } finally {
      setTerminatingEmail(null);
    }
  };

  const handleResetMindMaps = async (email: string) => {
    setResettingEmail(email);
    try {
      await axios.post(`${API_BASE}/admin/reset-mindmaps`, { email }, { withCredentials: true });
      setSessions(prev => prev.map(s => s.email === email ? { ...s, mindMapsUsed: 0 } : s));
      setFiltered(prev => prev.map(s => s.email === email ? { ...s, mindMapsUsed: 0 } : s));
    } catch {
      setError('Failed to reset mind maps');
    } finally {
      setResettingEmail(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFiltered(sessions.filter(session =>
      session.email.toLowerCase().includes(term) ||
      session.name?.toLowerCase().includes(term) ||
      session.ip.toLowerCase().includes(term)
    ));
  };

  return (
    <div className="admin-panel p-4 md:p-6 lg:p-8 mx-auto mt-6 max-w-[95%] xl:max-w-7xl">
      {/* Header + Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={fetchSessions}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Active Users Count */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6 flex items-center flex-wrap gap-2 text-sm sm:text-base">
          <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-blue-800 font-medium">Active Users:</span>
          <span className="text-blue-900 font-bold">{filtered.length}</span>
          <span className="text-blue-800 ml-3">
            (🟢 {filtered.filter(u => u.status === 'online').length} online /
            ⚪ {filtered.filter(u => u.status !== 'online').length} offline)
          </span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by email, name, or IP..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full mb-6 p-3 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm sm:text-base">{error}</div>
      )}

      {/* Sessions Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading sessions...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-50 p-6 text-center rounded-md border border-gray-200 text-gray-500">
          No matching sessions found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md shadow-md border border-gray-200">
          <table className="min-w-full text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="px-4 py-3 border-b font-semibold">Email</th>
                <th className="px-4 py-3 border-b font-semibold hidden sm:table-cell">Name</th>
                <th className="px-4 py-3 border-b font-semibold hidden md:table-cell">IP</th>
                <th className="px-4 py-3 border-b font-semibold hidden lg:table-cell">User Agent</th>
                <th className="px-4 py-3 border-b font-semibold hidden md:table-cell">Login Time</th>
                <th className="px-4 py-3 border-b font-semibold text-center">Maps</th>
                <th className="px-4 py-3 border-b font-semibold text-center">Status</th>
                <th className="px-4 py-3 border-b font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(session => {
                const limitReached = session.mindMapsUsed >= session.mindMapLimit;
                return (
                  <tr key={session.email} className={limitReached ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 border-b truncate">{session.email}</td>
                    <td className="px-4 py-3 border-b hidden sm:table-cell">{session.name}</td>
                    <td className="px-4 py-3 border-b hidden md:table-cell">{session.ip}</td>
                    <td className="px-4 py-3 border-b hidden lg:table-cell max-w-[200px]">
                        <div className="max-h-16 overflow-y-auto text-xs whitespace-normal break-words">
                          {session.agent}
                        </div>
                    </td>
                    <td className="px-4 py-3 border-b hidden md:table-cell">{new Date(session.login_time).toLocaleString()}</td>
                    <td className="px-4 py-3 border-b text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${limitReached ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {session.mindMapsUsed}/{session.mindMapLimit}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${session.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                        ● {session.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b text-center">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                          onClick={() => handleTerminateSession(session.email)}
                          disabled={terminatingEmail === session.email}
                          className={`py-1 px-3 rounded-md text-xs text-white ${terminatingEmail === session.email ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                          {terminatingEmail === session.email ? 'Terminating...' : 'Terminate'}
                        </button>
                        <button
                          onClick={() => handleResetMindMaps(session.email)}
                          disabled={resettingEmail === session.email}
                          className={`py-1 px-3 rounded-md text-xs text-white ${resettingEmail === session.email ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                        >
                          {resettingEmail === session.email ? 'Resetting...' : 'Reset'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cached Maps */}
      <div className="mt-10 p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Cached Mind Maps</h3>
          <button
            onClick={fetchCacheKeys}
            disabled={cacheLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Refresh
          </button>
        </div>
        {cacheError && <p className="text-red-600 text-sm mb-4">{cacheError}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {cachedKeys.map((key, i) => (
            <div key={i} className="p-3 border rounded-md bg-gray-50 flex justify-between items-center">
              <span className="text-sm truncate">{key.topic} ({key.map_type})</span>
              <button
                onClick={() => clearSpecificCache(key)}
                className="ml-2 text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Clear
              </button>
            </div>
          ))}
        </div>
        {cachedKeys.length === 0 && !cacheLoading && (
          <p className="text-gray-500 text-sm mt-3">No cached maps.</p>
        )}
        {cacheLoading && <p className="text-sm text-gray-400 mt-3">Loading cache...</p>}
      </div>
    </div>
  );
};

export default AdminPanel;
