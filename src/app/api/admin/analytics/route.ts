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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'day';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range based on period
    let dateFilter: any = {};
    const now = new Date();

    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else {
      switch (period) {
        case 'day':
          dateFilter = {
            gte: new Date(now.setHours(0, 0, 0, 0)),
          };
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateFilter = {
            gte: weekAgo,
          };
          break;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          dateFilter = {
            gte: monthAgo,
          };
          break;
        case 'year':
          const yearAgo = new Date();
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          dateFilter = {
            gte: yearAgo,
          };
          break;
        default:
          dateFilter = {
            gte: new Date(now.setHours(0, 0, 0, 0)),
          };
      }
    }

    // Get analytics data
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
          startTime: dateFilter,
        },
      }),

      // Active sessions (no end time)
      prisma.userSession.count({
        where: {
          startTime: dateFilter,
          endTime: null,
        },
      }),

      // Total page views
      prisma.pageView.count({
        where: {
          entryTime: dateFilter,
        },
      }),

      // Total actions
      prisma.userAction.count({
        where: {
          timestamp: dateFilter,
        },
      }),

      // Average session duration
      prisma.userSession.aggregate({
        where: {
          startTime: dateFilter,
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
          startTime: dateFilter,
        },
        _count: true,
      }),

      // Top pages
      prisma.pageView.groupBy({
        by: ['path'],
        where: {
          entryTime: dateFilter,
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
          timestamp: dateFilter,
        },
        _count: true,
        orderBy: {
          _count: {
            actionType: 'desc',
          },
        },
      }),

      // Daily active users
      prisma.$queryRaw`
        SELECT
          DATE(startTime) as date,
          COUNT(DISTINCT userId) as count
        FROM UserSession
        WHERE
          userId IS NOT NULL
          AND startTime >= ${dateFilter.gte}
          ${dateFilter.lte ? `AND startTime <= ${dateFilter.lte}` : ''}
        GROUP BY DATE(startTime)
        ORDER BY date ASC
      `,
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
