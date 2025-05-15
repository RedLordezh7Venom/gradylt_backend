import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    
    // Get event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if student is logged in
    const studentId = cookies().get('studentId')?.value;
    let isRegistered = false;

    if (studentId) {
      // Check if student is registered for this event
      const registration = await prisma.eventRegistration.findFirst({
        where: {
          eventId,
          studentId,
        },
      });

      isRegistered = !!registration;
    }

    // Get registration count
    const registrationCount = await prisma.eventRegistration.count({
      where: { eventId },
    });

    return NextResponse.json({
      event,
      isRegistered,
      registrationCount,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
