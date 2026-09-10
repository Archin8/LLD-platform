import { db } from '@/lib/db';
import { Problem } from '@/domain/models/Problem';
import ProblemCatalogClient from './ProblemCatalogClient';

export const revalidate = 0;

export default async function HomePage() {
  let problems: Problem[] = [];

  try {
    const rawProblems = await db.problem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    problems = rawProblems.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      requirements: p.requirements,
      difficulty: p.difficulty as any,
      requiresAbstraction: p.requiresAbstraction,
      createdAt: p.createdAt,
    }));
  } catch (error) {
    console.error('Failed to load problems from DB:', error);
  }

  return (
    <div className="space-y-10">
      {/* HERO BANNER */}
      <div className="glass-card p-8 sm:p-12 relative overflow-hidden border-indigo-100 bg-white">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 text-xs uppercase font-extrabold tracking-wider text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
            Interactive LLD Practice & Feedback Platform
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Master <span className="gradient-text">Low-Level System Design</span>
          </h1>

          <p className="text-slate-600 text-base leading-relaxed font-normal">
            Decompose complex domain problems, declare single responsibilities, build polymorphic abstractions, and get instant, rule-based feedback on object-oriented design principles.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <span>🎯</span> Instant SRP Analysis
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <span>🛡️</span> God Class Antipattern Detector
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-1.5">
              <span>⚡</span> Abstraction & Polymorphism Audit
            </div>
          </div>
        </div>
      </div>

      {/* CATALOG SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <span>📚</span> Practice Problems ({problems.length})
          </h2>
        </div>

        <ProblemCatalogClient initialProblems={problems} />
      </div>
    </div>
  );
}
