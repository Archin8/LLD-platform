import { Evaluator, EvaluationInput, EvaluationOutput } from './Evaluator';

/**
 * LLMEvaluator (Stub Implementation)
 * 
 * Demonstrates the extensibility of the evaluation pipeline.
 * In a future phase, an external LLM API (e.g. Anthropic Claude, OpenAI GPT-4)
 * can be wired here without modifying the API routes, DB models, or frontend UI.
 */
export class LLMEvaluator implements Evaluator {
  async evaluate(input: EvaluationInput): Promise<EvaluationOutput> {
    // =========================================================================
    // FUTURE EXTENSION POINT:
    // 1. Construct prompt using input.problem (description, requirements) and
    //    input.submission (classes, relationships, rationale).
    // 2. Call external API: const response = await fetch("https://api.anthropic.com/v1/messages", ...);
    // 3. Parse JSON response into structured EvaluationOutput.
    // =========================================================================

    throw new Error(
      'LLMEvaluator is not implemented yet. External LLM API is disabled in this prototype.'
    );
  }
}
