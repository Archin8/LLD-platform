import { Evaluator, EvaluationInput, EvaluationOutput } from './Evaluator';
import { RuleBasedEvaluator } from './RuleBasedEvaluator';
import { FeedbackIssue } from '../models/FeedbackResult';

export class CompositeEvaluator implements Evaluator {
  private evaluators: Evaluator[];

  constructor(evaluators?: Evaluator[]) {
    // Defaults to RuleBasedEvaluator. Future evaluators (e.g. LLMEvaluator) can be added to this array.
    this.evaluators = evaluators || [new RuleBasedEvaluator()];
  }

  async evaluate(input: EvaluationInput): Promise<EvaluationOutput> {
    const results: EvaluationOutput[] = [];

    for (const evaluator of this.evaluators) {
      try {
        const res = await evaluator.evaluate(input);
        results.push(res);
      } catch (err) {
        console.warn('Evaluator failed during execution:', err);
      }
    }

    if (results.length === 0) {
      throw new Error('All evaluators failed to process the submission.');
    }

    if (results.length === 1) {
      return {
        ...results[0],
        evaluatorType: 'composite',
      };
    }

    // Merge multiple evaluator outputs
    let totalScore = 0;
    const allStrengths: string[] = [];
    const allIssues: FeedbackIssue[] = [];
    const allSuggestions: string[] = [];

    for (const res of results) {
      totalScore += res.score;
      allStrengths.push(...res.strengths);
      allIssues.push(...res.issues);
      allSuggestions.push(...res.suggestions);
    }

    const avgScore = Math.round(totalScore / results.length);

    return {
      score: avgScore,
      strengths: Array.from(new Set(allStrengths)),
      issues: allIssues,
      suggestions: Array.from(new Set(allSuggestions)),
      evaluatorType: 'composite',
      createdAt: new Date(),
    };
  }
}
