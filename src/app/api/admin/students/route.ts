import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Default page size for pagination
const DEFAULT_PAGE_SIZE = 10;

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

    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE));
    
    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;
    
    // Parse filter parameters
    const search = searchParams.get('search');
    const verified = searchParams.get('verified');
    const universityId = searchParams.get('universityId');
    
    // Build filter object
    const filters: any = {};
    
    if (search) {
      filters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { college: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (verified !== null) {
      filters.isVerified = verified === 'true';
    }
    
    if (universityId) {
      filters.universityId = universityId;
    }
    
    // Get total count for pagination
    const totalCount = await prisma.student.count({
      where: filters,
    });
    
    // Get students with pagination and filters
    const students = await prisma.student.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
      include: {
        university: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    return NextResponse.json({
      students,
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
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
