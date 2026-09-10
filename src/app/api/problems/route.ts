import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const problems = await db.problem.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
        requiresAbstraction: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(problems);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch problems', details: error.message },
      { status: 500 }
    );
  }
}
