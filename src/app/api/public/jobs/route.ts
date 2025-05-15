import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Default page size for pagination
const DEFAULT_PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE));
    
    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;
    
    // Parse filter parameters
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const requiredDegree = searchParams.get('degree');
    const isRemote = searchParams.get('remote') === 'true';
    const isPaid = searchParams.get('paid') === 'true';
    const isShortTerm = searchParams.get('shortTerm') === 'true';
    
    // Build filter object
    const filters: any = {};
    
    if (type) {
      filters.type = type;
    }
    
    if (location) {
      filters.location = {
        contains: location,
        mode: 'insensitive',
      };
    }
    
    if (requiredDegree) {
      filters.requiredDegree = {
        contains: requiredDegree,
        mode: 'insensitive',
      };
    }
    
    // Only add boolean filters if they are explicitly set in the query
    if (searchParams.has('remote')) {
      filters.isRemote = isRemote;
    }
    
    if (searchParams.has('paid')) {
      filters.isPaid = isPaid;
    }
    
    if (searchParams.has('shortTerm')) {
      filters.isShortTerm = isShortTerm;
    }
    
    // Get total count for pagination
    const totalCount = await prisma.job.count({
      where: filters,
    });
    
    // Get jobs with pagination and filters
    const jobs = await prisma.job.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
      include: {
        employer: {
          select: {
            name: true,
            company: true,
          },
        },
      },
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    return NextResponse.json({
      jobs,
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
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
