import React, { useState } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  ArrowRight, 
  Check, 
  Bot, 
  Zap, 
  Plus, 
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import MemoryBadge from '../components/MemoryBadge';
import { api } from '../services/api';

export default function MemoryDemoPage() {
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState("What should I post next?");
  const [beforeResponse, setBeforeResponse] = useState(null);
  const [afterResponse, setAfterResponse] = useState(null);
  const [loadingBefore, setLoadingBefore] = useState(false);
  const [loadingAfter, setLoadingAfter] = useState(false);
  const [addingFact, setAddingFact] = useState(false);

  const [demoFacts, setDemoFacts] = useState([
    { category: 'audience', content: 'My audience is mostly college computer science students.', stored: true },
    { category: 'user_profile', content: 'I create short hands-on coding and Python video content.', stored: true },
    { category: 'performance', content: 'My previous short Python reel reached 72,000 views.', stored: true },
    { category: 'performance', content: 'Generic promotional posts got under 2% engagement.', stored: true },
  ]);

  const [newFact, setNewFact] = useState('');

  const runStep1 = async () => {
    setLoadingBefore(true);
    try {
      const data = await api.sendChat(question, true);
      setBeforeResponse(data.response);
      setStep(2);
    } catch (err) {
      alert("Error calling backend: " + err.message);
    } finally {
      setLoadingBefore(false);
    }
  };

  const handleAddFact = async () => {
    if (!newFact.trim()) return;
    setAddingFact(true);
    try {
      await api.addMemory({
        category: 'user_profile',
        content: newFact
      });
      setDemoFacts(prev => [...prev, { category: 'user_profile', content: newFact, stored: true }]);
      setNewFact('');
    } catch (err) {
      alert("Failed to store memory: " + err.message);
    } finally {
      setAddingFact(false);
    }
  };

  const runStep3 = async () => {
    setLoadingAfter(true);
    try {
      const data = await api.sendChat(question, false);
      setAfterResponse(data);
      setStep(4);
    } catch (err) {
      alert("Error calling backend: " + err.message);
    } finally {
      setLoadingAfter(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6 font-sans">
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-purple-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-purple-950/30 border border-emerald-200 dark:border-emerald-500/30 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2 border border-emerald-200 dark:border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Intelligence Simulator & Comparison Lab
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-outfit">
              Hindsight Agent Memory: Before vs After
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Compare strategic AI recommendations generated with and without Hindsight long-term memory context.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-purple-700 dark:text-purple-300 bg-white/80 dark:bg-slate-900/80 p-2 sm:p-2.5 rounded-xl border border-purple-200 dark:border-purple-500/30 w-fit">
            <BrainCircuit className="h-4 w-4 text-purple-600 dark:text-cyan-400 animate-pulse" />
            <span>Vectorize Hindsight Engine Active</span>
          </div>
        </div>
      </div>

      {/* Stepper Guide */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { num: 1, label: "Ask Question (No Memory)" },
          { num: 2, label: "Inspect Brand Facts" },
          { num: 3, label: "Sync Hindsight Bank" },
          { num: 4, label: "Ask Again (With Hindsight)" }
        ].map((s) => (
          <div 
            key={s.num} 
            className={`p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-semibold flex items-center gap-2 transition ${
              step === s.num
                ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                : step > s.num
                ? 'bg-emerald-50 dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/40'
                : 'bg-white dark:bg-slate-900/60 text-slate-500 dark:text-slate-500 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 ${
              step === s.num 
                ? 'bg-white text-purple-700' 
                : step > s.num 
                ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              {s.num}
            </span>
            <span className="truncate">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Main Interactive Comparison Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Box: WITHOUT MEMORY */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold">
                BEFORE HINDSIGHT MEMORY
              </span>
              <span className="text-xs text-rose-500 font-mono font-medium">Baseline Generic Model</span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit mb-2">Prompt: "{question}"</h3>

            {beforeResponse ? (
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                {beforeResponse}
              </div>
            ) : (
              <div className="p-6 sm:p-8 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                Click "Run Step 1" to generate baseline recommendation without memory context.
              </div>
            )}
          </div>

          <button
            onClick={runStep1}
            disabled={loadingBefore}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loadingBefore ? <RefreshCw className="h-4 w-4 animate-spin text-blue-600" /> : <Zap className="h-4 w-4 text-amber-500" />}
            <span>Run Step 1: Ask Without Memory</span>
          </button>
        </div>

        {/* Right Box: WITH HINDSIGHT MEMORY */}
        <div className="p-4 sm:p-6 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/40 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 flex items-center gap-1 font-semibold">
                <BrainCircuit className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400" />
                AFTER HINDSIGHT MEMORY
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">Personalized Agent</span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit mb-2">Prompt: "{question}"</h3>

            {afterResponse ? (
              <div className="space-y-3">
                <MemoryBadge 
                  memoryCount={afterResponse.memory_count} 
                  sources={afterResponse.sources}
                  recalledMemories={afterResponse.recalled_memories}
                />
                <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-purple-200 dark:border-purple-500/30 text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap shadow-sm">
                  {afterResponse.response}
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 rounded-xl bg-white/60 dark:bg-slate-950/40 border border-dashed border-purple-200 dark:border-purple-500/30 text-center text-xs text-slate-500 dark:text-slate-400">
                Complete Steps 1-3, then click below to ask Hindsight-powered Agent.
              </div>
            )}
          </div>

          <button
            onClick={runStep3}
            disabled={loadingAfter}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 cursor-pointer mt-2"
          >
            {loadingAfter ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-300" />}
            <span>Run Step 4: Ask With Hindsight Memory</span>
          </button>
        </div>
      </div>

      {/* Middle Section: Hindsight Fact Bank Injector */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Accumulated Facts in Hindsight Memory Bank
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Facts stored in bank for instant real-time recall</p>
          </div>
          <span className="text-[11px] font-mono text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full bg-purple-50 dark:bg-slate-900 border border-purple-200 dark:border-slate-800 w-fit font-bold">
            {demoFacts.length} Memory Facts Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {demoFacts.map((fact, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 uppercase font-bold mr-1">
                  [{fact.category}]
                </span>
                <span className="text-slate-700 dark:text-slate-200">{fact.content}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add custom fact input */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <input
            type="text"
            value={newFact}
            onChange={(e) => setNewFact(e.target.value)}
            placeholder="Add brand fact to Hindsight (e.g. 'My audience asked for React tutorials')..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900"
          />
          <button
            onClick={handleAddFact}
            disabled={addingFact || !newFact.trim()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Store in Hindsight</span>
          </button>
        </div>
      </div>
    </div>
  );
}
