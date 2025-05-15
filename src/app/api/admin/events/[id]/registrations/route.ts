import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Get event registrations
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

    const eventId = params.id;
    
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    // Get registrations
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
            degree: true,
            year: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ 
      registrations,
      count: registrations.length,
      capacity: event.capacity,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add a registration manually (admin only)
export async function POST(
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

    const eventId = params.id;
    const { studentId } = await request.json();
    
    if (!studentId) {
      return NextResponse.json(
        { message: 'Student ID is required' },
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

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { message: 'Student not found' },
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
        { message: 'Student is already registered for this event' },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        studentId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Registration added successfully',
        registration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding registration:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
