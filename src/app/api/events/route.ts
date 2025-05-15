import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Default page size for pagination
const DEFAULT_PAGE_SIZE = 9;

// Get all events with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE));

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    // Parse filter parameters
    const eventType = searchParams.get('eventType');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');

    // Build filter object
    const filters: any = {};

    if (eventType) {
      filters.eventType = eventType;
    }

    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by date range
    if (startDate || endDate) {
      filters.date = {};

      if (startDate) {
        filters.date.gte = new Date(startDate);
      }

      if (endDate) {
        filters.date.lte = new Date(endDate);
      }
    }

    // Filter by status (upcoming/past)
    if (status) {
      const now = new Date();

      if (status === 'upcoming') {
        filters.date = { gte: now };
      } else if (status === 'past') {
        filters.date = { lt: now };
      }
    } else {
      // Default to upcoming events if no status is specified
      filters.date = { gte: new Date() };
    }

    // Get total count for pagination
    const totalCount = await prisma.event.count({
      where: filters,
    });

    // Get events with pagination and filters
    const events = await prisma.event.findMany({
      where: filters,
      orderBy: {
        date: 'asc',
      },
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
