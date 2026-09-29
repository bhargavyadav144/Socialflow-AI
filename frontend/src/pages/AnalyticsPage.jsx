import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Sparkles, Trophy, Award } from 'lucide-react';
import { api } from '../services/api';

export default function AnalyticsPage({ currentUser }) {
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
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-mono text-xs">
        Loading analytics for {currentUser?.name}...
      </div>
    );
  }

  const {
    total_posts = 0,
    total_likes = 0,
    total_comments = 0,
    average_engagement = 0.0,
    best_content_type = "N/A",
    best_topic = "N/A",
    ai_insights = []
  } = analytics || {};

  return (
    <div className="max-w-7xl mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:to-cyan-950/40 border border-blue-200 dark:border-cyan-500/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-cyan-400" />
              Engagement Telemetry: {currentUser?.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Calculates formula: <code className="text-blue-700 dark:text-cyan-300 font-mono bg-blue-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-200 dark:border-slate-800 break-all">(likes + comments + shares + saves) / views * 100</code>
            </p>
          </div>

          <div className="flex gap-3 sm:gap-4 text-xs font-mono self-start sm:self-auto">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center min-w-[100px] shadow-xs">
              <p className="text-slate-500 dark:text-slate-400">Total Likes</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white font-outfit">{total_likes.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center min-w-[100px] shadow-xs">
              <p className="text-slate-500 dark:text-slate-400">Total Comments</p>
              <p className="text-lg font-bold text-blue-600 dark:text-cyan-400 font-outfit">{total_comments.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 space-y-2.5 sm:space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase font-mono">Best Content Type</span>
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">{best_content_type}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Highest performing video format for {currentUser?.niche || 'Tech'}</p>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-cyan-500/30 space-y-2.5 sm:space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 dark:text-cyan-300 uppercase font-mono">Highest Performing Topic</span>
            <Award className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">{best_topic}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Top topic category across {total_posts} tracked posts</p>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 space-y-2.5 sm:space-y-3 shadow-xs sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase font-mono">Channel Engagement</span>
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">{average_engagement}%</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Calculated across all published social content</p>
        </div>
      </div>

      {/* AI Insights Synthesis list */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          AI Synthesized Strategic Insights
        </h3>
        <div className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
          {ai_insights.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No synthesized insights yet. Connect channels and publish content to generate telemetry.</p>
          ) : (
            ai_insights.map((insight, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 shadow-xs">
                <span className="h-6 w-6 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{insight}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
