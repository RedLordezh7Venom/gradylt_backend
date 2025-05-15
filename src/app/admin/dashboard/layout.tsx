'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/admin/profile');

        if (response.status === 401) {
          // Not logged in, redirect to login page
          router.push('/admin/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setAdmin(data.admin);
      } catch (error) {
        setError('Failed to load profile. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [router]);

  useEffect(() => {
    // Set active tab based on current path
    const path = pathname.split('/').pop();
    setActiveTab(path || 'dashboard');
  }, [pathname]);

  const handleLogout = async () => {
    try {
      // Clear the cookie by setting it to expire immediately
      document.cookie = 'adminId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard' },
    { id: 'analytics', label: 'Analytics', href: '/admin/dashboard/analytics' },
    { id: 'students', label: 'Students', href: '/admin/dashboard/students' },
    { id: 'employers', label: 'Employers', href: '/admin/dashboard/employers' },
    { id: 'jobs', label: 'Jobs', href: '/admin/dashboard/jobs' },
    { id: 'events', label: 'Events', href: '/admin/dashboard/events' },
    { id: 'universities', label: 'Universities', href: '/admin/dashboard/universities' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin/dashboard" className="text-xl font-bold">
                  Admin Panel
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {admin && (
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">
                    {admin.name}
                  </span>
                  <span className="bg-indigo-800 text-xs px-2 py-1 rounded mr-4">
                    {admin.role}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error ? (
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
