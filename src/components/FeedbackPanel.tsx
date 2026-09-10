'use client';

import { useState } from 'react';
import { FeedbackResult, FeedbackIssue } from '@/domain/models/FeedbackResult';

interface FeedbackPanelProps {
  feedback: FeedbackResult;
  problemTitle?: string;
  onTryAgain?: () => void;
}

export default function FeedbackPanel({
  feedback,
  problemTitle,
  onTryAgain,
}: FeedbackPanelProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');

  const filteredIssues = feedback.issues.filter((issue) => {
    if (selectedSeverity === 'ALL') return true;
    return issue.severity.toUpperCase() === selectedSeverity;
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: '#16a34a', text: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (score >= 70) return { stroke: '#4f46e5', text: 'text-indigo-700', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
    if (score >= 50) return { stroke: '#d97706', text: 'text-amber-700', badge: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { stroke: '#dc2626', text: 'text-rose-700', badge: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  const scoreStyle = getScoreColor(feedback.score);
  const strokeDashoffset = 283 - (283 * feedback.score) / 100;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* SCORE HEADER HERO */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-slate-200 bg-white">
        <div className="space-y-3 text-center md:text-left">
          <span className="inline-block text-[10px] uppercase font-extrabold tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Evaluation Report • {feedback.evaluatorType} engine
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            {problemTitle ? `${problemTitle} — Feedback` : 'Design Evaluation Report'}
          </h2>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Deterministic rule-based analysis evaluating Single Responsibility Principle (SRP), coupling, God class antipatterns, and abstractions.
          </p>
        </div>

        {/* SVG RADIAL SCORE RING */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-slate-100"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={scoreStyle.stroke}
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-3xl font-black tracking-tight ${scoreStyle.text}`}>
                {feedback.score}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400">SCORE</span>
            </div>
          </div>
        </div>
      </div>

      {/* STRENGTHS & SUGGESTIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STRENGTHS */}
        <div className="glass-card p-6 border-emerald-100 bg-white">
          <h3 className="text-base font-extrabold text-emerald-800 flex items-center gap-2 mb-4">
            <span>✅</span> Key Design Strengths ({feedback.strengths.length})
          </h3>
          <ul className="space-y-3">
            {feedback.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs font-semibold text-slate-800 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <span className="text-emerald-600 font-bold">✔</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SUGGESTIONS */}
        <div className="glass-card p-6 border-indigo-100 bg-white">
          <h3 className="text-base font-extrabold text-indigo-800 flex items-center gap-2 mb-4">
            <span>💡</span> Recommended Enhancements ({feedback.suggestions.length})
          </h3>
          <ul className="space-y-3">
            {feedback.suggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs font-semibold text-slate-800 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                <span className="text-indigo-600 font-bold">➔</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ISSUES BREAKDOWN */}
      <div className="glass-card p-6 bg-white border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>⚠️</span> Identified Violations & Issues ({feedback.issues.length})
          </h3>

          {/* FILTER TABS */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedSeverity === sev
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-emerald-700 font-bold text-base mb-1">🎉 Clean Design!</p>
            <p className="text-slate-500 text-xs">No issues flagged under the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue: FeedbackIssue, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-slate-500">Rule: {issue.ruleId}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${getSeverityBadge(
                      issue.severity
                    )}`}
                  >
                    {issue.severity}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  {issue.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TRY AGAIN ACTION */}
      {onTryAgain && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onTryAgain}
            className="px-8 py-3 rounded-xl text-sm font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all flex items-center gap-3"
          >
            🔄 Try Again & Refine Design
          </button>
        </div>
      )}
    </div>
  );
}
