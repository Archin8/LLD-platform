import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const problem = await db.problem.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch problem detail', details: error.message },
      { status: 500 }
    );
  }
}
