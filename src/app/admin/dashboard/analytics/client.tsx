'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format, subDays, subMonths } from 'date-fns';

// Define types for analytics data
type AnalyticsData = {
  totalSessions: number;
  activeSessions: number;
  totalPageViews: number;
  totalActions: number;
  averageSessionDuration: number;
  userTypeDistribution: Array<{
    userType: string;
    _count: number;
  }>;
  topPages: Array<{
    path: string;
    _count: number;
  }>;
  topActions: Array<{
    actionType: string;
    _count: number;
  }>;
  dailyActiveUsers: Array<{
    date: string;
    count: number;
  }>;
};

export default function AnalyticsClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year' | 'custom'>('day');
  const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.set('period', period);

      if (period === 'custom') {
        queryParams.set('startDate', startDate);
        queryParams.set('endDate', endDate);
      }

      console.log('Fetching analytics data...');

      const response = await fetch(`/api/admin/analytics?${queryParams.toString()}`, {
        // Add cache: 'no-store' to prevent caching issues
        cache: 'no-store',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized, redirecting to login');
          router.push('/admin/login');
          return;
        }

        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch analytics data: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Analytics data received:', data);
      setAnalytics(data);
    } catch (error) {
      console.error('Error in fetchAnalytics:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load and when period changes
  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  // Format duration in seconds to readable format
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }

    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Analytics Dashboard</h1>

      {/* Period selector */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">Time Period</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setPeriod('day')}
            className={`px-4 py-2 rounded ${
              period === 'day'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded ${
              period === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded ${
              period === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded ${
              period === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Last Year
          </button>
          <button
            onClick={() => setPeriod('custom')}
            className={`px-4 py-2 rounded ${
              period === 'custom'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Custom
          </button>
        </div>

        {period === 'custom' && (
          <div className="mt-3 flex flex-wrap gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded"
              />
            </div>
            <div className="self-end">
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</h3>
              <p className="text-2xl font-bold">{analytics.totalSessions}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {analytics.activeSessions} active now
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Page Views</h3>
              <p className="text-2xl font-bold">{analytics.totalPageViews}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(analytics.totalPageViews / Math.max(analytics.totalSessions, 1)).toFixed(2)} per session
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">User Actions</h3>
              <p className="text-2xl font-bold">{analytics.totalActions}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(analytics.totalActions / Math.max(analytics.totalSessions, 1)).toFixed(2)} per session
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Session Duration</h3>
              <p className="text-2xl font-bold">{formatDuration(analytics.averageSessionDuration)}</p>
            </div>
          </div>

          {/* User Type Distribution */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">User Type Distribution</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {analytics.userTypeDistribution.map((item) => (
                    <tr key={item.userType}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {item.userType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item._count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {((item._count / analytics.totalSessions) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No analytics data available for the selected period.
        </div>
      )}
    </div>
  );
}
