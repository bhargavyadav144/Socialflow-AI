import React, { useState, useEffect, useRef } from 'react';
import { 
  User, ChevronDown, Sparkles, LogOut, Settings, Eye, Globe, MapPin, Phone, Mail, 
  Layers, Link2, ExternalLink, X, ShieldCheck, BrainCircuit, Sun, Moon, Menu
} from 'lucide-react';
import { api } from '../services/api';

// Helper function to render social platform logo badges with official SVG brand logos
const renderSocialPlatformLogo = (platName) => {
  const p = (platName || '').toLowerCase();
  if (p.includes('instagram') || p.includes('ig')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('youtube') || p.includes('yt')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('facebook') || p.includes('fb')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-[#1877F2] flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('linkedin')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('twitter') || p.includes('x')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-slate-900 border border-blue-400/40 flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
    );
  }
  if (p.includes('tiktok')) {
    return (
      <div className="h-7 w-7 rounded-lg bg-slate-950 border border-pink-500/50 flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525 0h3.08c.012 1.348.552 2.658 1.503 3.567.951.908 2.235 1.413 3.567 1.415v3.13c-1.849.002-3.626-.647-5.07-1.837v8.528c0 4.14-3.36 7.5-7.5 7.5S.605 18.943.605 14.803c0-4.14 3.36-7.5 7.5-7.5.344 0 .687.023 1.025.07v3.167c-.341-.103-.695-.156-1.025-.156-2.42 0-4.38 1.96-4.38 4.38s1.96 4.38 4.38 4.38 4.38-1.96 4.38-4.38V0z"/>
        </svg>
      </div>
    );
  }
  return (
    <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
      <Link2 className="h-4 w-4" />
    </div>
  );
};

export default function Header({ activePage, currentUser, onLogout, setActivePage, theme, onToggleTheme, onToggleMobileMenu }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const titles = {
    dashboard: 'Performance Overview',
    agent: 'AI Social Strategist',
    promotions: 'Promotions & Deals',
    connections: 'Connected Channels',
    demo: 'Memory Simulator',
    memory: 'Hindsight Memory',
    content: 'Content Vault',
    analytics: 'Analytics',
    settings: 'Settings & Profile',
    landing: 'SocialFlow AI'
  };

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md px-3.5 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans transition-colors">
        <div className="flex items-center gap-2">
          {/* Mobile Hamburger Drawer Menu Toggle */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title="Open Mobile Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight capitalize font-outfit truncate max-w-[170px] sm:max-w-none">
            {titles[activePage] || 'Dashboard'}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher (Light with Sun & Dark with Moon) */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => onToggleTheme && onToggleTheme('light')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-blue-700 shadow-sm font-bold border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Switch to Light Mode"
            >
              <Sun className={`h-3.5 w-3.5 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="font-outfit text-[11px] sm:text-xs">Light</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleTheme && onToggleTheme('dark')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-800 text-blue-400 shadow-sm font-bold border border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Switch to Dark Mode"
            >
              <Moon className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="font-outfit text-[11px] sm:text-xs">Dark</span>
            </button>
          </div>

          {/* Interactive Hindsight AI Memory Bank Status Indicator */}
          <button
            onClick={() => setActivePage && setActivePage('memory')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-blue-500/30 text-xs transition cursor-pointer group shadow-sm"
            title="Click to view & manage AI Memory Vault (Vectorize Hindsight)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">AI Memory Bank:</span>
            <span className="font-mono text-blue-600 dark:text-blue-300 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-200">
              Vectorize Synced
            </span>
            <Sparkles className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 group-hover:rotate-12 transition" />
          </button>

          {/* Top Right Executive Profile Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 sm:gap-2.5 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-blue-500/30 transition cursor-pointer text-left shadow-sm group"
            >
              {/* Profile Photo / Avatar */}
              {currentUser?.avatar_url ? (
                <img 
                  src={currentUser.avatar_url} 
                  alt={currentUser?.name || 'Creator'} 
                  className="h-8 w-8 rounded-lg object-cover border border-blue-400/50 shadow-sm shrink-0" 
                />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0">
                  {currentUser?.name?.charAt(0) || 'C'}
                </div>
              )}

              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">
                  {currentUser?.name || 'Creator Profile'}
                  <Sparkles className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px] font-mono">
                  {currentUser?.email || 'authenticated'}
                </p>
              </div>

              <ChevronDown className={`h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-blue-500 dark:text-blue-400' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0e131f] border border-slate-200 dark:border-blue-500/30 shadow-2xl py-2 z-50 font-sans space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header Info */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                  {currentUser?.avatar_url ? (
                    <img src={currentUser.avatar_url} alt={currentUser.name} className="h-10 w-10 rounded-xl object-cover border border-blue-400" />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                      {currentUser?.name?.charAt(0) || 'C'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate font-outfit">{currentUser?.name || 'Creator Profile'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">{currentUser?.email}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                      Active Creator
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); setShowProfileModal(true); }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-blue-600/20 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Eye className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); setActivePage && setActivePage('settings'); }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-blue-600/20 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                    <span>Edit Profile & Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); setActivePage && setActivePage('memory'); }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-blue-600/20 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <BrainCircuit className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span>Hindsight Memory Bank</span>
                  </button>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

                  {/* Red Logout Button */}
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); onLogout(); }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2.5 transition cursor-pointer shadow-xs"
                  >
                    <LogOut className="h-4 w-4 text-rose-500 dark:text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── READ-ONLY VIEW PROFILE MODAL ─── */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 font-sans">
          <div className="bg-white dark:bg-[#0b0f17] border border-slate-200 dark:border-blue-500/30 w-full max-w-2xl rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-400/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit">Creator Public Profile</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Read-only view of your active profile & social channels</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {currentUser?.avatar_url ? (
                  <img src={currentUser.avatar_url} alt={currentUser.name} className="h-20 w-20 rounded-2xl object-cover border-2 border-blue-500 shadow-xl shrink-0" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-blue-400 shadow-xl shrink-0">
                    {currentUser?.name?.charAt(0) || 'C'}
                  </div>
                )}

                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">{currentUser?.name || 'Creator'}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-mono font-semibold">
                      Verified Creator
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">📧 {currentUser?.email}</p>
                  
                  {currentUser?.bio && (
                    <p className="text-xs text-slate-700 dark:text-slate-300 pt-1 leading-relaxed italic">
                      "{currentUser.bio}"
                    </p>
                  )}
                </div>
              </div>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs font-sans">
                <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Phone Number</span>
                  <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5 mt-0.5 font-mono truncate">
                    <Phone className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
                    {currentUser?.phone || 'Not provided'}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Gender</span>
                  <span className="text-slate-900 dark:text-white font-semibold mt-0.5 block truncate">
                    {currentUser?.gender || 'Not provided'}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Date of Birth</span>
                  <span className="text-slate-900 dark:text-white font-semibold mt-0.5 block font-mono truncate">
                    {currentUser?.dob
                      ? `${currentUser.dob}`
                      : 'Not provided'}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Location</span>
                  <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5 mt-0.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
                    {currentUser?.location || 'Not provided'}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Website</span>
                  {currentUser?.website ? (
                    <a href={currentUser.website.startsWith('http') ? currentUser.website : `https://${currentUser.website}`} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 mt-0.5 truncate">
                      <Globe className="h-3.5 w-3.5 shrink-0" /> {currentUser.website}
                    </a>
                  ) : (
                    <span className="text-slate-400 mt-0.5 block">Not provided</span>
                  )}
                </div>
              </div>

              {/* Niche Categories Badges */}
              {currentUser?.content_types && currentUser.content_types.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-xs font-bold text-slate-800 dark:text-white font-outfit flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-blue-500 dark:text-blue-400" /> Active Niche Categories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.content_types.map(cat => (
                      <span key={cat} className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs border border-blue-400/40 shadow-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Social Channel URLs & Direct Profile Link Redirection */}
              {currentUser?.platform_urls && Object.keys(currentUser.platform_urls).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  <span className="text-xs font-bold text-slate-800 dark:text-white font-outfit flex items-center gap-1.5">
                    <Link2 className="h-4 w-4 text-blue-500 dark:text-blue-400" /> Connected Social Platform Profiles
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(currentUser.platform_urls).map(([plat, url]) => (
                      url ? (
                        <a 
                          key={plat} 
                          href={url.startsWith('http') ? url : `https://${url}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-3 rounded-xl bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 text-xs flex items-center justify-between transition group shadow-xs"
                          title={`Click to open your official ${plat} profile in a new tab`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            {renderSocialPlatformLogo(plat)}
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 dark:text-white font-outfit block text-xs group-hover:text-blue-600 dark:group-hover:text-blue-300 transition truncate">
                                {plat}
                              </span>
                              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono truncate block max-w-[170px]">
                                {url}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition shrink-0 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-500/20">
                            <span>Visit</span>
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        </a>
                      ) : null
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 cursor-pointer transition"
              >
                Close Preview
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  setActivePage && setActivePage('settings');
                }}
                className="px-5 py-2.5 rounded-xl brand-gradient-btn text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Settings className="h-4 w-4" />
                <span>Edit Profile & Settings &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
