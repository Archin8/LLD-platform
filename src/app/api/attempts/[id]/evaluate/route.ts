import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CompositeEvaluator } from '@/domain/evaluators/CompositeEvaluator';
import { EvaluationInput } from '@/domain/evaluators/Evaluator';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // 1. Fetch attempt and check existence
    const attempt = await db.attempt.findUnique({
      where: { id },
      include: {
        problem: true,
        submission: true,
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    let bodyData: any = {};
    try {
      bodyData = await request.json();
    } catch {
      // Empty body is okay if submission is already saved in DB
    }

    // 2. Optionally update submission content if passed in body
    let submission = attempt.submission;
    if (bodyData.classes || bodyData.relationships || bodyData.rationale !== undefined) {
      submission = await db.submission.upsert({
        where: { attemptId: id },
        create: {
          attemptId: id,
          classes: bodyData.classes || [],
          relationships: bodyData.relationships || [],
          rationale: bodyData.rationale || '',
        },
        update: {
          classes: bodyData.classes !== undefined ? bodyData.classes : undefined,
          relationships: bodyData.relationships !== undefined ? bodyData.relationships : undefined,
          rationale: bodyData.rationale !== undefined ? bodyData.rationale : undefined,
        },
      });
    }

    if (!submission) {
      return NextResponse.json(
        { error: 'No submission found for this attempt to evaluate.' },
        { status: 400 }
      );
    }

    // 3. Mark attempt status as EVALUATING
    await db.attempt.update({
      where: { id },
      data: { status: 'EVALUATING' },
    });

    // 4. Validate submission shape (e.g. empty submission check)
    const classesList = (submission.classes as any[]) || [];
    if (classesList.length === 0) {
      // Set status to FAILED and return error response
      await db.attempt.update({
        where: { id },
        data: { status: 'FAILED' },
      });

      return NextResponse.json(
        {
          error: 'Evaluation failed: Submission contains no classes. Please add at least one class before submitting.',
          status: 'FAILED',
        },
        { status: 400 }
      );
    }

    // 5. Execute CompositeEvaluator
    const evaluator = new CompositeEvaluator();
    const evaluationInput: EvaluationInput = {
      problem: {
        id: attempt.problem.id,
        title: attempt.problem.title,
        slug: attempt.problem.slug,
        description: attempt.problem.description,
        requirements: attempt.problem.requirements,
        difficulty: attempt.problem.difficulty as any,
        requiresAbstraction: attempt.problem.requiresAbstraction,
      },
      submission: {
        id: submission.id,
        attemptId: submission.attemptId,
        classes: submission.classes as any,
        relationships: submission.relationships as any,
        rationale: submission.rationale,
      },
    };

    const evaluationResult = await evaluator.evaluate(evaluationInput);

    // 6. Persist Feedback & update Attempt status to COMPLETED
    const feedback = await db.feedback.upsert({
      where: { submissionId: submission.id },
      create: {
        submissionId: submission.id,
        score: evaluationResult.score,
        strengths: evaluationResult.strengths,
        issues: evaluationResult.issues as any,
        suggestions: evaluationResult.suggestions,
        evaluatorType: evaluationResult.evaluatorType,
      },
      update: {
        score: evaluationResult.score,
        strengths: evaluationResult.strengths,
        issues: evaluationResult.issues as any,
        suggestions: evaluationResult.suggestions,
        evaluatorType: evaluationResult.evaluatorType,
      },
    });

    const updatedAttempt = await db.attempt.update({
      where: { id },
      data: { status: 'COMPLETED' },
      include: {
        problem: true,
        submission: {
          include: {
            feedback: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Evaluation completed successfully.',
      attempt: updatedAttempt,
      feedback,
    });
  } catch (error: any) {
    // 7. Error fallback -> set status = FAILED
    await db.attempt.update({
      where: { id },
      data: { status: 'FAILED' },
    }).catch(() => {});

    return NextResponse.json(
      {
        error: 'Evaluation error occurred.',
        details: error.message || String(error),
        status: 'FAILED',
      },
      { status: 500 }
    );
  }
}
