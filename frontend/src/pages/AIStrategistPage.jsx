import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  BrainCircuit, 
  Sparkles, 
  User, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Check, 
  Copy, 
  PanelLeftClose, 
  PanelLeft, 
  Search, 
  X,
  ArrowRight
} from 'lucide-react';
import MemoryBadge from '../components/MemoryBadge';
import { api } from '../services/api';

// Helper to render markdown text with bolding, bullets, and line breaks cleanly
const renderFormattedText = (rawText) => {
  if (!rawText) return null;
  const lines = rawText.split('\n');
  return lines.map((line, lineIdx) => {
    // Process **bold** and *italic* in line
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    const formattedLine = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIdx} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={partIdx} className="italic text-slate-700 dark:text-slate-300">{part.slice(1, -1)}</em>;
      }
      return part;
    });

    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
      return (
        <div key={lineIdx} className="flex items-start gap-1.5 my-1 pl-1">
          <span className="text-blue-500 dark:text-blue-400 font-bold shrink-0 leading-tight">•</span>
          <div className="flex-1">{formattedLine}</div>
        </div>
      );
    }

    return (
      <div key={lineIdx} className={line === '' ? 'h-2' : 'my-0.5'}>
        {formattedLine}
      </div>
    );
  });
};

export default function AIStrategistPage({ currentUser }) {
  // Session & Message states
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentSessionTitle, setCurrentSessionTitle] = useState('New Conversation');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [searchSessionQuery, setSearchSessionQuery] = useState('');
  
  // UI states (sidebar closed on mobile by default)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const chatEndRef = useRef(null);
  const userId = currentUser?.id || 1;

  // Set sidebar open on desktop once on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  // 1. Load Sessions on Mount or User Change
  useEffect(() => {
    fetchSessions();
  }, [userId]);

  const fetchSessions = async (autoSelectFirst = true) => {
    setLoadingSessions(true);
    try {
      const data = await api.getChatSessions(userId);
      setSessions(data || []);
      
      if (data && data.length > 0) {
        if (autoSelectFirst && !currentSessionId) {
          selectSession(data[0].id, data[0].title);
        }
      } else {
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to load chat sessions:', err);
      handleNewChat();
    } finally {
      setLoadingSessions(false);
    }
  };

  // 2. Select a specific Chat Session
  const selectSession = async (sessionId, sessionTitle) => {
    setCurrentSessionId(sessionId);
    setCurrentSessionTitle(sessionTitle || 'Conversation');
    setLoading(true);
    try {
      const msgs = await api.getSessionMessages(sessionId);
      if (msgs && msgs.length > 0) {
        setMessages(msgs);
      } else {
        setMessages([getWelcomeMessage()]);
      }
    } catch (err) {
      console.error('Failed to load session messages:', err);
      setMessages([getWelcomeMessage()]);
    } finally {
      setLoading(false);
      // Auto-close sidebar on mobile after selecting a session
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  };

  // 3. Welcome message generator
  const getWelcomeMessage = () => ({
    id: 'welcome',
    sender: 'agent',
    text: `Hello ${currentUser?.name || 'Creator'}! 👋 I am your **SocialFlow AI Strategist** powered by **Vectorize Hindsight persistent memory**.\n\nI have loaded your profile for **${currentUser?.niche || 'Tech & AI'}**, historical channel telemetry, audience interactions, and viral hook patterns.\n\n**Ask me anything:**\n- 🎬 *\"Write a 35s viral Reel script on Python debugging with an engaging hook.\"*\n- 📈 *\"Why did my top-performing video get high reach?\"*\n- 💡 *\"Give me 5 fresh content ideas tailored for ${currentUser?.target_audience || 'developers'}.\"*\n- 📅 *\"What is the best weekly posting schedule for my accounts?\"*`,
    memory_used: true,
    memory_count: 3,
    sources: ["Audience Persona", "Post Performance Telemetry", "Channel Stats"],
    recalled_memories: [
      { category: "audience", content: `Audience: ${currentUser?.target_audience || 'Creators & Developers'}.` },
      { category: "user_profile", content: `Creator Niche: ${currentUser?.niche || 'Tech & AI'}.` },
      { category: "strategy", content: `3-second high-contrast hooks drive algorithm retention.` }
    ]
  });

  // 4. Start "+ New Chat"
  const handleNewChat = () => {
    setCurrentSessionId(null);
    setCurrentSessionTitle('New Conversation');
    setMessages([getWelcomeMessage()]);
    setInput('');
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // 5. Delete a Session
  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;
    try {
      await api.deleteChatSession(sessionId);
      const updated = sessions.filter(s => s.id !== sessionId);
      setSessions(updated);
      if (currentSessionId === sessionId) {
        if (updated.length > 0) {
          selectSession(updated[0].id, updated[0].title);
        } else {
          handleNewChat();
        }
      }
    } catch (err) {
      alert("Failed to delete chat: " + err.message);
    }
  };

  // 6. Rename a Session
  const handleStartRename = (e, session) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveRename = async (sessionId) => {
    if (!editingTitle.trim()) {
      setEditingSessionId(null);
      return;
    }
    try {
      await api.updateChatSession(sessionId, editingTitle.trim());
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: editingTitle.trim() } : s));
      if (currentSessionId === sessionId) {
        setCurrentSessionTitle(editingTitle.trim());
      }
    } catch (err) {
      console.error("Failed to rename session:", err);
    } finally {
      setEditingSessionId(null);
    }
  };

  // Auto scroll
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleCopyText = (idx, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // 7. Send Message
  const handleSend = async () => {
    const query = input.trim();
    if (!query || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await api.sendChat(query, false, userId, currentSessionId);
      
      const agentMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: data.response,
        memory_used: data.memory_used,
        memory_count: data.memory_count,
        sources: data.sources,
        recalled_memories: data.recalled_memories,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, agentMsg]);

      if (!currentSessionId && data.session_id) {
        setCurrentSessionId(data.session_id);
        setCurrentSessionTitle(data.session_title || query.slice(0, 30));
        fetchSessions(false);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: "⚠️ System Notice: Unable to generate response. Please verify connection and retry.",
          memory_used: false,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(s => 
    (s.title || '').toLowerCase().includes(searchSessionQuery.toLowerCase()) ||
    (s.last_message || '').toLowerCase().includes(searchSessionQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col h-[calc(100dvh-8rem)] md:h-[calc(100vh-4rem)] max-h-[calc(100dvh-8rem)] md:max-h-[calc(100vh-4rem)] overflow-hidden font-sans bg-white dark:bg-[#070b14] relative">
      
      {/* ─── MOBILE BACKDROP ─── */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 h-full overflow-hidden relative">

        {/* ─── 1. LEFT SIDEBAR: Drawer on Mobile, Column on Desktop ─── */}
        <div className={`fixed md:relative inset-y-0 left-0 z-50 md:z-20 h-full w-[85vw] max-w-xs md:w-80 bg-white dark:bg-[#0c121e] border-r border-slate-200 dark:border-slate-800 shadow-2xl md:shadow-none flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? 'translate-x-0' 
            : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0'
        }`}>
          {/* Sidebar Header: "+ New Chat" Button */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>New Conversation</span>
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Close Sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          {/* Search Past Chats */}
          <div className="px-3 pt-3">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchSessionQuery}
                onChange={(e) => setSearchSessionQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none">
            {loadingSessions ? (
              <div className="p-6 text-center text-xs text-slate-400 font-mono">
                Loading conversations...
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No past conversations. Start a new chat!
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isActive = currentSessionId === session.id;
                return (
                  <div
                    key={session.id}
                    onClick={() => selectSession(session.id, session.title)}
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs transition cursor-pointer ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800/60 shadow-xs' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                      
                      {editingSessionId === session.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => handleSaveRename(session.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(session.id)}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          className="bg-white dark:bg-slate-800 border border-blue-500 rounded px-1.5 py-0.5 text-xs text-slate-900 dark:text-white w-full outline-none"
                        />
                      ) : (
                        <span className="truncate">{session.title}</span>
                      )}
                    </div>

                    {/* Action Icons */}
                    <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0 ${isActive ? 'opacity-100' : ''}`}>
                      <button
                        onClick={(e) => handleStartRename(e, session)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        title="Rename conversation"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                        title="Delete conversation"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar Footer: Hindsight Status */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Vectorize Hindsight
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase">Synced</span>
          </div>
        </div>

        {/* ─── 2. MAIN CHAT CONTAINER ─── */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/60 dark:bg-[#070b14]">
          
          {/* Main Chat Header Bar */}
          <div className="h-14 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0b101b]/95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer shrink-0"
                title="Toggle Conversations History"
              >
                <PanelLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-outfit truncate max-w-[150px] xs:max-w-[220px] sm:max-w-md">
                    {currentSessionTitle}
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.name || 'Creator'} • {currentUser?.niche || 'Tech & AI'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleNewChat}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition cursor-pointer active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">New</span>
              </button>
              
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 text-[11px] text-purple-700 dark:text-purple-300 font-mono">
                <BrainCircuit className="h-3.5 w-3.5 text-purple-600 dark:text-cyan-400 animate-pulse" />
                <span>Continuous Memory</span>
              </div>
            </div>
          </div>

          {/* ─── Message Stream ─── */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={msg.id || idx} 
                className={`flex gap-2 sm:gap-3 max-w-4xl mx-auto ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                    <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                )}

                <div className={`rounded-2xl p-3.5 sm:p-5 text-xs sm:text-[13px] leading-relaxed space-y-2 relative group break-words ${
                  msg.sender === 'user'
                    ? 'max-w-[88%] sm:max-w-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md rounded-tr-xs'
                    : 'max-w-[94%] sm:max-w-3xl bg-white dark:bg-[#0d1322] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xs rounded-tl-xs'
                }`}>
                  {/* Hindsight Memory Citation Badge */}
                  {msg.sender === 'agent' && msg.memory_used && (
                    <MemoryBadge
                      memoryCount={msg.memory_count}
                      sources={msg.sources}
                      recalledMemories={msg.recalled_memories}
                    />
                  )}

                  {/* Formatted Markdown Body */}
                  <div className="font-sans leading-relaxed text-xs sm:text-[13px]">
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* Agent Action Bar */}
                  {msg.sender === 'agent' && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 truncate">
                        <Sparkles className="h-3 w-3 text-purple-500 dark:text-purple-400 shrink-0" />
                        Vectorize Hindsight
                      </span>
                      <button
                        onClick={() => handleCopyText(idx, msg.text)}
                        className="p-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                        title="Copy response"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center max-w-4xl mx-auto text-slate-600 dark:text-slate-300 text-xs font-mono p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit shadow-xs">
                <BrainCircuit className="h-4 w-4 text-purple-500 animate-spin shrink-0" />
                <span>Formulating response with Hindsight memory & telemetry...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ─── Quick Suggestion Prompts Bar (Scrollable chips) ─── */}
          <div className="px-2.5 sm:px-4 py-2 bg-white/90 dark:bg-[#090e18]/90 border-t border-slate-200/90 dark:border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden sm:inline flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" /> Prompts:
            </span>
            {[
              "🎬 35s viral Reel script with hook",
              "📈 Why did my top video get high reach?",
              "💡 5 fresh content ideas for my niche",
              "📅 Best weekly posting schedule"
            ].map((promptText, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(promptText)}
                className="px-2.5 sm:px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 dark:bg-slate-800/90 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700/80 text-[11px] font-medium shrink-0 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* ─── Input Bar ─── */}
          <div className="p-2 sm:p-3 bg-white dark:bg-[#0b101b] border-t border-slate-200 dark:border-slate-800/80 shrink-0">
            <div className="max-w-4xl mx-auto flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask AI Strategist anything..."
                className="flex-1 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition shadow-inner"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-40 cursor-pointer shadow-md shadow-blue-500/20 shrink-0 active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Ask Agent</span>
              </button>
            </div>
            <div className="max-w-4xl mx-auto mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono px-1">
              <span className="hidden sm:inline">Press Enter ↵ to send</span>
              <span className="truncate">Vectorize Hindsight Memory Active</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
