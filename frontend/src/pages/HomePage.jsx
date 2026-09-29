import React, { useState } from 'react';
import { 
  BrainCircuit, Sparkles, ArrowRight, Zap, TrendingUp, 
  Database, CheckCircle, ShieldCheck, Bot, Eye, Heart,
  BarChart3, MessageSquare, FileText, Lock, ChevronRight,
  Instagram, Youtube, Facebook, Twitter, Layers, Users,
  Menu, X, Award, Megaphone, DollarSign, CheckCircle2,
  Tv, Compass, HelpCircle, Activity, Globe, Play, Sparkle
} from 'lucide-react';
import TermsModal from '../components/TermsModal';

export default function HomePage({ currentUser, onNavigate }) {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [interactiveMockupTab, setInteractiveMockupTab] = useState('dashboard');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About Us' },
    { id: 'terms', label: 'Terms & Conditions' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col justify-between antialiased">
      {/* ─── TOP NAVIGATION BAR ─── */}
      <nav className="sticky top-0 z-50 bg-[#0b0f17]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo with High-Visibility Container */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-900 border border-blue-500/40 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10 group-hover:border-blue-400 transition">
              <img src="/logo.png" alt="SocialFlow AI Logo" className="h-full w-full object-contain rounded-lg drop-shadow-md" />
            </div>
            <div>
              <span className="font-extrabold text-lg font-outfit tracking-tight text-white">SocialFlow <span className="blue-gradient-text">AI</span></span>
              <p className="text-[10px] text-blue-400 font-sans tracking-wide hidden sm:block font-medium">Memory & Strategy OS</p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User CTA / Auth Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-blue-500/30">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {currentUser.name?.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{currentUser.name}</span>
                </div>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-4 py-2 rounded-xl brand-gradient-btn text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  Go to Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold border border-slate-700 text-slate-200 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 rounded-xl brand-gradient-btn text-xs font-bold cursor-pointer"
                >
                  Sign Up Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  activeTab === item.id ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              {currentUser ? (
                <button
                  onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onNavigate('signup'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    Sign Up Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ─── TAB CONTENT VIEWS ─── */}
      <main className="flex-1">
        {/* 1. HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-20 pb-16">
            {/* Hero Banner */}
            <section className="pt-14 pb-8 px-4 sm:px-6 relative overflow-hidden">
              <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-md">
                  <BrainCircuit className="h-4 w-4 text-blue-400 animate-pulse" />
                  Vectorize Hindsight Persistent Agent Memory Engine
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-outfit leading-tight text-white max-w-4xl mx-auto">
                  The Social Media Operating System That{' '}
                  <span className="blue-gradient-text">Remembers</span>.
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Transform audience telemetry into predictable channel growth. SocialFlow AI remembers every post, metric, hook, and brand sponsorship across all 10+ social platforms.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => onNavigate('signup')}
                    className="px-7 py-3.5 rounded-2xl brand-gradient-btn font-bold text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" /> Start Free Workspace <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('how-it-works')}
                    className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-700/80 transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                  >
                    <Eye className="h-4 w-4 text-blue-400" /> Explore How It Works
                  </button>
                </div>

                {/* ─── REALISTIC INTERACTIVE PRODUCT APPLICATION SHOWCASE ─── */}
                <div className="pt-10 max-w-5xl mx-auto text-left">
                  <div className="rounded-2xl glass-panel border border-slate-800/90 bg-[#0f141d] shadow-2xl overflow-hidden">
                    {/* App Window Header Bar */}
                    <div className="px-5 py-3 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                          <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                          <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 font-outfit ml-2 flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-blue-400" /> SocialFlow AI Command Center v1.0
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Telemetry Active
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-semibold hidden sm:inline-block">
                          Hindsight Bank Synced
                        </span>
                      </div>
                    </div>

                    {/* Interactive Showcase Tabs */}
                    <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
                      {[
                        { id: 'dashboard', label: '📊 Live Dashboard & Analytics', icon: BarChart3 },
                        { id: 'script', label: '📝 AI Video Script Generator', icon: FileText },
                        { id: 'promotions', label: '⚡ Sponsorship & Brand Deals', icon: Megaphone },
                        { id: 'memory', label: '🧠 Vectorize Hindsight Vault', icon: BrainCircuit },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setInteractiveMockupTab(tab.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                            interactiveMockupTab === tab.id
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Showcase Content Panel */}
                    <div className="p-6 space-y-5 bg-[#0f141d]">
                      {interactiveMockupTab === 'dashboard' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-sans">
                            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                              <span className="text-[11px] text-slate-400 font-semibold block">Total Channel Views</span>
                              <p className="text-xl font-extrabold text-white mt-1">1,482,900</p>
                              <span className="text-[11px] text-emerald-400 font-semibold">↑ +24.5% vs target</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                              <span className="text-[11px] text-slate-400 font-semibold block">Avg Engagement Rate</span>
                              <p className="text-xl font-extrabold text-blue-300 mt-1">8.94%</p>
                              <span className="text-[11px] text-blue-400 font-semibold">4.2x industry avg</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                              <span className="text-[11px] text-slate-400 font-semibold block">Sponsorship Revenue</span>
                              <p className="text-xl font-extrabold text-amber-300 mt-1">$4,850.00</p>
                              <span className="text-[11px] text-amber-400 font-semibold">4 active brand deals</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                              <span className="text-[11px] text-slate-400 font-semibold block">Connected Accounts</span>
                              <p className="text-xl font-extrabold text-cyan-300 mt-1">6 Platforms</p>
                              <span className="text-[11px] text-cyan-400 font-semibold">YouTube, IG, TikTok, X</span>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white font-outfit">Top Content Performance Telemetry</span>
                              <span className="text-slate-400 text-[11px]">Updated 5 mins ago</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                              <div className="p-3 rounded-lg bg-slate-950 border border-blue-500/20 space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-blue-300 font-semibold">YouTube • Video</span>
                                  <span className="text-emerald-400 font-bold">12.4% Eng</span>
                                </div>
                                <h4 className="text-xs font-bold text-white line-clamp-1">5 Python Mistakes Beginners Make</h4>
                                <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                                  <span>👁️ 84,200 views</span>
                                  <span>💾 4,100 saves</span>
                                </div>
                              </div>

                              <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/20 space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-amber-300 font-semibold">⚡ Brand Deal • NordVPN</span>
                                  <span className="text-emerald-400 font-bold">$1,500 Deal</span>
                                </div>
                                <h4 className="text-xs font-bold text-white line-clamp-1">NordVPN Sponsored Security Breakdown</h4>
                                <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                                  <span>👁️ 62,000 views</span>
                                  <span>💬 420 comments</span>
                                </div>
                              </div>

                              <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/20 space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-cyan-300 font-semibold">Instagram • Reel</span>
                                  <span className="text-emerald-400 font-bold">9.8% Eng</span>
                                </div>
                                <h4 className="text-xs font-bold text-white line-clamp-1">AI Productivity Stack for 2026</h4>
                                <div className="text-[11px] text-slate-400 flex justify-between pt-1">
                                  <span>👁️ 112,000 views</span>
                                  <span>💾 8,900 saves</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {interactiveMockupTab === 'script' && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-blue-300 font-outfit flex items-center gap-1.5">
                                <Bot className="h-4 w-4 text-blue-400" /> AI Script Generator — High Retention Short
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                                Target: 35 Seconds
                              </span>
                            </div>

                            <div className="space-y-2 text-xs text-slate-200">
                              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                                <span className="text-[11px] text-cyan-400 font-bold uppercase block mb-1">0-5s Hook Pattern (Learned from Hindsight)</span>
                                <p className="text-white font-medium">"Stop scrolling! If you are still writing Python code like this, you are wasting 3 hours every week..."</p>
                              </div>

                              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                                <span className="text-[11px] text-blue-400 font-bold uppercase block mb-1">5-25s Value Breakdown</span>
                                <p className="text-slate-300">"Instead of nested loops, use list comprehensions. Here is the side-by-side speed test..."</p>
                              </div>

                              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                                <span className="text-[11px] text-emerald-400 font-bold uppercase block mb-1">25-35s High-Converting CTA</span>
                                <p className="text-slate-300">"Save this reel right now and drop 'CODE' in the comments for the full snippet!"</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {interactiveMockupTab === 'promotions' && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-300 font-outfit flex items-center gap-1.5">
                                <Megaphone className="h-4 w-4 text-amber-400" /> Promotional Campaign & Deal Tracker
                              </span>
                              <span className="text-[11px] font-bold text-emerald-400">Total Revenue: $4,850.00</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                                <div className="flex justify-between text-xs font-bold text-white">
                                  <span>⚡ Brand: NordVPN</span>
                                  <span className="text-emerald-400">$1,500</span>
                                </div>
                                <p className="text-[11px] text-slate-400">YouTube Sponsored Video • 62,000 views • 8.9% Eng</p>
                              </div>
                              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                                <div className="flex justify-between text-xs font-bold text-white">
                                  <span>⚡ Brand: Notion</span>
                                  <span className="text-emerald-400">$2,000</span>
                                </div>
                                <p className="text-[11px] text-slate-400">Instagram Reel Integration • 110,000 views • 10.2% Eng</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {interactiveMockupTab === 'memory' && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-cyan-300 font-outfit flex items-center gap-1.5">
                                <BrainCircuit className="h-4 w-4 text-cyan-400" /> Vectorize Hindsight Persistent Memory Vault
                              </span>
                              <span className="text-[11px] font-mono text-cyan-400">Bank: socialflow_user_1</span>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                                <div>
                                  <span className="text-[10px] text-blue-400 font-bold block">CATEGORY: AUDIENCE_PERSONA</span>
                                  <p className="text-slate-200">"Target audience consists of CS college students interested in Python and AI tools."</p>
                                </div>
                                <span className="text-[10px] text-emerald-400 font-mono">Retained</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                                <div>
                                  <span className="text-[10px] text-cyan-400 font-bold block">CATEGORY: HOOK_PERFORMANCE</span>
                                  <p className="text-slate-200">"Debugging reels under 40s reach 3.5x higher completion rate than general vlogs."</p>
                                </div>
                                <span className="text-[10px] text-emerald-400 font-mono">Retained</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Feature Grid */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl glass-card space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-outfit">Real Engagements & Likes</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Track real views, likes, shares, and comments across YouTube, Instagram, TikTok, LinkedIn, and X without generic dummy numbers.
                  </p>
                </div>

                <div className="p-6 rounded-2xl glass-card space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-outfit">Promotions & Sponsorships</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tag sponsored videos and brand deals. Keep promotional ROI separated and analyzed by AI memory.
                  </p>
                </div>

                <div className="p-6 rounded-2xl glass-card space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <BrainCircuit className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-outfit">Vectorize Hindsight Memory</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Persistent agent memory retains brand tone, audience interests, and hook performance across every chat conversation.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. FEATURES TAB */}
        {activeTab === 'features' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold font-outfit">
                Platform <span className="blue-gradient-text">Features</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Built specifically for creators, strategists, and marketing teams needing realistic, memory-informed analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: BarChart3, title: 'Real Metrics Telemetry', desc: 'Sync real views, likes, comments, and shares across your connected accounts.', color: 'from-blue-600 to-indigo-600' },
                { icon: Megaphone, title: 'Brand Deal & Promo Hub', desc: 'Isolate promotional videos, track sponsorship value, and measure brand ROI.', color: 'from-amber-500 to-orange-500' },
                { icon: FileText, title: 'AI Video Script Creator', desc: 'Generate complete 30s-60s video scripts tailored to your top-performing topics.', color: 'from-indigo-600 to-cyan-600' },
                { icon: BrainCircuit, title: 'Hindsight Memory Bank', desc: 'Vectorize memory retains audience feedback and video performance over time.', color: 'from-cyan-500 to-emerald-500' },
                { icon: ShieldCheck, title: 'Email OTP & Isolated Auth', desc: 'Secure login flow with 6-digit email verification and safe password reset.', color: 'from-emerald-500 to-teal-500' },
                { icon: Layers, title: '20+ Creator Categories', desc: 'Tailored onboarding for Tech, Vlogs, AI, Fitness, Gaming, Finance, and podcasts.', color: 'from-rose-500 to-pink-500' },
              ].map((f, idx) => (
                <div key={idx} className="p-6 rounded-2xl glass-card space-y-3">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-md`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-outfit">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. HOW IT WORKS TAB */}
        {activeTab === 'how-it-works' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold font-outfit">
                How <span className="blue-gradient-text">SocialFlow AI</span> Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Clear, transparent, step-by-step workflow powering memory-aware content growth.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { 
                  step: '01', 
                  title: 'Verified Creator Onboarding', 
                  desc: 'Sign up with email OTP verification. Select up to 5 content categories (e.g. Tech, Vlogs, AI) and up to 10 connected social platforms.',
                  previewTitle: 'Authentication & Profile Setup Interface',
                  previewTag: 'OTP Email Verification Active'
                },
                { 
                  step: '02', 
                  title: 'Real Telemetry & Sponsorship Tracking', 
                  desc: 'Log organic videos or sponsored brand deals. Real metrics (views, likes, comments) auto-calculate true engagement rates.',
                  previewTitle: 'Promotional Revenue & Deal Hub UI',
                  previewTag: 'Sponsorship Value & ROI Metrics'
                },
                { 
                  step: '03', 
                  title: 'Vectorize Hindsight Memory Retention', 
                  desc: 'The backend stores performance telemetry in isolated Vectorize Hindsight memory banks unique to your account.',
                  previewTitle: 'Isolated Agent Memory Bank Vault',
                  previewTag: 'Bank Namespace: socialflow_user_{id}'
                },
                { 
                  step: '04', 
                  title: 'AI Strategy & Script Generation', 
                  desc: 'Consult your AI Strategist. It recalls what worked best for your audience and provides complete video scripts with high-retention hooks.',
                  previewTitle: 'Memory-Aware Chat Agent & Script Output',
                  previewTag: 'High-Retention Short Generator'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-6 sm:p-8 rounded-2xl glass-card space-y-5 bg-[#0f141d]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-mono font-extrabold text-white text-sm shrink-0 shadow-md">
                        {item.step}
                      </div>
                      <h3 className="text-lg font-bold text-white font-outfit">{item.title}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-semibold">
                      {item.previewTag}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{item.desc}</p>

                  {/* VISUAL UI MOCKUP PHOTO CARD FOR STEP */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="text-[11px] font-bold text-blue-400 font-outfit flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5" /> {item.previewTitle}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">● Verified Workflow</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-sans space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">Workflow Execution:</span>
                        <span className="text-blue-300 font-semibold font-mono">Step {item.step} Complete</span>
                      </div>
                      <p className="text-slate-200">
                        {idx === 0 && "User verified email via 6-digit OTP → Selected categories [Tech, Vlogs, AI] → Connected [YouTube, Instagram, TikTok] → Profile marked 100% complete."}
                        {idx === 1 && "Post 'NordVPN Sponsored Security Breakdown' logged with 62,000 views and $1,500 sponsorship revenue → Real engagement rate calculated at 8.9%."}
                        {idx === 2 && "Performance fact stored in Hindsight Bank 'socialflow_user_1': 'Short-form Python debugging video generated 3.2x retention'."}
                        {idx === 3 && "AI Agent generated 35s video script with 0-5s retention hook: 'Stop writing Python code like this!' → Saved to Content Vault."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold font-outfit">
                About <span className="blue-gradient-text">SocialFlow AI</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Building the next generation of memory-infused creator operating systems.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-card space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
              <p className="text-sm font-semibold text-white">
                SocialFlow AI solves the fundamental problem of traditional AI content tools: lack of persistent memory.
              </p>
              <p>
                Standard AI chatbots treat every prompt independently, forgetting past post metrics, brand voice, and hook performance. SocialFlow AI integrates <strong className="text-blue-400">Vectorize Hindsight</strong> to retain a continuous memory bank of your audience preferences, top content hooks, and sponsorship results.
              </p>
              <p>
                Whether you produce tech tutorials, lifestyle vlogs, gaming streams, or financial breakdowns, SocialFlow AI tracks your actual metrics and guides your weekly strategy with data-backed precision.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 font-sans">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-white text-sm mb-1">Our Mission</h4>
                  <p className="text-slate-400">To empower creators with persistent, intelligent AI memory that turns social telemetry into predictable growth.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="font-bold text-white text-sm mb-1">Architecture</h4>
                  <p className="text-slate-400">FastAPI backend + React Vite UI + PostgreSQL / SQLite DB + Vectorize Hindsight persistent memory banks.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. ENTERPRISE TERMS & CONDITIONS TAB */}
        {activeTab === 'terms' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold font-outfit">
                Terms of <span className="blue-gradient-text">Service & Privacy Policy</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Official Master Service Agreement & Enterprise Data Protection Standards.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-card space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-400" /> 1. Master Service Agreement & Registration
                </h3>
                <p>
                  By creating an account on SocialFlow AI, you warrant that all information provided (email, full name, platform selections) is accurate and authorized. Registration requires 6-digit email OTP verification to initialize user workspace access.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
                  <Lock className="h-4 w-4 text-cyan-400" /> 2. Vectorize Hindsight Memory Isolation & Security
                </h3>
                <p>
                  Your social media telemetry, post metrics, and audience preferences are stored in isolated memory bank namespaces (`socialflow_user_{'{id}'}`). Your data is never sold, publicly exposed, or used for training third-party global models.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400" /> 3. Promotional Content & Brand Deal Data
                </h3>
                <p>
                  Sponsorship amounts and brand deal tracking logged in the Promotions hub are maintained strictly for your private analytics to calculate deal ROI and audience retention.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> 4. Intellectual Property & Script Rights
                </h3>
                <p>
                  You retain 100% ownership of all post captions, video scripts, hooks, and ideas generated by SocialFlow AI. You are free to modify, record, publish, or monetize scripts across any social platform.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-400" /> 5. Account Termination & Memory Deletion
                </h3>
                <p>
                  You may delete your account or clear your persistent memory bank at any time from your account settings. Deleting your workspace immediately purges all associated memory records.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Footer Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 border border-blue-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
              <img src="/logo.png" alt="SocialFlow AI Logo" className="h-full w-full object-contain rounded-lg drop-shadow-md" />
            </div>
            <div>
              <span className="font-extrabold text-sm font-outfit text-white">SocialFlow <span className="blue-gradient-text">AI</span></span>
              <p className="text-[11px] text-slate-500">Persistent Agent Memory Operating System</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className="hover:text-white transition cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => setShowTermsModal(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold underline cursor-pointer"
            >
              Legal Modal
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <Instagram className="h-4 w-4 hover:text-pink-400 cursor-pointer transition" />
            <Youtube className="h-4 w-4 hover:text-red-400 cursor-pointer transition" />
            <Twitter className="h-4 w-4 hover:text-cyan-400 cursor-pointer transition" />
            <Facebook className="h-4 w-4 hover:text-blue-500 cursor-pointer transition" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-900 text-center text-[11px] text-slate-500 font-sans">
          © 2026 SocialFlow AI. Powered by Vectorize Hindsight Engine. All rights reserved.
        </div>
      </footer>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
}
