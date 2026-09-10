import { Rule, EvaluationInput, RuleResult } from './Rule';

export class GodClassRule implements Rule {
  id = 'god-class-rule';

  check(input: EvaluationInput): RuleResult {
    const { submission } = input;
    const classes = submission.classes || [];

    if (classes.length === 0) {
      return {
        ruleId: this.id,
        passed: true,
        message: 'No classes to check for God Class antipattern.',
      };
    }

    const godClasses: { name: string; methodsCount: number; fieldsCount: number }[] = [];

    for (const c of classes) {
      const methodsCount = c.methods ? c.methods.length : 0;
      const fieldsCount = c.fields ? c.fields.length : 0;

      if (methodsCount >= 8 || fieldsCount >= 8 || (methodsCount + fieldsCount >= 12)) {
        godClasses.push({ name: c.name, methodsCount, fieldsCount });
      }
    }

    if (godClasses.length > 0) {
      const names = godClasses.map(g => `${g.name} (${g.methodsCount} methods, ${g.fieldsCount} fields)`).join(', ');
      return {
        ruleId: this.id,
        passed: false,
        severity: 'critical',
        message: `Potential God Class antipattern detected: ${names}.`,
        suggestion: 'Extract distinct behaviors or state sub-objects out of large controller/manager classes into specialized helper strategies or value objects.',
      };
    }

    return {
      ruleId: this.id,
      passed: true,
      strength: 'Class sizing is balanced without bloat or God Class antipatterns.',
      message: 'No God Classes detected.',
    };
  }
}
