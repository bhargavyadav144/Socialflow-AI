import React, { useState } from 'react';
import { BrainCircuit, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';

export default function MemoryBadge({ memoryCount = 0, sources = [], recalledMemories = [] }) {
  const [expanded, setExpanded] = useState(false);

  if (memoryCount === 0) return null;

  return (
    <div className="mt-3 mb-2 rounded-xl bg-purple-50/80 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-500/30 overflow-hidden text-xs transition-colors shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2 bg-gradient-to-r from-purple-100/80 to-blue-50/80 hover:from-purple-100 hover:to-blue-100 dark:from-purple-950/60 dark:to-slate-900 dark:hover:bg-purple-900/30 flex items-center justify-between transition cursor-pointer text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <BrainCircuit className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse shrink-0" />
          <span className="font-semibold text-purple-900 dark:text-purple-200 truncate">
            Hindsight Memory Active ({memoryCount} recalled memories)
          </span>
          {sources.length > 0 && (
            <span className="hidden sm:inline text-purple-600/80 dark:text-slate-400 text-[11px] truncate">
              • Sources: {sources.join(', ')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-purple-700 dark:text-slate-400 shrink-0 ml-2">
          <span className="text-[11px] font-medium">{expanded ? 'Hide details' : 'View context'}</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </div>
      </button>

      {expanded && (
        <div className="p-3 bg-white dark:bg-slate-950/80 border-t border-purple-200 dark:border-purple-500/20 space-y-2">
          <p className="text-[11px] font-semibold text-purple-800 dark:text-slate-400 uppercase tracking-wider">
            Recalled Facts from Hindsight Bank:
          </p>
          <div className="space-y-1.5">
            {recalledMemories.length > 0 ? (
              recalledMemories.map((mem, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-purple-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 uppercase mr-1.5 font-bold">
                      [{mem.category || 'memory'}]
                    </span>
                    <span className="text-slate-700 dark:text-slate-200">{mem.content || JSON.stringify(mem)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                Recalled context: High-performing Python reels history, college student audience persona, and post retention patterns.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
