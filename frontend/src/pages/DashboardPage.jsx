import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Eye, 
  TrendingUp, 
  Trophy, 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  BarChart2 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import StatCard from '../components/StatCard';
import { api } from '../services/api';

export default function DashboardPage({ setActivePage, currentUser }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const userId = currentUser?.id || 1;
    api.getAnalytics(userId)
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load analytics:', err);
        setLoading(false);
      });
  }, [currentUser?.id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh] text-slate-500 dark:text-slate-400 font-sans text-xs">
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <BrainCircuit className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
          <span>Syncing workspace telemetry & Hindsight memory bank...</span>
        </div>
      </div>
    );
  }

  const {
    total_posts = 0,
    total_views = 0,
    average_engagement = 0.0,
    best_performing_post,
    performance_trend = [],
    top_posts = [],
    ai_insights = []
  } = analytics || {};

  const calculateProfileCompletion = (user) => {
    if (!user) return 25;
    if (user.profile_complete) return 100;
    let score = 25; // Base account registered & verified
    if (user.phone || user.gender) score += 25;
    if (user.content_types && user.content_types.length > 0) score += 25;
    if (user.connected_platforms && user.connected_platforms.length > 0) score += 25;
    return Math.min(score, 100);
  };

  const completionScore = calculateProfileCompletion(currentUser);

  return (
    <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 font-sans">
      {/* Dynamic Profile Completion Progress Bar */}
      {completionScore < 100 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50/50 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border border-amber-200 dark:border-amber-500/30 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-500/30 shrink-0 font-mono font-bold text-sm">
                {completionScore}%
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-outfit">Complete Your Creator Profile</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Finish setting up your profile details to unlock 100% accurate AI memory strategy.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActivePage('settings')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shrink-0 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-sm"
            >
              Complete Profile ({completionScore}%) <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
            <div 
              className="bg-gradient-to-r from-amber-500 via-blue-500 to-indigo-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${completionScore}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Workspace Profile Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 sm:gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          {currentUser?.avatar_url ? (
            <img 
              src={currentUser.avatar_url} 
              alt={currentUser?.name || 'Creator'} 
              className="h-12 w-12 rounded-xl object-cover border-2 border-blue-500 shadow-sm shrink-0" 
            />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-sm shrink-0">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-outfit">{currentUser?.name} Workspace</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans mt-0.5">
              Niche: <span className="text-blue-600 dark:text-blue-300 font-semibold">{currentUser?.niche || 'Tech & AI'}</span> • Target: {currentUser?.target_audience || 'Creators & Tech Enthusiasts'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-blue-700 dark:text-blue-300">
          <BrainCircuit className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span>Active Bank: socialflow_user_{currentUser?.id || 1}</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <StatCard
          title="Total Posts Tracked"
          value={total_posts}
          subtext="across connected platforms"
          icon={FolderKanban}
          color="purple"
          trend="+4 this month"
        />
        <StatCard
          title="Total Views"
          value={total_views ? total_views.toLocaleString() : '0'}
          subtext="accumulated channel reach"
          icon={Eye}
          color="cyan"
          trend="+18.4%"
        />
        <StatCard
          title="Average Engagement"
          value={`${average_engagement}%`}
          subtext="industry avg: 2.1%"
          icon={TrendingUp}
          color="emerald"
          trend="+3.2%"
        />
        <StatCard
          title="Top Category"
          value={best_performing_post?.topic || 'Tech Tutorials'}
          subtext={`Best: ${best_performing_post?.engagement_rate || 12.4}% engagement`}
          icon={Trophy}
          color="amber"
        />
      </div>

      {/* Main Row: Chart + AI Insight Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Performance Chart over time */}
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Performance & Engagement Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Views & engagement rate per published post</p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 self-start sm:self-auto">
              Live DB Telemetry
            </span>
          </div>

          <div className="h-56 sm:h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performance_trend}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.25} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="left" stroke="#3b82f6" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="views" name="Views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" />
                <Area yAxisId="right" type="monotone" dataKey="engagement_rate" name="Engagement %" stroke="#10b981" fillOpacity={1} fill="url(#colorEngagement)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight & Memory Status Panel */}
        <div className="space-y-4 sm:space-y-6">
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-blue-50/70 to-white dark:from-blue-950/30 dark:to-slate-900/90 border border-blue-200 dark:border-blue-500/25 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                AI STRATEGIST INSIGHT
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20 font-semibold">
                Hindsight Synced
              </span>
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              "{ai_insights[0] || `Your content in ${currentUser?.niche || 'Tech'} consistently outperforms general promotional posts.`}"
            </p>

            <div className="pt-2 border-t border-blue-200 dark:border-blue-500/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Memories active in bank
              </span>
              <button 
                onClick={() => setActivePage('agent')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                Ask Agent &rarr;
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-outfit">
              <Zap className="h-4 w-4 text-amber-500" />
              Recommended Next Action
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-outfit">
              Create a targeted 35s short video for {currentUser?.niche || 'your channel'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Based on historical post metrics and audience preferences in Hindsight bank.
            </p>
            <button
              onClick={() => setActivePage('agent')}
              className="w-full mt-2 py-2.5 rounded-xl brand-gradient-btn text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Get Full Hook & Script</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Performing Content Section */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Top Performing Social Content
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Highest engagement posts automatically learned by Hindsight</p>
          </div>
          <button
            onClick={() => setActivePage('content')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            Manage All Posts ({total_posts}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {top_posts.slice(0, 3).map((post, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-blue-400 dark:hover:border-blue-500/30 transition shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20 font-semibold text-[11px]">
                  {post.platform} • {post.content_type}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">{post.engagement_rate}% Eng</span>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-xs line-clamp-1">{post.title}</h4>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>👁️ {post.views?.toLocaleString()} views</span>
                <span>💾 {post.saves?.toLocaleString()} saves</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
