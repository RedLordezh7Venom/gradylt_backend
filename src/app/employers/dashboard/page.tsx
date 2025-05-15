'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import JobPostForm from '@/components/JobPostForm';
import JobList from '@/components/JobList';
import Link from 'next/link';

type Employer = {
  id: string;
  name: string;
  email: string;
  company: string;
};

type Job = {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  stipend: string;
  duration: string;
  applyLink: string;
  createdAt: string;
};

export default function EmployerDashboardPage() {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch employer data and jobs
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // In a real application, you would fetch the employer data from an API
      // For now, we'll just check if the user is logged in by fetching their jobs
      const response = await fetch('/api/jobs');
      
      if (!response.ok) {
        if (response.status === 401) {
          // Not logged in, redirect to login page
          router.push('/employers/login');
          return;
        }
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      setJobs(data.jobs);
      
      // For demo purposes, we'll set some placeholder employer data
      // In a real app, you would fetch this from an API
      setEmployer({
        id: 'placeholder',
        name: 'Employer',
        email: 'employer@example.com',
        company: 'Your Company',
      });
    } catch (error) {
      setError('Failed to load data. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleJobDelete = async (id: string) => {
    const response = await fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete job');
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employer Dashboard</h1>
        <Link
          href="/"
          className="text-blue-600 hover:underline"
        >
          Back to Home
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <JobList
            initialJobs={jobs}
            onDelete={handleJobDelete}
            onRefresh={handleRefresh}
          />
        </div>
        <div>
          <JobPostForm onSuccess={handleRefresh} jobCount={jobs.length} />
        </div>
      </div>
    </div>
  );
}
