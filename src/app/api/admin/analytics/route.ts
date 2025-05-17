import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const adminId = await cookieStore.get('adminId')?.value;

    if (!adminId) {
      return NextResponse.json(
        { message: 'Unauthorized - No admin ID found' },
        { status: 401 }
      );
    }

    // Get admin to verify if we have an adminId
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized - Invalid admin ID' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'day';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range based on period
    let startDateTime: Date;
    let endDateTime: Date | undefined;
    const now = new Date();

    if (startDate && endDate) {
      startDateTime = new Date(startDate);
      endDateTime = new Date(endDate);
      // Set end date to end of day
      endDateTime.setHours(23, 59, 59, 999);
    } else {
      switch (period) {
        case 'day':
          startDateTime = new Date(now);
          startDateTime.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDateTime = new Date(now);
          startDateTime.setDate(startDateTime.getDate() - 7);
          break;
        case 'month':
          startDateTime = new Date(now);
          startDateTime.setMonth(startDateTime.getMonth() - 1);
          break;
        case 'year':
          startDateTime = new Date(now);
          startDateTime.setFullYear(startDateTime.getFullYear() - 1);
          break;
        default:
          startDateTime = new Date(now);
          startDateTime.setHours(0, 0, 0, 0);
      }
    }

    // We'll use real data now that the tables exist
    // Get analytics data from database
    const [
      totalSessions,
      activeSessions,
      totalPageViews,
      totalActions,
      averageSessionDuration,
      userTypeDistribution,
      topPages,
      topActions,
      dailyActiveUsers,
    ] = await Promise.all([
        // Total sessions
        prisma.userSession.count({
          where: {
            startTime: {
              gte: startDateTime,
              ...(endDateTime && { lte: endDateTime }),
            },
          },
        }),

        // Active sessions (no end time)
        prisma.userSession.count({
          where: {
            startTime: {
              gte: startDateTime,
              ...(endDateTime && { lte: endDateTime }),
            },
            endTime: null,
          },
        }),

        // Total page views
        prisma.pageView.count({
          where: {
            entryTime: {
              gte: startDateTime,
              ...(endDateTime && { lte: endDateTime }),
            },
          },
        }),

        // Total actions
        prisma.userAction.count({
          where: {
            timestamp: {
              gte: startDateTime,
              ...(endDateTime && { lte: endDateTime }),
            },
          },
        }),

        // Average session duration
        prisma.userSession.aggregate({
          where: {
            startTime: {
              gte: startDateTime,
              ...(endDateTime && { lte: endDateTime }),
            },
            duration: {
              not: null,
            },
          },
          _avg: {
            duration: true,
          },
        }),

        // User type distribution
        prisma.userSession.groupBy({
          by: ['userType'],
          where: {
            startTime: {
              gte: startDateTime,
              ...(endDateTime && { lte: endDateTime }),
            },
          },
          _count: true,
        }),

        // Top pages
        prisma.pageView.groupBy({
          by: ['path'],
          where: {
            entryTime: {
              gte: startDateTime,
              ...(endDateTime && { lte: endDateTime }),
            },
          },
          _count: true,
          orderBy: {
            _count: {
              path: 'desc',
            },
          },
          take: 10,
        }),

        // Top actions
        prisma.userAction.groupBy({
          by: ['actionType'],
          where: {
            timestamp: {
              gte: startDateTime,
              ...(endDateTime && { lte: endDateTime }),
            },
          },
          _count: true,
          orderBy: {
            _count: {
              actionType: 'desc',
            },
          },
        }),

        // Daily active users - using Prisma's native API instead of raw SQL
        prisma.userSession.groupBy({
          by: ['userId'],
          where: {
            userId: {
              not: null,
            },
            startTime: {
              gte: startDateTime,
              ...(endDateTime && { lte: endDateTime }),
            },
          },
          _count: true,
        }).then(results => {
          // Transform the results to match the expected format
          return results.length > 0 ? [{ date: new Date().toISOString().split('T')[0], count: results.length }] : [];
        }),
      ]);

    return NextResponse.json({
      totalSessions,
      activeSessions,
      totalPageViews,
      totalActions,
      averageSessionDuration: averageSessionDuration._avg.duration || 0,
      userTypeDistribution,
      topPages,
      topActions,
      dailyActiveUsers,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
