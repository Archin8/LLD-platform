import { Rule, EvaluationInput, RuleResult } from './Rule';

export class ResponsibilityClarityRule implements Rule {
  id = 'responsibility-clarity-rule';

  check(input: EvaluationInput): RuleResult {
    const { submission } = input;
    const classes = submission.classes || [];

    if (classes.length === 0) {
      return {
        ruleId: this.id,
        passed: false,
        severity: 'warning',
        message: 'No classes to check responsibilities for.',
      };
    }

    const missingOrVague: string[] = [];
    const overloadedResponsibilities: string[] = [];

    for (const c of classes) {
      const resp = (c.responsibility || '').trim();
      if (!resp || resp.length < 10) {
        missingOrVague.push(c.name || 'Unnamed Class');
        continue;
      }

      // Check for overly broad duties (multiple 'and' / 'also' / 'as well as')
      const lower = resp.toLowerCase();
      const matches = lower.match(/\b(and|also|as well as|handles all|manages everything)\b/g);
      if (matches && matches.length >= 2) {
        overloadedResponsibilities.push(c.name);
      }
    }

    if (missingOrVague.length > 0) {
      return {
        ruleId: this.id,
        passed: false,
        severity: 'warning',
        message: `Classes with missing or vague responsibilities: ${missingOrVague.join(', ')}.`,
        suggestion: 'Provide a concise 1-2 sentence description explaining the single primary duty of each class.',
      };
    }

    if (overloadedResponsibilities.length > 0) {
      return {
        ruleId: this.id,
        passed: false,
        severity: 'warning',
        message: `Potential Single Responsibility Principle (SRP) violation in: ${overloadedResponsibilities.join(', ')}. Responsibilities combine multiple distinct duties.`,
        suggestion: 'Split classes that handle multiple unrelated responsibilities (e.g. data persistence + business logic) into separate components.',
      };
    }

    return {
      ruleId: this.id,
      passed: true,
      strength: 'All classes have clear, well-defined single responsibilities.',
      message: 'Clear responsibilities across all classes.',
    };
  }
}
