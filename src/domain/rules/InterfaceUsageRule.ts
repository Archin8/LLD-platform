import { Rule, EvaluationInput, RuleResult } from './Rule';

export class InterfaceUsageRule implements Rule {
  id = 'interface-usage-rule';

  check(input: EvaluationInput): RuleResult {
    const { problem, submission } = input;
    const requiredAbstractions = problem.requiresAbstraction || [];
    const classes = submission.classes || [];

    if (requiredAbstractions.length === 0) {
      // Problem does not explicitly require specific abstractions, check general interface presence if design is large
      const hasInterface = classes.some(c => c.type === 'interface' || c.type === 'abstract_class');
      if (classes.length >= 4 && !hasInterface) {
        return {
          ruleId: this.id,
          passed: false,
          severity: 'info',
          message: 'The design contains 4 or more classes but defines no interfaces or abstract classes.',
          suggestion: 'Consider introducing interfaces or abstract classes to decouple concrete implementations and support the Open/Closed Principle.',
        };
      }

      return {
        ruleId: this.id,
        passed: true,
        strength: hasInterface ? 'Interfaces / abstractions defined appropriately.' : 'Design structure is clean.',
        message: 'Interface usage check passed.',
      };
    }

    // Problem requires specific abstractions (e.g. "pricing strategy", "dispatch strategy")
    const missingAbstractions: string[] = [];

    for (const req of requiredAbstractions) {
      const keywords = req.toLowerCase().split(' ');
      const matched = classes.some(c => {
        const nameLower = c.name.toLowerCase();
        const respLower = (c.responsibility || '').toLowerCase();
        const isInterface = c.type === 'interface' || c.type === 'abstract_class';

        const matchesKeyword = keywords.some(kw => nameLower.includes(kw) || respLower.includes(kw));
        return matchesKeyword || (isInterface && keywords.some(kw => nameLower.includes(kw) || respLower.includes(kw)));
      });

      if (!matched) {
        missingAbstractions.push(req);
      }
    }

    if (missingAbstractions.length > 0) {
      return {
        ruleId: this.id,
        passed: false,
        severity: 'warning',
        message: `Missing required abstraction(s): ${missingAbstractions.join(', ')}.`,
        suggestion: `Introduce interfaces or abstract classes for pluggable components (e.g. Strategy pattern for "${missingAbstractions.join(', ')}").`,
      };
    }

    return {
      ruleId: this.id,
      passed: true,
      strength: `Successfully implemented required abstraction(s): ${requiredAbstractions.join(', ')}.`,
      message: 'Required abstractions implemented.',
    };
  }
}
