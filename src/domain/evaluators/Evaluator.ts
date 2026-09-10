import { Problem } from '../models/Problem';
import { Submission } from '../models/Submission';
import { FeedbackResult } from '../models/FeedbackResult';

export interface EvaluationInput {
  problem: Problem;
  submission: Submission;
}

export type EvaluationOutput = FeedbackResult;

export interface Evaluator {
  evaluate(input: EvaluationInput): Promise<EvaluationOutput>;
}
