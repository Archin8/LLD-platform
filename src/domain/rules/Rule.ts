import { Problem } from '../models/Problem';
import { Submission } from '../models/Submission';
import { Severity } from '../models/FeedbackResult';

export interface EvaluationInput {
  problem: Problem;
  submission: Submission;
}

export interface RuleResult {
  passed: boolean;
  message: string;
  severity?: Severity;
  strength?: string;
  suggestion?: string;
  ruleId: string;
}

export interface Rule {
  id: string;
  check(input: EvaluationInput): RuleResult;
}
