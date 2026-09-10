import { Rule, EvaluationInput, RuleResult } from './Rule';

export class RelationshipRule implements Rule {
  id = 'relationship-rule';

  check(input: EvaluationInput): RuleResult {
    const { submission } = input;
    const classes = submission.classes || [];
    const relationships = submission.relationships || [];

    if (classes.length <= 1) {
      return {
        ruleId: this.id,
        passed: true,
        message: 'Single class design; skipping relationship checks.',
      };
    }

    const classNames = new Set(classes.map(c => c.name));
    const invalidReferences: string[] = [];

    const connectedClasses = new Set<string>();

    for (const rel of relationships) {
      if (!classNames.has(rel.from)) {
        invalidReferences.push(`Unknown class "${rel.from}" in relationship source.`);
      } else {
        connectedClasses.add(rel.from);
      }

      if (!classNames.has(rel.to)) {
        invalidReferences.push(`Unknown class "${rel.to}" in relationship target.`);
      } else {
        connectedClasses.add(rel.to);
      }
    }

    if (invalidReferences.length > 0) {
      return {
        ruleId: this.id,
        passed: false,
        severity: 'critical',
        message: `Invalid relationship references detected: ${invalidReferences.join(' ')}`,
        suggestion: 'Ensure all relationship sources ("from") and targets ("to") match declared class names exactly.',
      };
    }

    // Find isolated classes
    const isolatedClasses = classes.filter(c => !connectedClasses.has(c.name)).map(c => c.name);

    if (isolatedClasses.length > 0) {
      return {
        ruleId: this.id,
        passed: false,
        severity: 'warning',
        message: `Isolated class(es) with no connections: ${isolatedClasses.join(', ')}.`,
        suggestion: 'Connect isolated classes to the design using appropriate relationship types (composes, uses, implements, inherits).',
      };
    }

    return {
      ruleId: this.id,
      passed: true,
      strength: 'All classes are cleanly connected with valid domain relationships.',
      message: 'Relationships are valid and connected.',
    };
  }
}
