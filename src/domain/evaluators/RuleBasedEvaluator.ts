import { Evaluator, EvaluationInput, EvaluationOutput } from './Evaluator';
import { Rule } from '../rules/Rule';
import { ClassCountRule } from '../rules/ClassCountRule';
import { ResponsibilityClarityRule } from '../rules/ResponsibilityClarityRule';
import { GodClassRule } from '../rules/GodClassRule';
import { InterfaceUsageRule } from '../rules/InterfaceUsageRule';
import { RelationshipRule } from '../rules/RelationshipRule';
import { FeedbackIssue } from '../models/FeedbackResult';

export class RuleBasedEvaluator implements Evaluator {
  private rules: Rule[];

  constructor(customRules?: Rule[]) {
    this.rules = customRules || [
      new ClassCountRule(),
      new ResponsibilityClarityRule(),
      new GodClassRule(),
      new InterfaceUsageRule(),
      new RelationshipRule(),
    ];
  }

  async evaluate(input: EvaluationInput): Promise<EvaluationOutput> {
    let score = 100;
    const strengths: string[] = [];
    const issues: FeedbackIssue[] = [];
    const suggestions: string[] = [];

    for (const rule of this.rules) {
      const result = rule.check(input);

      if (result.passed) {
        if (result.strength) {
          strengths.push(result.strength);
        }
      } else {
        const severity = result.severity || 'warning';
        issues.push({
          severity,
          message: result.message,
          ruleId: result.ruleId,
        });

        if (result.suggestion) {
          suggestions.push(result.suggestion);
        }

        // Apply score penalty based on severity
        if (severity === 'critical') score -= 25;
        else if (severity === 'warning') score -= 15;
        else if (severity === 'info') score -= 5;
      }
    }

    // Ensure score bounds [0, 100]
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      strengths: strengths.length > 0 ? strengths : ['Submission submitted for evaluation.'],
      issues,
      suggestions: suggestions.length > 0 ? suggestions : ['Review object design principles and refine component interactions.'],
      evaluatorType: 'rule-based',
      createdAt: new Date(),
    };
  }
}
