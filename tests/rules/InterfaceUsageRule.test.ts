import { describe, it, expect } from 'vitest';
import { InterfaceUsageRule } from '@/domain/rules/InterfaceUsageRule';
import { Problem } from '@/domain/models/Problem';
import { Submission } from '@/domain/models/Submission';

describe('InterfaceUsageRule', () => {
  const rule = new InterfaceUsageRule();

  const mockProblem: Problem = {
    id: 'p1',
    title: 'Parking Lot',
    slug: 'parking-lot',
    description: 'Parking lot problem requiring pricing strategy abstraction',
    requirements: [],
    difficulty: 'MEDIUM',
    requiresAbstraction: ['pricing strategy'],
  };

  it('fails when required abstraction is missing', () => {
    const submission: Submission = {
      classes: [
        { name: 'ParkingLot', type: 'class', responsibility: 'Manages parking slots.' },
        { name: 'Ticket', type: 'class', responsibility: 'Stores ticket metadata.' },
      ],
      relationships: [],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(false);
    expect(result.severity).toBe('warning');
    expect(result.message).toContain('Missing required abstraction(s): pricing strategy');
  });

  it('passes when required abstraction interface is present', () => {
    const submission: Submission = {
      classes: [
        { name: 'ParkingLot', type: 'class', responsibility: 'Manages parking slots.' },
        { name: 'IPricingStrategy', type: 'interface', responsibility: 'Interface for pricing strategy calculations.' },
        { name: 'HourlyPricingStrategy', type: 'class', responsibility: 'Hourly rate pricing strategy.' },
      ],
      relationships: [],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(true);
    expect(result.strength).toContain('Successfully implemented required abstraction(s)');
  });
});
