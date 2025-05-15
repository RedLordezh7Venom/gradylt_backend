'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Stats = {
  studentCount: number;
  employerCount: number;
  jobCount: number;
  pendingJobCount: number;
  eventCount: number;
  universityCount: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/admin/stats');

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        setError('Failed to load statistics. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  // If API is not yet implemented, use placeholder data
  const placeholderStats: Stats = stats || {
    studentCount: 120,
    employerCount: 45,
    jobCount: 78,
    pendingJobCount: 12,
    eventCount: 15,
    universityCount: 8,
  };

  const statCards = [
    {
      title: 'Students',
      count: placeholderStats.studentCount,
      link: '/admin/dashboard/students',
      color: 'bg-blue-500',
      icon: '👨‍🎓',
    },
    {
      title: 'Employers',
      count: placeholderStats.employerCount,
      link: '/admin/dashboard/employers',
      color: 'bg-green-500',
      icon: '🏢',
    },
    {
      title: 'Jobs',
      count: placeholderStats.jobCount,
      link: '/admin/dashboard/jobs',
      color: 'bg-purple-500',
      icon: '💼',
    },
    {
      title: 'Pending Jobs',
      count: placeholderStats.pendingJobCount,
      link: '/admin/dashboard/jobs?status=PENDING',
      color: 'bg-yellow-500',
      icon: '⏳',
    },
    {
      title: 'Events',
      count: placeholderStats.eventCount,
      link: '/admin/dashboard/events',
      color: 'bg-red-500',
      icon: '📅',
    },
    {
      title: 'User Analytics',
      count: 'View',
      link: '/admin/dashboard/analytics',
      color: 'bg-teal-500',
      icon: '📊',
    },
    {
      title: 'Universities',
      count: placeholderStats.universityCount,
      link: '/admin/dashboard/universities',
      color: 'bg-indigo-500',
      icon: '🏫',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className={`${card.color} h-2`}></div>
            <div className="p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{card.title}</h2>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="text-3xl font-bold mt-2">{card.count}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/dashboard/jobs?status=PENDING"
            className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-xl mr-2">⏳</span>
              <span>Review Pending Jobs</span>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/students?verified=false"
            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-xl mr-2">✓</span>
              <span>Verify Students</span>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/employers?verified=false"
            className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-xl mr-2">✓</span>
              <span>Verify Employers</span>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/events"
            className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-xl mr-2">➕</span>
              <span>Create New Event</span>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/universities"
            className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 p-4 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-xl mr-2">➕</span>
              <span>Add Partner University</span>
            </div>
          </Link>

          <Link
            href="/admin/dashboard/analytics"
            className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 p-4 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-xl mr-2">📊</span>
              <span>View User Analytics</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
