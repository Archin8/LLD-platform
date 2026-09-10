import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attempt = await db.attempt.findUnique({
      where: { id },
      include: {
        problem: true,
        submission: {
          include: {
            feedback: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    return NextResponse.json(attempt);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch attempt', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { classes, relationships, rationale } = body;

    const existingAttempt = await db.attempt.findUnique({
      where: { id },
      include: { submission: true },
    });

    if (!existingAttempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    // Upsert or update submission
    const updatedAttempt = await db.attempt.update({
      where: { id },
      data: {
        status: existingAttempt.status === 'COMPLETED' ? 'DRAFT' : existingAttempt.status,
        submission: {
          upsert: {
            create: {
              classes: classes || [],
              relationships: relationships || [],
              rationale: rationale || '',
            },
            update: {
              classes: classes !== undefined ? classes : undefined,
              relationships: relationships !== undefined ? relationships : undefined,
              rationale: rationale !== undefined ? rationale : undefined,
            },
          },
        },
      },
      include: {
        problem: true,
        submission: {
          include: {
            feedback: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAttempt);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update attempt draft', details: error.message },
      { status: 500 }
    );
  }
}
