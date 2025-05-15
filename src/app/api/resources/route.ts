import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Default page size for pagination
const DEFAULT_PAGE_SIZE = 12;

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
    const category = searchParams.get('category');
    
    // Build filter object
    const filters: any = {};
    
    if (type) {
      filters.type = type;
    }
    
    if (category) {
      filters.category = category;
    }
    
    // Get total count for pagination
    const totalCount = await prisma.resource.count({
      where: filters,
    });
    
    // Get resources with pagination and filters
    const resources = await prisma.resource.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    // Get unique categories for filtering
    const categories = await prisma.resource.groupBy({
      by: ['category'],
      orderBy: {
        category: 'asc',
      },
    });
    
    // Get unique types for filtering
    const types = await prisma.resource.groupBy({
      by: ['type'],
      orderBy: {
        type: 'asc',
      },
    });
    
    return NextResponse.json({
      resources,
      categories: categories.map(c => c.category),
      types: types.map(t => t.type),
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
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
