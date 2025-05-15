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
    const isPartner = searchParams.get('isPartner');

    // Build filter object
    const filters: any = {};

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isPartner !== null) {
      filters.isPartner = isPartner === 'true';
    }

    // Get total count for pagination
    const totalCount = await prisma.university.count({
      where: filters,
    });

    // Get universities with pagination and filters
    const universities = await prisma.university.findMany({
      where: filters,
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
      skip,
      take: pageSize,
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      universities,
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
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new university
export async function POST(request: NextRequest) {
  try {
    // Get admin ID from cookie
    const adminId = cookies().get('adminId')?.value;

    if (!adminId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.location) {
      return NextResponse.json(
        { message: 'Name and location are required' },
        { status: 400 }
      );
    }

    // Create university
    const university = await prisma.university.create({
      data,
    });

    return NextResponse.json(
      {
        message: 'University created successfully',
        university,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating university:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
