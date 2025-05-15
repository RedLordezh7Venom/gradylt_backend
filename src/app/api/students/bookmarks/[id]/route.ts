import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Check if a job is bookmarked
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get student ID from cookie
    const studentId = cookies().get('studentId')?.value;

    if (!studentId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const jobId = params.id;
    
    // Check if job is bookmarked
    const bookmark = await prisma.bookmarkedJob.findUnique({
      where: {
        studentId_jobId: {
          studentId,
          jobId,
        },
      },
    });

    return NextResponse.json({
      isBookmarked: !!bookmark,
      bookmark,
    }, { status: 200 });
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Remove a bookmark
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get student ID from cookie
    const studentId = cookies().get('studentId')?.value;

    if (!studentId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const jobId = params.id;
    
    // Check if bookmark exists
    const bookmark = await prisma.bookmarkedJob.findUnique({
      where: {
        studentId_jobId: {
          studentId,
          jobId,
        },
      },
    });

    if (!bookmark) {
      return NextResponse.json(
        { message: 'Bookmark not found' },
        { status: 404 }
      );
    }

    // Delete bookmark
    await prisma.bookmarkedJob.delete({
      where: {
        studentId_jobId: {
          studentId,
          jobId,
        },
      },
    });

    return NextResponse.json({
      message: 'Bookmark removed successfully',
    }, { status: 200 });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
