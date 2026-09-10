'use client';

import { useRouter } from 'next/navigation';
import SubmissionForm from '@/components/SubmissionForm';

interface SubmissionWorkspaceClientProps {
  problem: any;
  attempt: any;
}

export default function SubmissionWorkspaceClient({
  problem,
  attempt,
}: SubmissionWorkspaceClientProps) {
  const router = useRouter();

  const handleSubmitted = (attemptId: string) => {
    router.push(`/attempts/${attemptId}`);
  };

  const initialClasses = (attempt.submission?.classes as any[]) || [];
  const initialRelationships = (attempt.submission?.relationships as any[]) || [];
  const initialRationale = attempt.submission?.rationale || '';

  return (
    <SubmissionForm
      attemptId={attempt.id}
      problemSlug={problem.slug}
      initialClasses={initialClasses}
      initialRelationships={initialRelationships}
      initialRationale={initialRationale}
      status={attempt.status}
      onSubmitted={handleSubmitted}
    />
  );
}
