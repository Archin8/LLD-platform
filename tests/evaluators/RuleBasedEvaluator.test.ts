import { describe, it, expect } from 'vitest';
import { RuleBasedEvaluator } from '@/domain/evaluators/RuleBasedEvaluator';
import { CompositeEvaluator } from '@/domain/evaluators/CompositeEvaluator';
import { Problem } from '@/domain/models/Problem';
import { Submission } from '@/domain/models/Submission';

describe('RuleBasedEvaluator & CompositeEvaluator Integration', () => {
  const evaluator = new RuleBasedEvaluator();
  const composite = new CompositeEvaluator([evaluator]);

  const mockProblem: Problem = {
    id: 'p1',
    title: 'Parking Lot Management System',
    slug: 'parking-lot',
    description: 'Design a parking lot management system',
    requirements: ['Support multiple spot sizes', 'Pluggable pricing'],
    difficulty: 'MEDIUM',
    requiresAbstraction: ['pricing strategy'],
  };

  it('evaluates a clean submission and awards a high score (90-100)', async () => {
    const cleanSubmission: Submission = {
      classes: [
        {
          name: 'ParkingLot',
          type: 'class',
          responsibility: 'Coordinates parking spot reservations and entry gates.',
          fields: ['id: String'],
          methods: ['parkVehicle(v: Vehicle): Boolean'],
        },
        {
          name: 'ParkingSpot',
          type: 'class',
          responsibility: 'Represents a physical parking slot state.',
          fields: ['spotId: String', 'isOccupied: Boolean'],
          methods: ['occupy()', 'vacate()'],
        },
        {
          name: 'IPricingStrategy',
          type: 'interface',
          responsibility: 'Polymorphic interface for pricing strategy calculations.',
          methods: ['calculateFee(durationHours: Number): Number'],
        },
        {
          name: 'HourlyPricingStrategy',
          type: 'class',
          responsibility: 'Calculates parking fees based on hourly rate.',
          methods: ['calculateFee(durationHours: Number): Number'],
        },
      ],
      relationships: [
        { from: 'ParkingLot', to: 'ParkingSpot', kind: 'composes' },
        { from: 'ParkingLot', to: 'IPricingStrategy', kind: 'uses' },
        { from: 'HourlyPricingStrategy', to: 'IPricingStrategy', kind: 'implements' },
      ],
    };

    const output = await composite.evaluate({ problem: mockProblem, submission: cleanSubmission });

    expect(output.score).toBeGreaterThanOrEqual(90);
    expect(output.strengths.length).toBeGreaterThan(0);
    expect(output.issues.length).toBe(0);
    expect(output.evaluatorType).toBe('composite');
  });

  it('deducts score penalties when issues are detected', async () => {
    const flawedSubmission: Submission = {
      classes: [
        {
          name: 'GodParkingManager',
          type: 'class',
          responsibility: 'Handles everything in the parking lot and processes payments and manages gates and prints tickets and logs UI updates and calculates taxes.',
          fields: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9'],
          methods: ['m1()', 'm2()', 'm3()', 'm4()', 'm5()', 'm6()', 'm7()', 'm8()', 'm9()'],
        },
      ],
      relationships: [],
    };

    const output = await evaluator.evaluate({ problem: mockProblem, submission: flawedSubmission });

    expect(output.score).toBeLessThan(70);
    expect(output.issues.length).toBeGreaterThan(0);
    expect(output.issues.some(i => i.ruleId === 'god-class-rule')).toBe(true);
    expect(output.issues.some(i => i.ruleId === 'interface-usage-rule')).toBe(true);
  });
});
