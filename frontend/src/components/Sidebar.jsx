import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  BrainCircuit, 
  FolderKanban, 
  BarChart3, 
  Sparkles, 
  Home, 
  Link2,
  Settings,
  Megaphone,
  X
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agent', label: 'AI Strategist', icon: Bot, badge: 'Live Agent' },
    { id: 'promotions', label: 'Promotions', icon: Megaphone, badge: 'Deals' },
    { id: 'connections', label: 'Social Channels', icon: Link2, badge: 'API Sync' },
    { id: 'demo', label: 'Memory Simulator', icon: Sparkles, badge: 'Lab' },
    { id: 'memory', label: 'Hindsight Memory Vault', icon: BrainCircuit },
    { id: 'content', label: 'Content Vault', icon: FolderKanban },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Profile', icon: Settings },
    { id: 'landing', label: 'Overview', icon: Home }
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full font-sans">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-900 border border-blue-500/30 p-1 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/10">
              <img src="/logo.png" alt="SocialFlow AI Logo" className="h-full w-full object-contain rounded-lg drop-shadow-md" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-tight leading-none font-outfit">
                SocialFlow <span className="blue-gradient-text">AI</span>
              </h1>
              <p className="text-[10px] text-blue-400 font-sans tracking-wide mt-1 flex items-center gap-1.5 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Memory & Strategy OS
              </p>
            </div>
          </div>

          {/* Close Mobile Drawer Button */}
          {setIsMobileOpen && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-transparent text-white border-l-2 border-blue-500 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="tracking-wide">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wide ${
                    item.id === 'connections'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : item.id === 'demo' 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Vectorize Hindsight Engine
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Continuous memory recall & strategy optimizer active.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0b0f17] border-r border-slate-800/80 flex-col justify-between shrink-0 h-screen sticky top-0 font-sans z-30">
        {navContent}
      </aside>

      {/* Mobile Overlay Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
            onClick={() => setIsMobileOpen(false)}
          ></div>
          <div className="relative w-4/5 max-w-xs bg-[#0b0f17] border-r border-slate-800 h-full shadow-2xl z-50">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
