import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const college = formData.get('college') as string;
    const degree = formData.get('degree') as string;
    const year = parseInt(formData.get('year') as string);
    const interests = JSON.parse(formData.get('interests') as string) as string[];
    const cvFile = formData.get('cv') as File | null;

    // Validate required fields
    if (!name || !email || !password || !college || !degree || !year || !interests.length) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.student.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle CV file upload if provided
    let cvPath = null;
    if (cvFile) {
      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a unique filename
      const fileName = `${crypto.randomUUID()}-${cvFile.name}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      const filePath = join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      cvPath = `/uploads/${fileName}`;
    }

    // Create new student
    const student = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        college,
        degree,
        year,
        interests,
        cvPath,
      },
    });

    // Return success response without sensitive data
    return NextResponse.json(
      {
        message: 'Student registered successfully',
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
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
