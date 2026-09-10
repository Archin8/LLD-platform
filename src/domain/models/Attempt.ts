import { Problem } from './Problem';
import { Submission } from './Submission';
import { FeedbackResult } from './FeedbackResult';

export type AttemptStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'FAILED';

export interface Attempt {
  id: string;
  problemId: string;
  problem?: Problem;
  submission?: Submission | null;
  status: AttemptStatus;
  createdAt?: Date;
  updatedAt?: Date;
  feedback?: FeedbackResult | null;
}
