import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Search, 
  Filter, 
  Plus, 
  Database, 
  Sparkles, 
  Tag, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { api } from '../services/api';

export default function MemoryPage({ currentUser }) {
  const [overview, setOverview] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('user_profile');
  const [adding, setAdding] = useState(false);

  const categoriesList = [
    { id: 'all', label: 'All Memories' },
    { id: 'user_profile', label: 'User Profile' },
    { id: 'audience', label: 'Audience' },
    { id: 'content', label: 'Content' },
    { id: 'performance', label: 'Performance' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'conversation', label: 'Conversation' }
  ];

  const fetchMemories = () => {
    setLoading(true);
    const catParam = selectedCategory === 'all' ? null : selectedCategory;
    const userId = currentUser?.id || 1;
    api.getMemories(catParam, userId)
      .then(data => {
        setOverview(data);
        setMemories(data.recent_memories || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load memories:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMemories();
  }, [selectedCategory, currentUser?.id]);

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setAdding(true);
    try {
      await api.addMemory({
        category: newCategory,
        content: newContent,
        user_id: currentUser?.id || 1
      });
      setNewContent('');
      fetchMemories();
    } catch (err) {
      alert("Error adding memory: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const filteredMemories = memories.filter(m => 
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/70 to-blue-50 dark:from-purple-950/40 dark:to-slate-900 border border-purple-200 dark:border-purple-500/30 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 text-xs font-semibold mb-2 border border-purple-200 dark:border-purple-500/30">
              <BrainCircuit className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400 animate-pulse" />
              Vectorize Hindsight Memory Bank
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-outfit">
              Hindsight Memory Vault: {currentUser?.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Visualizing persistent facts in memory bank <code className="text-purple-700 dark:text-purple-300 font-mono font-semibold">socialflow_user_{currentUser?.id || 1}</code>.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-4 bg-white/90 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm shrink-0">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Total Memories</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-outfit">
                {overview?.total_memories || memories.length}
              </p>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Hindsight Engine</p>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active (Synced)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Memory Form */}
      <form onSubmit={handleAddMemory} className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-2.5 sm:gap-3 sm:items-center">
        <span className="text-xs font-bold text-slate-800 dark:text-white font-outfit shrink-0 flex items-center gap-1.5">
          <Plus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          Add Memory Fact:
        </span>
        
        <div className="flex flex-col sm:flex-row gap-2.5 flex-1">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full sm:w-44 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-950 font-medium"
          >
            <option value="user_profile">User Profile</option>
            <option value="audience">Audience</option>
            <option value="content">Content</option>
            <option value="performance">Performance</option>
            <option value="strategy">Strategy</option>
            <option value="conversation">Conversation</option>
          </select>

          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={`e.g. ${currentUser?.name} likes short 30s Python tutorials...`}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-950"
          />
        </div>

        <button
          type="submit"
          disabled={adding || !newContent.trim()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-500/20 transition disabled:opacity-50 cursor-pointer"
        >
          {adding ? 'Retaining...' : 'Retain Fact'}
        </button>
      </form>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm font-semibold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                {overview?.categories?.[cat.id] !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isSelected
                      ? 'bg-purple-800 text-purple-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-300'
                  }`}>
                    {overview.categories[cat.id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory facts..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-sm"
          />
        </div>
      </div>

      {/* Memory Cards Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-mono text-xs">
          Loading memories from Hindsight bank...
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <BrainCircuit className="h-8 w-8 text-slate-400 dark:text-slate-600 mx-auto" />
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">No memories found for {currentUser?.name}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredMemories.map((mem) => (
            <div 
              key={mem.id} 
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500/40 transition space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono text-[10px] border border-purple-200 dark:border-purple-800 font-bold uppercase tracking-wider">
                  {mem.category}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(mem.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {mem.content}
              </p>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span className="truncate max-w-[160px]">user_{currentUser?.id || 1}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Hindsight Synced
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
