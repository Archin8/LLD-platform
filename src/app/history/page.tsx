import { db } from '@/lib/db';
import AttemptHistoryList from '@/components/AttemptHistoryList';

export const revalidate = 0;

export default async function HistoryPage() {
  let attempts: any[] = [];

  try {
    const rawAttempts = await db.attempt.findMany({
      include: {
        problem: {
          select: { title: true, difficulty: true, slug: true },
        },
        submission: {
          include: {
            feedback: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    attempts = rawAttempts.map((att) => ({
      id: att.id,
      problemId: att.problemId,
      status: att.status,
      createdAt: att.createdAt.toISOString(),
      problem: att.problem,
      submission: att.submission,
    }));
  } catch (error) {
    console.error('Failed to load attempt history from DB:', error);
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Attempt History</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your iterative improvements, review past scores, and retry designs.
          </p>
        </div>

        <a
          href="/"
          className="px-4 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
        >
          + New Attempt
        </a>
      </div>

      {/* ATTEMPTS TABLE */}
      <AttemptHistoryList attempts={attempts} />
    </div>
  );
}
