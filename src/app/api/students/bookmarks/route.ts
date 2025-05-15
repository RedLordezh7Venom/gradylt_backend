import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Default page size for pagination
const DEFAULT_PAGE_SIZE = 10;

// Get all bookmarked jobs for the logged-in student
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

    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE));
    
    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;
    
    // Get total count for pagination
    const totalCount = await prisma.bookmarkedJob.count({
      where: {
        studentId,
      },
    });
    
    // Get bookmarked jobs with pagination
    const bookmarkedJobs = await prisma.bookmarkedJob.findMany({
      where: {
        studentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
      include: {
        job: {
          include: {
            employer: {
              select: {
                name: true,
                company: true,
              },
            },
          },
        },
      },
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    return NextResponse.json({
      bookmarkedJobs,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookmarked jobs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Bookmark a job
export async function POST(request: NextRequest) {
  try {
    // Get student ID from cookie
    const studentId = cookies().get('studentId')?.value;

    if (!studentId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jobId } = await request.json();
    
    if (!jobId) {
      return NextResponse.json(
        { message: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if job is already bookmarked
    const existingBookmark = await prisma.bookmarkedJob.findUnique({
      where: {
        studentId_jobId: {
          studentId,
          jobId,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { message: 'Job already bookmarked' },
        { status: 400 }
      );
    }

    // Create bookmark
    const bookmark = await prisma.bookmarkedJob.create({
      data: {
        studentId,
        jobId,
      },
      include: {
        job: {
          include: {
            employer: {
              select: {
                name: true,
                company: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Job bookmarked successfully',
        bookmark,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error bookmarking job:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
