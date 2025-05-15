import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Get all jobs for the logged-in employer
export async function GET(request: NextRequest) {
  try {
    // Get employer ID from cookie
    const employerId = cookies().get('employerId')?.value;

    if (!employerId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get jobs for this employer
    const jobs = await prisma.job.findMany({
      where: {
        employerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new job
export async function POST(request: NextRequest) {
  try {
    // Get employer ID from cookie
    const employerId = cookies().get('employerId')?.value;

    if (!employerId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if employer exists
    const employer = await prisma.employer.findUnique({
      where: { id: employerId },
      include: { jobs: true },
    });

    if (!employer) {
      return NextResponse.json(
        { message: 'Employer not found' },
        { status: 404 }
      );
    }

    // Check if employer has reached the job posting limit (5)
    if (employer.jobs.length >= 5) {
      return NextResponse.json(
        { message: 'You have reached the maximum limit of 5 job postings' },
        { status: 403 }
      );
    }

    // Get job data from request
    const {
      title,
      description,
      type,
      location,
      stipend,
      duration,
      applyLink,
      isRemote,
      isPaid,
      isShortTerm,
      requiredDegree
    } = await request.json();

    // Validate required fields
    if (!title || !description || !type || !location || !stipend || !duration || !applyLink) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        type,
        location,
        stipend,
        duration,
        applyLink,
        isRemote: isRemote || false,
        isPaid: isPaid !== false, // Default to true if not explicitly set to false
        isShortTerm: isShortTerm || false,
        requiredDegree: requiredDegree || null,
        employerId,
      },
    });

    return NextResponse.json(
      {
        message: 'Job posted successfully',
        job,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
