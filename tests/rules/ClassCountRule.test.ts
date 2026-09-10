import { describe, it, expect } from 'vitest';
import { ClassCountRule } from '@/domain/rules/ClassCountRule';
import { Problem } from '@/domain/models/Problem';
import { Submission } from '@/domain/models/Submission';

describe('ClassCountRule', () => {
  const rule = new ClassCountRule();

  const mockProblem: Problem = {
    id: 'p1',
    title: 'Parking Lot',
    slug: 'parking-lot',
    description: 'Design a parking lot',
    requirements: ['Multiple spots'],
    difficulty: 'MEDIUM',
  };

  it('fails when no classes are provided', () => {
    const submission: Submission = { classes: [], relationships: [] };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(false);
    expect(result.severity).toBe('critical');
    expect(result.message).toContain('No classes provided');
  });

  it('fails when class count is below expected minimum for MEDIUM problem', () => {
    const submission: Submission = {
      classes: [
        { name: 'ParkingLot', type: 'class', responsibility: 'Manages everything.' },
      ],
      relationships: [],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(false);
    expect(result.severity).toBe('warning');
    expect(result.message).toContain('below the expected minimum of 3');
  });

  it('passes when sufficient classes are provided', () => {
    const submission: Submission = {
      classes: [
        { name: 'ParkingLot', type: 'class', responsibility: 'Manages parking spots.' },
        { name: 'ParkingSpot', type: 'class', responsibility: 'Represents a single slot.' },
        { name: 'Vehicle', type: 'class', responsibility: 'Represents a vehicle.' },
      ],
      relationships: [],
    };
    const result = rule.check({ problem: mockProblem, submission });

    expect(result.passed).toBe(true);
    expect(result.strength).toContain('Good structural decomposition');
  });
});
