import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Get university details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get admin ID from cookie
    const adminId = cookies().get('adminId')?.value;

    if (!adminId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const universityId = params.id;

    // Get university details
    const university = await prisma.university.findUnique({
      where: { id: universityId },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (!university) {
      return NextResponse.json(
        { message: 'University not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ university }, { status: 200 });
  } catch (error) {
    console.error('Error fetching university:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update university
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get admin ID from cookie
    const adminId = cookies().get('adminId')?.value;

    if (!adminId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const universityId = params.id;
    const data = await request.json();

    // Check if university exists
    const existingUniversity = await prisma.university.findUnique({
      where: { id: universityId },
    });

    if (!existingUniversity) {
      return NextResponse.json(
        { message: 'University not found' },
        { status: 404 }
      );
    }

    // Update university
    const university = await prisma.university.update({
      where: { id: universityId },
      data,
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'University updated successfully',
      university
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating university:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete university
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get admin ID from cookie
    const adminId = cookies().get('adminId')?.value;

    if (!adminId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const universityId = params.id;

    // Check if university exists
    const existingUniversity = await prisma.university.findUnique({
      where: { id: universityId },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (!existingUniversity) {
      return NextResponse.json(
        { message: 'University not found' },
        { status: 404 }
      );
    }

    // Check if university has students
    if (existingUniversity._count.students > 0) {
      return NextResponse.json(
        { message: 'Cannot delete university with associated students' },
        { status: 400 }
      );
    }

    // Delete university
    await prisma.university.delete({
      where: { id: universityId },
    });

    return NextResponse.json({
      message: 'University deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting university:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
