import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Check if request has a body before trying to parse JSON
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { message: 'Invalid content type. Expected application/json' },
        { status: 400 }
      );
    }

    // Clone the request to safely read the body
    const clonedRequest = request.clone();

    // Try to parse JSON with error handling
    let data;
    try {
      data = await clonedRequest.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Destructure the data with defaults to prevent undefined errors
    const {
      sessionId = '',
      eventType = '',
      path = '',
      title = '',
      duration = null,
      actionType = '',
      actionData = null
    } = data || {};

    // Validate required fields
    if (!sessionId || !eventType) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user IDs from cookies - using async/await pattern
    const cookieStore = await cookies();
    const studentId = await cookieStore.get('studentId')?.value;
    const employerId = await cookieStore.get('employerId')?.value;
    const adminId = await cookieStore.get('adminId')?.value;

    // Determine user type
    let userType = 'ANONYMOUS';
    let userId = null;

    if (studentId) {
      userType = 'STUDENT';
      userId = studentId;
    } else if (employerId) {
      userType = 'EMPLOYER';
      userId = employerId;
    } else if (adminId) {
      userType = 'ADMIN';
      userId = adminId;
    }

    // Get or create session
    let session = await prisma.userSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      // Create new session
      session = await prisma.userSession.create({
        data: {
          sessionId,
          userType: userType as any,
          userId,
          studentId: userType === 'STUDENT' ? userId : null,
          employerId: userType === 'EMPLOYER' ? userId : null,
          userAgent: request.headers.get('user-agent') || null,
          ipAddress: request.ip || null,
          referrer: request.headers.get('referer') || null,
        },
      });
    } else if (userId && !session.userId) {
      // Update session with user ID if user has logged in
      await prisma.userSession.update({
        where: { id: session.id },
        data: {
          userType: userType as any,
          userId,
          studentId: userType === 'STUDENT' ? userId : null,
          employerId: userType === 'EMPLOYER' ? userId : null,
        },
      });
    }

    // Handle different event types
    if (eventType === 'pageView') {
      // Create or update page view
      if (!path) {
        return NextResponse.json(
          { message: 'Path is required for pageView events' },
          { status: 400 }
        );
      }

      // Check if there's an existing page view for this path in this session
      const existingPageView = await prisma.pageView.findFirst({
        where: {
          sessionId: session.id,
          path,
          exitTime: null, // Only consider active page views
        },
        orderBy: {
          entryTime: 'desc',
        },
      });

      if (existingPageView) {
        // Update existing page view with exit time and duration
        await prisma.pageView.update({
          where: { id: existingPageView.id },
          data: {
            exitTime: new Date(),
            duration: duration || Math.floor((Date.now() - existingPageView.entryTime.getTime()) / 1000),
          },
        });
      }

      // Create new page view
      const pageView = await prisma.pageView.create({
        data: {
          sessionId: session.id,
          path,
          title,
          entryTime: new Date(),
        },
      });

      return NextResponse.json({ success: true, pageView }, { status: 200 });
    } else if (eventType === 'action') {
      // Record user action
      if (!actionType || !path) {
        return NextResponse.json(
          { message: 'ActionType and path are required for action events' },
          { status: 400 }
        );
      }

      const userAction = await prisma.userAction.create({
        data: {
          sessionId: session.id,
          actionType: actionType as any,
          actionData: actionData || {},
          path,
        },
      });

      return NextResponse.json({ success: true, userAction }, { status: 200 });
    } else if (eventType === 'sessionEnd') {
      // Update session with end time and duration
      const updatedSession = await prisma.userSession.update({
        where: { id: session.id },
        data: {
          endTime: new Date(),
          duration: duration || Math.floor((Date.now() - session.startTime.getTime()) / 1000),
        },
      });

      // Close any open page views
      await prisma.pageView.updateMany({
        where: {
          sessionId: session.id,
          exitTime: null,
        },
        data: {
          exitTime: new Date(),
        },
      });

      return NextResponse.json({ success: true, session: updatedSession }, { status: 200 });
    }

    return NextResponse.json(
      { message: 'Invalid event type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing only - remove in production
export async function GET(request: NextRequest) {
  try {
    // Only allow admins to access this endpoint
    const cookieStore = await cookies();
    const adminId = await cookieStore.get('adminId')?.value;

    if (!adminId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get admin to verify
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get basic stats
    const [
      sessionCount,
      pageViewCount,
      actionCount,
    ] = await Promise.all([
      prisma.userSession.count(),
      prisma.pageView.count(),
      prisma.userAction.count(),
    ]);

    return NextResponse.json({
      sessionCount,
      pageViewCount,
      actionCount,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tracking stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
