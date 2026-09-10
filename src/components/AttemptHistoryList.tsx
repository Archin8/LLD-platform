'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AttemptHistoryItem {
  id: string;
  problemId: string;
  status: string;
  createdAt: string;
  problem: {
    title: string;
    difficulty: string;
    slug: string;
  };
  submission?: {
    feedback?: {
      score: number;
    } | null;
  } | null;
}

interface AttemptHistoryListProps {
  attempts: AttemptHistoryItem[];
}

export default function AttemptHistoryList({ attempts }: AttemptHistoryListProps) {
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'COMPLETED' | 'DRAFT'>('ALL');

  const filteredAttempts = attempts.filter((att) => {
    if (selectedStatus === 'ALL') return true;
    return att.status.toUpperCase() === selectedStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'SUBMITTED':
      case 'EVALUATING':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'FAILED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'DRAFT':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'badge-easy';
      case 'MEDIUM':
        return 'badge-medium';
      case 'HARD':
        return 'badge-hard';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (attempts.length === 0) {
    return (
      <div className="glass-card p-12 text-center border-slate-200 bg-white">
        <p className="text-slate-600 text-base mb-4 font-semibold">No past attempts recorded yet.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
        >
          Explore Problem Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* STATUS TABS */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
        {(['ALL', 'COMPLETED', 'DRAFT'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedStatus === st
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* ATTEMPTS TABLE */}
      <div className="glass-card overflow-hidden border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-extrabold">
              <tr>
                <th className="px-6 py-4">Problem</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttempts.map((att) => {
                const score = att.submission?.feedback?.score;
                const dateStr = new Date(att.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {att.problem?.title || 'LLD Problem'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getDifficultyBadge(att.problem?.difficulty)}`}>
                        {att.problem?.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{dateStr}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(att.status)}`}>
                        {att.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      {score !== undefined && score !== null ? (
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-xs border font-extrabold ${
                            score >= 80
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : score >= 60
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {score} / 100
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">--</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {att.status === 'COMPLETED' ? (
                        <Link
                          href={`/attempts/${att.id}`}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all"
                        >
                          View Report →
                        </Link>
                      ) : (
                        <Link
                          href={`/problems/${att.problemId}?attemptId=${att.id}`}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
                        >
                          {att.status === 'DRAFT' ? 'Continue Draft ✏️' : 'View Attempt'}
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
