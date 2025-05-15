import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get all visible partner universities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filter parameters
    const onlyPartners = searchParams.get('partners') !== 'false';
    
    // Build filter object
    const filters: any = {
      isVisible: true,
    };
    
    if (onlyPartners) {
      filters.isPartner = true;
    }
    
    // Get universities with filters
    const universities = await prisma.university.findMany({
      where: filters,
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });
    
    return NextResponse.json({
      universities,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
