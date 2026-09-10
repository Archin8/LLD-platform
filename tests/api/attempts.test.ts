import { describe, it, expect } from 'vitest';
import { CompositeEvaluator } from '@/domain/evaluators/CompositeEvaluator';
import { Problem } from '@/domain/models/Problem';
import { Submission } from '@/domain/models/Submission';

describe('API & Evaluation Workflow Error Handling & Retry Tests', () => {
  const mockProblem: Problem = {
    id: 'prob-101',
    title: 'Elevator Control System',
    slug: 'elevator-system',
    description: 'Elevator system design problem',
    requirements: ['Multiple elevators', 'Dispatch strategy'],
    difficulty: 'HARD',
    requiresAbstraction: ['dispatch strategy'],
  };

  it('handles malformed submission gracefully by flagging critical missing class error', async () => {
    const emptySubmission: Submission = {
      classes: [],
      relationships: [],
    };

    const evaluator = new CompositeEvaluator();
    const result = await evaluator.evaluate({ problem: mockProblem, submission: emptySubmission });

    expect(result.score).toBeLessThanOrEqual(50);
    expect(result.issues.some(i => i.severity === 'critical')).toBe(true);
    expect(result.issues.some(i => i.ruleId === 'class-count-rule')).toBe(true);
  });

  it('supports retry workflow when user fixes submission from empty to valid', async () => {
    const evaluator = new CompositeEvaluator();

    // 1. Initial attempt fails
    const initialSubmission: Submission = { classes: [], relationships: [] };
    const failResult = await evaluator.evaluate({ problem: mockProblem, submission: initialSubmission });
    expect(failResult.issues.length).toBeGreaterThan(0);

    // 2. Fixed submission on retry passes
    const fixedSubmission: Submission = {
      classes: [
        { name: 'ElevatorController', type: 'class', responsibility: 'Coordinates elevator calls.', methods: ['callFloor()'] },
        { name: 'IDispatchStrategy', type: 'interface', responsibility: 'Interface for elevator dispatch strategy algorithms.' },
        { name: 'NearestElevatorDispatch', type: 'class', responsibility: 'Dispatches nearest available elevator.', methods: ['selectElevator()'] },
        { name: 'ElevatorCar', type: 'class', responsibility: 'Models single elevator car state.' },
      ],
      relationships: [
        { from: 'ElevatorController', to: 'IDispatchStrategy', kind: 'uses' },
        { from: 'NearestElevatorDispatch', to: 'IDispatchStrategy', kind: 'implements' },
        { from: 'ElevatorController', to: 'ElevatorCar', kind: 'composes' },
      ],
    };

    const successResult = await evaluator.evaluate({ problem: mockProblem, submission: fixedSubmission });
    expect(successResult.score).toBeGreaterThanOrEqual(90);
    expect(successResult.issues.length).toBe(0);
  });
});
