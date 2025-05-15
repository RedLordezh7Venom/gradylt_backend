import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get admin ID from cookie
    const adminId = cookies().get('adminId')?.value;

    if (!adminId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get admin to verify
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get counts for all entities
    const [
      studentCount,
      employerCount,
      jobCount,
      pendingJobCount,
      eventCount,
      universityCount,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.employer.count(),
      prisma.job.count(),
      prisma.job.count({
        where: { status: 'PENDING' },
      }),
      prisma.event.count(),
      prisma.university.count(),
    ]);

    return NextResponse.json({
      studentCount,
      employerCount,
      jobCount,
      pendingJobCount,
      eventCount,
      universityCount,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
