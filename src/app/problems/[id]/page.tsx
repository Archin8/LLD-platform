import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import SubmissionWorkspaceClient from './SubmissionWorkspaceClient';

export const revalidate = 0;

interface WorkspacePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}

export default async function WorkspacePage({ params, searchParams }: WorkspacePageProps) {
  const { id } = await params;
  const { attemptId: queryAttemptId } = await searchParams;

  // 1. Fetch Problem
  const problem = await db.problem.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
  });

  if (!problem) {
    notFound();
  }

  // 2. Fetch or Create Attempt
  let attempt: any = null;

  if (queryAttemptId) {
    attempt = await db.attempt.findUnique({
      where: { id: queryAttemptId },
      include: { submission: true },
    });
  }

  if (!attempt) {
    const existingDraft = await db.attempt.findFirst({
      where: { problemId: problem.id, status: 'DRAFT' },
      include: { submission: true },
      orderBy: { createdAt: 'desc' },
    });

    if (existingDraft) {
      attempt = existingDraft;
    } else {
      attempt = await db.attempt.create({
        data: {
          problemId: problem.id,
          status: 'DRAFT',
          submission: {
            create: {
              classes: [],
              relationships: [],
              rationale: '',
            },
          },
        },
        include: { submission: true },
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* HEADER & NAV */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900">{problem.title}</h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                problem.difficulty === 'EASY'
                  ? 'badge-easy'
                  : problem.difficulty === 'MEDIUM'
                  ? 'badge-medium'
                  : 'badge-hard'
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">Attempt ID: {attempt.id}</p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 shadow-2xs"
          >
            ← Catalog
          </a>
        </div>
      </div>

      {/* GRID: PROBLEM SPECS (LEFT) & INTERACTIVE SUBMISSION FORM (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: PROBLEM DESCRIPTION & REQUIREMENTS */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-card p-6 space-y-5 border-slate-200 bg-white sticky top-24">
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 mb-2">
                Problem Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {problem.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 mb-2">
                Functional Requirements
              </h3>
              <ul className="space-y-2.5">
                {problem.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {problem.requiresAbstraction && problem.requiresAbstraction.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block mb-2">
                  Expected Abstractions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {problem.requiresAbstraction.map((abs, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-mono shadow-2xs"
                    >
                      ⚡ {abs}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE FORM */}
        <div className="lg:col-span-2">
          <SubmissionWorkspaceClient problem={problem} attempt={attempt} />
        </div>
      </div>
    </div>
  );
}
