import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company, designation } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !company || !designation) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if employer already exists
    const existingEmployer = await prisma.employer.findUnique({
      where: { email },
    });

    if (existingEmployer) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new employer
    const employer = await prisma.employer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        company,
        designation,
      },
    });

    // Return success response without sensitive data
    return NextResponse.json(
      {
        message: 'Employer registered successfully',
        employer: {
          id: employer.id,
          name: employer.name,
          email: employer.email,
          company: employer.company,
        },
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
