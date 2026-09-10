import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import AttemptFeedbackClient from './AttemptFeedbackClient';

export const revalidate = 0;

interface AttemptPageProps {
  params: Promise<{ id: string }>;
}

export default async function AttemptPage({ params }: AttemptPageProps) {
  const { id } = await params;

  const attempt = await db.attempt.findUnique({
    where: { id },
    include: {
      problem: true,
      submission: {
        include: {
          feedback: true,
        },
      },
    },
  });

  if (!attempt) {
    notFound();
  }

  const feedback = attempt.submission?.feedback;

  return (
    <div className="space-y-8">
      {/* NAVIGATION & STATUS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-slate-900">
              Attempt for {attempt.problem.title}
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                attempt.status === 'COMPLETED'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {attempt.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submitted at:{' '}
            {attempt.submission?.submittedAt
              ? new Date(attempt.submission.submittedAt).toLocaleString()
              : new Date(attempt.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/history"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-2xs"
          >
            ← View History
          </a>
          <a
            href={`/problems/${attempt.problemId}`}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
          >
            View Problem Specs
          </a>
        </div>
      </div>

      {/* FEEDBACK CONTENT */}
      {feedback ? (
        <AttemptFeedbackClient
          problemId={attempt.problemId}
          problemTitle={attempt.problem.title}
          feedback={{
            id: feedback.id,
            submissionId: feedback.submissionId,
            score: feedback.score,
            strengths: feedback.strengths,
            issues: (feedback.issues as any) || [],
            suggestions: feedback.suggestions,
            evaluatorType: feedback.evaluatorType,
            createdAt: feedback.createdAt,
          }}
        />
      ) : (
        <div className="glass-card p-12 text-center border-slate-200 bg-white">
          <p className="text-rose-700 font-bold text-lg mb-2">No Feedback Generated Yet</p>
          <p className="text-slate-600 text-sm mb-4">
            Status is current: <span className="font-semibold text-slate-900">{attempt.status}</span>.
          </p>
          <a
            href={`/problems/${attempt.problemId}?attemptId=${attempt.id}`}
            className="inline-block px-5 py-2 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Return to Workspace
          </a>
        </div>
      )}
    </div>
  );
}
