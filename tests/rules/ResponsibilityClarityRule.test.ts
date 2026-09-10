import { describe, it, expect } from 'vitest';
import { ResponsibilityClarityRule } from '@/domain/rules/ResponsibilityClarityRule';
import { Problem } from '@/domain/models/Problem';
import { Submission } from '@/domain/models/Submission';

describe('ResponsibilityClarityRule', () => {
  const rule = new ResponsibilityClarityRule();

  const mockProblem: Problem = {
    id: 'p1',
    title: 'Elevator System',
    slug: 'elevator-system',
    description: 'Elevator system design',
    requirements: [],
    difficulty: 'HARD',
  };

  it('fails when a class has vague or missing responsibility', () => {
    const submission: Submission = {
      classes: [
        { name: 'Elevator', type: 'class', responsibility: 'Short' },
      ],
      relationships: [],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(false);
    expect(result.severity).toBe('warning');
    expect(result.message).toContain('missing or vague responsibilities');
  });

  it('flags potential SRP violation when responsibility combines multiple duties', () => {
    const submission: Submission = {
      classes: [
        {
          name: 'ElevatorController',
          type: 'class',
          responsibility: 'Controls elevator movement and handles all user input and also manages floor display UI and as well as database logging.',
        },
      ],
      relationships: [],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(false);
    expect(result.message).toContain('Single Responsibility Principle (SRP) violation');
  });

  it('passes when responsibilities are clear and concise', () => {
    const submission: Submission = {
      classes: [
        {
          name: 'ElevatorController',
          type: 'class',
          responsibility: 'Coordinates movement requests across the elevator fleet.',
        },
      ],
      relationships: [],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(true);
    expect(result.strength).toContain('clear, well-defined single responsibilities');
  });
});
