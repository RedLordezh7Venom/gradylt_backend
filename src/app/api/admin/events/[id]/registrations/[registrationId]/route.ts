import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Delete a registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; registrationId: string } }
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

    const { registrationId } = params;
    
    // Check if registration exists
    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return NextResponse.json(
        { message: 'Registration not found' },
        { status: 404 }
      );
    }

    // Delete registration
    await prisma.eventRegistration.delete({
      where: { id: registrationId },
    });

    return NextResponse.json({ 
      message: 'Registration deleted successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
