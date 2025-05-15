import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Default page size for pagination
const DEFAULT_PAGE_SIZE = 10;

// Get all events with pagination and filtering for admin
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
    const eventType = searchParams.get('eventType');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // Build filter object
    const filters: any = {};
    
    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (eventType) {
      filters.eventType = eventType;
    }
    
    // Filter by status (upcoming/past)
    if (status) {
      const now = new Date();
      
      if (status === 'upcoming') {
        filters.date = { gte: now };
      } else if (status === 'past') {
        filters.date = { lt: now };
      }
    }
    
    // Build sort object
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    // Get total count for pagination
    const totalCount = await prisma.event.count({
      where: filters,
    });
    
    // Get events with pagination and filters
    const events = await prisma.event.findMany({
      where: filters,
      orderBy,
      skip,
      take: pageSize,
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    // Get all event types for filtering
    const eventTypes = Object.values(prisma.eventType);
    
    return NextResponse.json({
      events,
      eventTypes,
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
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new event
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
    if (!data.title || !data.description || !data.date || !data.location) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse date strings to Date objects
    if (data.date) {
      data.date = new Date(data.date);
    }
    
    if (data.endDate) {
      data.endDate = new Date(data.endDate);
    }

    // Create event
    const event = await prisma.event.create({
      data,
    });

    return NextResponse.json(
      {
        message: 'Event created successfully',
        event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
