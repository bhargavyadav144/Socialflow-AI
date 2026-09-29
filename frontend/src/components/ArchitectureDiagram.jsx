import React from 'react';
import { Database, BrainCircuit, Bot, Sparkles, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

export default function ArchitectureDiagram() {
  const steps = [
    { title: "1. Brand & Post Data", desc: "User posts, metrics & preferences", icon: Database, color: "from-blue-500 to-indigo-600" },
    { title: "2. SocialFlow Agent", desc: "FastAPI + Groq / OpenAI LLM", icon: Bot, color: "from-purple-500 to-violet-600" },
    { title: "3. Hindsight Memory", desc: "Retain & Recall (Vectorize)", icon: BrainCircuit, color: "from-cyan-500 to-teal-500" },
    { title: "4. Pattern Analysis", desc: "Analyze historical performance", icon: Layers, color: "from-amber-500 to-orange-500" },
    { title: "5. Smart Strategy", desc: "Personalized recommendations", icon: Sparkles, color: "from-emerald-500 to-green-600" },
  ];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-purple-500/20 my-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-purple-400" />
            SocialFlow AI Architecture & Hindsight Flow
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Biomimetic agent memory architecture integrating Vectorize Hindsight with PostgreSQL structured data.
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Official Vectorize Specification
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative group">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all h-full flex flex-col justify-between">
                <div>
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-tr ${step.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-outfit mb-1">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-purple-400/60">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span><strong className="text-purple-300">PostgreSQL</strong> stores structured application tables; <strong className="text-cyan-300">Hindsight</strong> stores agent memory banks.</span>
        </div>
        <a 
          href="https://hindsight.vectorize.io/" 
          target="_blank" 
          rel="noreferrer"
          className="text-purple-400 hover:text-purple-300 underline font-mono flex items-center gap-1"
        >
          Hindsight Documentation &rarr;
        </a>
      </div>
    </div>
  );
}
