import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { searchDiseases } from '../data/diseases';

const NAV_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'diseases', label: 'Diseases' },
  { key: 'ai-assistant', label: 'AI Assistant' },
  { key: 'about', label: 'About' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'contact', label: 'Contact' },
];

export default function Navbar({ onNavigate, currentPage }) {
  const { user, role, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchBoxRef = useRef(null);

  const results = query.trim() ? searchDiseases(query).slice(0, 5) : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const goToDisease = (id) => {
    setQuery('');
    setSearchFocused(false);
    setMobileOpen(false);
    onNavigate('disease-details', { diseaseId: id });
  };

  const navigate = (page, params) => {
    setMobileOpen(false);
    onNavigate(page, params);
  };

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          {/* Logo & Brand */}
          <div onClick={() => navigate('home')} className="flex items-center gap-2.5 cursor-pointer group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              🫀
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900 tracking-tight">EarlyCare</span>
                <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2 py-0.5 rounded-full border border-sky-200">AI</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  currentPage === item.key ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search + Auth (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <div ref={searchBoxRef} className="relative">
              <input
                type="text"
                value={query}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search diseases..."
                className="w-48 lg:w-56 pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>

              {searchFocused && query.trim() && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                  {results.length > 0 ? (
                    results.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => goToDisease(d.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors"
                      >
                        <span className="text-xl">{d.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{d.name}</p>
                          <p className="text-xs text-slate-500">{d.tagline}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500">No diseases match "{query}"</p>
                  )}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`${role}-dashboard`)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-sky-700 rounded-lg transition-colors"
                >
                  {user?.name || 'Portal'}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('welcome')}
                className="px-4 py-2 text-sm font-semibold text-sky-700 border border-sky-200 hover:bg-sky-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600"
            aria-label="Toggle menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 space-y-3 border-t border-slate-100 pt-3">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search diseases..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              {query.trim() && (
                <div className="mt-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {results.length > 0 ? (
                    results.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => goToDisease(d.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left"
                      >
                        <span className="text-xl">{d.icon}</span>
                        <span className="text-sm font-bold text-slate-800">{d.name}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-3 text-sm text-slate-500">No diseases match "{query}"</p>
                  )}
                </div>
              )}
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`px-3.5 py-2.5 text-sm font-semibold rounded-lg text-left transition-colors ${
                    currentPage === item.key ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="pt-2 border-t border-slate-100">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <button onClick={() => navigate(`${role}-dashboard`)} className="text-sm font-bold text-slate-700">
                    {user?.name || 'Portal'} Dashboard
                  </button>
                  <button onClick={handleLogout} className="text-sm font-semibold text-rose-600">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('welcome')}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-sky-700 border border-sky-200 rounded-lg"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
