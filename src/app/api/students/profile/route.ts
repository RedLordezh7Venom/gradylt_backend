import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get student ID from cookie
    const studentId = cookies().get('studentId')?.value;

    if (!studentId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get student profile
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        degree: true,
        year: true,
        interests: true,
        cvPath: true,
        eventRegistrations: {
          include: {
            event: true,
          },
          orderBy: {
            event: {
              date: 'asc',
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ student }, { status: 200 });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
