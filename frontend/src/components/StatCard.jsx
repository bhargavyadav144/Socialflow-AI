import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, subtext, icon: Icon, trend, color = 'purple' }) {
  const colorClasses = {
    purple: 'from-purple-500/10 to-indigo-500/5 dark:from-purple-600/20 dark:to-indigo-600/10 border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400',
    cyan: 'from-blue-500/10 to-cyan-500/5 dark:from-cyan-600/20 dark:to-blue-600/10 border-blue-200 dark:border-cyan-500/20 text-blue-600 dark:text-cyan-400',
    emerald: 'from-emerald-500/10 to-teal-500/5 dark:from-emerald-600/20 dark:to-teal-600/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    amber: 'from-amber-500/10 to-orange-500/5 dark:from-amber-600/20 dark:to-orange-600/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400',
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${colorClasses[color]} bg-white dark:bg-slate-900 border transition-all duration-300 hover:scale-[1.02] shadow-xs hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-outfit">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 ${colorClasses[color].split(' ').pop()}`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-outfit truncate">
          {value}
        </h3>
        {trend && (
          <span className={`text-[11px] sm:text-xs font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-full shrink-0 ${
            trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30' : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30'
          }`}>
            {trend.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
          {subtext}
        </p>
      )}
    </div>
  );
}
