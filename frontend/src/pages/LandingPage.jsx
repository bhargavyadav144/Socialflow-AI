import React from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Database, 
  CheckCircle, 
  Layers,
  ShieldCheck,
  Bot
} from 'lucide-react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';

export default function LandingPage({ setActivePage }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-lg shadow-purple-900/20">
          <BrainCircuit className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span>Powered by Vectorize Hindsight Agent Memory</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-outfit leading-tight max-w-4xl mx-auto">
          Your Social Media Strategy That <span className="purple-gradient-text">Remembers</span>.
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An AI strategist that learns from your content history, audience behavior, and past decisions—delivering continuous strategic improvements instead of generic advice.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setActivePage('agent')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 text-sm"
          >
            <Bot className="h-4 w-4" />
            Try the AI Strategist
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setActivePage('demo')}
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-purple-500/30 shadow-lg transition-all flex items-center gap-2 text-sm"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            See Memory Demo (Before vs After)
          </button>
        </div>
      </div>

      {/* Before vs After Memory Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              WITHOUT MEMORY
            </span>
            <span className="text-xs text-rose-400 font-semibold">Generic Chatbot</span>
          </div>
          <h3 className="text-xl font-bold text-slate-200 font-outfit">Standard LLM Advice</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            "Create a reel about top 5 tips to grow your social media account today. Use popular hashtags and post consistently."
          </p>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-500 font-mono">
            Problem: Ignores past performance, content type success, and audience interests.
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-purple-500/40 bg-purple-950/20 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              WITH HINDSIGHT MEMORY
            </span>
            <span className="text-xs text-emerald-400 font-semibold">SocialFlow AI</span>
          </div>
          <h3 className="text-xl font-bold text-white font-outfit">Personalized Strategy Agent</h3>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            "Your previous short-form Python debugging reel reached 72k views with 9.4% engagement, whereas generic promotional posts averaged under 1.8%. Based on your college student audience feedback, create a 35-second Python debugging breakdown."
          </p>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-purple-500/30 text-xs text-purple-300 font-mono flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>Recalled 4 memories: audience persona, Python metrics, format performance & past feedback.</span>
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-xl glass-panel border border-slate-800 space-y-2">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-white font-outfit">Persistent Agent Memory</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hindsight retains audience preferences, past post performance, and strategic feedback across chat sessions.
          </p>
        </div>

        <div className="p-5 rounded-xl glass-panel border border-slate-800 space-y-2">
          <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-white font-outfit">Pattern Recognition</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatically calculates engagement rates and compares high-performing vs low-performing content topics.
          </p>
        </div>

        <div className="p-5 rounded-xl glass-panel border border-slate-800 space-y-2">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <Sparkles className="h-5 w-5" />
          </div>
          <h4 className="font-bold text-white font-outfit">Hackathon-Ready Demo</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Includes a dedicated Memory Demo tab comparing side-by-side responses before and after Hindsight memory injection.
          </p>
        </div>
      </div>
    </div>
  );
}
