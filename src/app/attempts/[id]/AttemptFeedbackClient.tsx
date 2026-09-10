'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FeedbackPanel from '@/components/FeedbackPanel';
import { FeedbackResult } from '@/domain/models/FeedbackResult';

interface AttemptFeedbackClientProps {
  problemId: string;
  problemTitle: string;
  feedback: FeedbackResult;
}

export default function AttemptFeedbackClient({
  problemId,
  problemTitle,
  feedback,
}: AttemptFeedbackClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleTryAgain = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId }),
      });

      if (!res.ok) throw new Error('Failed to create new attempt');
      const newAttempt = await res.json();
      router.push(`/problems/${problemId}?attemptId=${newAttempt.id}`);
    } catch (err: any) {
      alert(err.message || 'Error creating new attempt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {loading && (
        <div className="p-3 rounded-lg bg-indigo-950/80 text-indigo-300 text-sm font-semibold flex items-center gap-2">
          <span className="animate-spin">🌀</span> Creating new attempt draft...
        </div>
      )}
      <FeedbackPanel
        feedback={feedback}
        problemTitle={problemTitle}
        onTryAgain={handleTryAgain}
      />
    </div>
  );
}
