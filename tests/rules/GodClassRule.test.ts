import { describe, it, expect } from 'vitest';
import { GodClassRule } from '@/domain/rules/GodClassRule';
import { Problem } from '@/domain/models/Problem';
import { Submission } from '@/domain/models/Submission';

describe('GodClassRule', () => {
  const rule = new GodClassRule();

  const mockProblem: Problem = {
    id: 'p1',
    title: 'Vending Machine',
    slug: 'vending-machine',
    description: 'Vending machine design',
    requirements: [],
    difficulty: 'EASY',
  };

  it('passes on a balanced class design', () => {
    const submission: Submission = {
      classes: [
        { name: 'VendingMachine', type: 'class', responsibility: 'Manages state.', fields: ['state'], methods: ['setState()', 'dispense()'] },
        { name: 'Item', type: 'class', responsibility: 'Represents inventory item.', fields: ['id', 'price'], methods: ['getPrice()'] },
      ],
      relationships: [],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(true);
    expect(result.strength).toContain('Class sizing is balanced');
  });

  it('fails with critical severity when a class contains excessive methods/fields', () => {
    const submission: Submission = {
      classes: [
        {
          name: 'SuperGodManager',
          type: 'class',
          responsibility: 'Handles everything in the system.',
          fields: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9'],
          methods: ['m1()', 'm2()', 'm3()', 'm4()', 'm5()', 'm6()', 'm7()', 'm8()', 'm9()'],
        },
      ],
      relationships: [],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(false);
    expect(result.severity).toBe('critical');
    expect(result.message).toContain('Potential God Class antipattern detected');
  });
});
