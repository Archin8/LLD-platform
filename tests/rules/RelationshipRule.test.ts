import { describe, it, expect } from 'vitest';
import { RelationshipRule } from '@/domain/rules/RelationshipRule';
import { Problem } from '@/domain/models/Problem';
import { Submission } from '@/domain/models/Submission';

describe('RelationshipRule', () => {
  const rule = new RelationshipRule();

  const mockProblem: Problem = {
    id: 'p1',
    title: 'Vending Machine',
    slug: 'vending-machine',
    description: 'Vending machine design',
    requirements: [],
    difficulty: 'EASY',
  };

  it('fails with critical severity when relationship references unlisted class name', () => {
    const submission: Submission = {
      classes: [
        { name: 'VendingMachine', type: 'class', responsibility: 'Manages state.' },
        { name: 'Item', type: 'class', responsibility: 'Product entity.' },
      ],
      relationships: [
        { from: 'VendingMachine', to: 'NonExistentClass', kind: 'uses' },
      ],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(false);
    expect(result.severity).toBe('critical');
    expect(result.message).toContain('Invalid relationship references detected');
  });

  it('flags isolated classes in a multi-class design', () => {
    const submission: Submission = {
      classes: [
        { name: 'VendingMachine', type: 'class', responsibility: 'Manages state.' },
        { name: 'Item', type: 'class', responsibility: 'Product entity.' },
        { name: 'IsolatedClass', type: 'class', responsibility: 'Has no connections.' },
      ],
      relationships: [
        { from: 'VendingMachine', to: 'Item', kind: 'composes' },
      ],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(false);
    expect(result.severity).toBe('warning');
    expect(result.message).toContain('Isolated class(es) with no connections: IsolatedClass');
  });

  it('passes when all relationships are valid and connected', () => {
    const submission: Submission = {
      classes: [
        { name: 'VendingMachine', type: 'class', responsibility: 'Manages state.' },
        { name: 'Item', type: 'class', responsibility: 'Product entity.' },
      ],
      relationships: [
        { from: 'VendingMachine', to: 'Item', kind: 'composes' },
      ],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(true);
    expect(result.strength).toContain('cleanly connected');
  });
});
