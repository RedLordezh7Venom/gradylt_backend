import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Update university display order
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

    const { universities } = await request.json();
    
    if (!universities || !Array.isArray(universities)) {
      return NextResponse.json(
        { message: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Update display order for each university
    const updatePromises = universities.map((university, index) => {
      return prisma.university.update({
        where: { id: university.id },
        data: { displayOrder: index },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json(
      { message: 'University order updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating university order:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
