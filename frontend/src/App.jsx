import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Bot, Link2, BrainCircuit, Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FloatingChatbot from './components/FloatingChatbot';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AIStrategistPage from './pages/AIStrategistPage';
import MemoryDemoPage from './pages/MemoryDemoPage';
import MemoryPage from './pages/MemoryPage';
import ContentPage from './pages/ContentPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ConnectionsPage from './pages/ConnectionsPage';
import SettingsPage from './pages/SettingsPage';
import PromotionsPage from './pages/PromotionsPage';
import LandingPage from './pages/LandingPage';
import { api } from './services/api';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('socialflow_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    const selected = newTheme || (theme === 'light' ? 'dark' : 'light');
    setTheme(selected);
    try {
      localStorage.setItem('socialflow_theme', selected);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };
  // 'home' | 'login' | 'signup' | 'app'
  const [appView, setAppView] = useState(() => {
    try {
      const saved = localStorage.getItem('socialflow_user');
      if (saved) return 'app';
      return 'home';
    } catch { return 'home'; }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('socialflow_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // Auto-sync full user profile and avatar from backend database
  useEffect(() => {
    if (currentUser?.id) {
      api.getProfile(currentUser.id)
        .then(profile => {
          if (profile && profile.user_id) {
            const freshUser = {
              id: profile.user_id,
              name: profile.name,
              email: profile.email,
              phone: profile.phone || '',
              gender: profile.gender || '',
              dob: profile.dob || '',
              bio: profile.bio || '',
              website: profile.website || '',
              location: profile.location || '',
              avatar_url: profile.avatar_url || '',
              niche: profile.niche || 'General Creator',
              target_audience: profile.target_audience || 'Social Audience',
              brand_voice: profile.brand_voice || 'Authentic, engaging',
              content_goals: profile.content_goals || 'Grow reach',
              content_types: profile.content_types || [],
              connected_platforms: profile.connected_platforms || [],
              platform_urls: profile.platform_urls || {},
              profile_complete: profile.profile_complete ?? true,
              logo_url: profile.logo_url || null
            };
            setCurrentUser(freshUser);
            localStorage.setItem('socialflow_user', JSON.stringify(freshUser));
          }
        })
        .catch(err => {
          console.warn('Silent profile sync warning:', err);
        });
    }
  }, [currentUser?.id]);

  const saveUser = (userData) => {
    const user = {
      id: userData.user_id || userData.id,
      name: userData.name || 'Creator',
      email: userData.email,
      phone: userData.phone || '',
      gender: userData.gender || '',
      dob: userData.dob || '',
      bio: userData.bio || '',
      website: userData.website || '',
      location: userData.location || '',
      avatar_url: userData.avatar_url || '',
      niche: userData.niche || 'General Creator',
      target_audience: userData.target_audience || 'Social Audience',
      brand_voice: userData.brand_voice || 'Authentic, engaging',
      content_goals: userData.content_goals || 'Grow reach',
      content_types: userData.content_types || [],
      connected_platforms: userData.connected_platforms || [],
      platform_urls: userData.platform_urls || {},
      profile_complete: true,
      logo_url: userData.logo_url || null
    };
    setCurrentUser(user);
    localStorage.setItem('socialflow_user', JSON.stringify(user));
    return user;
  };

  const handleAuthSuccess = (res) => {
    saveUser(res);
    setAppView('app');
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('socialflow_user');
    setAppView('home');
  };

  const handleNavigate = (target) => {
    if (target === 'login') setAppView('login');
    else if (target === 'signup') setAppView('signup');
    else if (target === 'home') setAppView('home');
    else if (target === 'dashboard') {
      if (currentUser) {
        setAppView('app');
        setActivePage('dashboard');
      } else {
        setAppView('login');
      }
    }
  };

  // ─── PUBLIC HOME PAGE ───
  if (appView === 'home') {
    return <HomePage currentUser={currentUser} onNavigate={handleNavigate} />;
  }

  // ─── LOGIN PAGE ───
  if (appView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleAuthSuccess}
        switchToSignup={() => setAppView('signup')}
        switchToHome={() => setAppView('home')}
      />
    );
  }

  // ─── SIGNUP PAGE ───
  if (appView === 'signup') {
    return (
      <SignupPage
        onSignupSuccess={handleAuthSuccess}
        switchToLogin={() => setAppView('login')}
        switchToHome={() => setAppView('home')}
      />
    );
  }

  // ─── MAIN APP (authenticated) ───
  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} />;
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} currentUser={currentUser} />;
      case 'agent':
        return <AIStrategistPage currentUser={currentUser} />;
      case 'promotions':
        return <PromotionsPage currentUser={currentUser} />;
      case 'connections':
        return <ConnectionsPage currentUser={currentUser} />;
      case 'demo':
        return <MemoryDemoPage currentUser={currentUser} />;
      case 'memory':
        return <MemoryPage currentUser={currentUser} />;
      case 'content':
        return <ContentPage currentUser={currentUser} />;
      case 'analytics':
        return <AnalyticsPage currentUser={currentUser} />;
      case 'settings':
        return <SettingsPage currentUser={currentUser} setCurrentUser={setCurrentUser} setActivePage={setActivePage} />;
      default:
        return <DashboardPage setActivePage={setActivePage} currentUser={currentUser} />;
    }
  };

  return (
    <div className={`flex min-h-screen font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300 pb-16 md:pb-0 ${
      theme === 'light' ? 'light-theme bg-slate-50 text-slate-900' : 'dark dark-theme bg-[#0b0f17] text-slate-100'
    }`}>
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header 
          activePage={activePage} 
          currentUser={currentUser} 
          onLogout={handleLogout} 
          setActivePage={setActivePage}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        />
        <main className="flex-1 flex flex-col relative">
          {renderPage()}
        </main>
      </div>

      {/* ─── MOBILE STICKY BOTTOM NAVIGATION BAR ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#0e131f]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-1 shadow-md">
        {[
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'agent', label: 'AI Strategist', icon: Bot },
          { id: 'connections', label: 'Channels', icon: Link2 },
          { id: 'memory', label: 'Memory', icon: BrainCircuit },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Floating AI Copilot Chatbot with direct redirect to AI Strategist */}
      <FloatingChatbot currentUser={currentUser} setActivePage={setActivePage} activePage={activePage} />
    </div>
  );
}
