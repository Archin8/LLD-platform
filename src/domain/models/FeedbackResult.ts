export type Severity = 'info' | 'warning' | 'critical';

export interface FeedbackIssue {
  severity: Severity;
  message: string;
  ruleId: string;
}

export interface FeedbackResult {
  id?: string;
  submissionId?: string;
  score: number; // 0-100
  strengths: string[];
  issues: FeedbackIssue[];
  suggestions: string[];
  evaluatorType: string;
  createdAt?: Date;
}
