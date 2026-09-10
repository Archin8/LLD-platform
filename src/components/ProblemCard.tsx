'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Problem } from '@/domain/models/Problem';

interface ProblemCardProps {
  problem: Problem;
}

export default function ProblemCard({ problem }: ProblemCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartAttempt = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: problem.id }),
      });

      if (!res.ok) {
        throw new Error('Failed to create attempt');
      }

      const attempt = await res.json();
      router.push(`/problems/${problem.id}?attemptId=${attempt.id}`);
    } catch (err: any) {
      alert(err.message || 'Error starting attempt');
      setLoading(false);
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
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full group hover:border-indigo-300 relative overflow-hidden transition-all duration-300 bg-white animate-fade-in">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
            {problem.title}
          </h3>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getDifficultyBadge(problem.difficulty)} shrink-0`}>
            {problem.difficulty}
          </span>
        </div>

        <p className="text-slate-600 text-sm mb-5 leading-relaxed line-clamp-3 font-normal">
          {problem.description}
        </p>

        {problem.requiresAbstraction && problem.requiresAbstraction.length > 0 && (
          <div className="mb-5 bg-purple-50/60 p-3 rounded-xl border border-purple-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-2">
              ⚡ Required Abstraction Patterns
            </span>
            <div className="flex flex-wrap gap-1.5">
              {problem.requiresAbstraction.map((abs, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white text-purple-800 border border-purple-200 flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="text-purple-600">❖</span> {abs}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          {problem.requirements?.length || 0} functional specs
        </span>

        <button
          onClick={handleStartAttempt}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin text-xs">🌀 Opening Workspace...</span>
          ) : (
            <>
              <span>Start Workspace</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
