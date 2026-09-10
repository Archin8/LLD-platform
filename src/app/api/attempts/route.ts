import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemId } = body;

    if (!problemId) {
      return NextResponse.json({ error: 'problemId is required' }, { status: 400 });
    }

    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Create attempt with initial empty submission draft
    const attempt = await db.attempt.create({
      data: {
        problemId,
        status: 'DRAFT',
        submission: {
          create: {
            classes: [],
            relationships: [],
            rationale: '',
          },
        },
      },
      include: {
        problem: true,
        submission: true,
      },
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create attempt', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');

    const whereClause = problemId ? { problemId } : {};

    const attempts = await db.attempt.findMany({
      where: whereClause,
      include: {
        problem: {
          select: { id: true, title: true, difficulty: true, slug: true },
        },
        submission: {
          include: {
            feedback: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(attempts);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to list attempts', details: error.message },
      { status: 500 }
    );
  }
}
