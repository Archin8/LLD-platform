import { Rule, EvaluationInput, RuleResult } from './Rule';

export class ClassCountRule implements Rule {
  id = 'class-count-rule';

  check(input: EvaluationInput): RuleResult {
    const { problem, submission } = input;
    const classCount = submission.classes ? submission.classes.length : 0;

    if (classCount === 0) {
      return {
        ruleId: this.id,
        passed: false,
        severity: 'critical',
        message: 'No classes provided in the submission.',
        suggestion: 'Decompose your solution into classes/interfaces to model the domain entity responsibilities.',
      };
    }

    let minExpected = 2;
    if (problem.difficulty === 'MEDIUM') minExpected = 3;
    if (problem.difficulty === 'HARD') minExpected = 4;

    if (classCount < minExpected) {
      return {
        ruleId: this.id,
        passed: false,
        severity: 'warning',
        message: `Design has only ${classCount} class(es), which is below the expected minimum of ${minExpected} for a ${problem.difficulty} problem like "${problem.title}".`,
        suggestion: `Break down monolithic logic into smaller, dedicated classes (e.g. separates entities, controllers, and strategy objects).`,
      };
    }

    return {
      ruleId: this.id,
      passed: true,
      strength: `Good structural decomposition with ${classCount} classes/interfaces defined for ${problem.difficulty} complexity.`,
      message: `Sufficient class count (${classCount}).`,
    };
  }
}
