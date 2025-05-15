import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get student ID from cookie
    const studentId = cookies().get('studentId')?.value;

    if (!studentId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get event ID from request
    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { message: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event has capacity limit and if it's reached
    if (event.capacity && event.registrations.length >= event.capacity) {
      return NextResponse.json(
        { message: 'Event has reached maximum capacity' },
        { status: 400 }
      );
    }

    // Check if student is already registered
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        studentId,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        studentId,
      },
    });

    return NextResponse.json(
      {
        message: 'Registration successful',
        registration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
