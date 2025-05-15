'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Employer = {
  name: string;
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
  isRemote: boolean;
  isPaid: boolean;
  isShortTerm: boolean;
  requiredDegree: string | null;
  createdAt: string;
  employer: Employer;
};

type PaginationData = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const jobTypes = [
  'All Types',
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
  'Remote',
];

const degreeTypes = [
  'All Degrees',
  'Bachelor',
  'Master',
  'PhD',
  'Any Degree',
  'No Degree Required',
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());
  const [bookmarking, setBookmarking] = useState<string | null>(null);

  // State for filters
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    degree: '',
    remote: false,
    paid: false,
    shortTerm: false,
  });

  // Current page state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch jobs with filters and pagination
  const fetchJobs = async () => {
    try {
      setLoading(true);

      // Build query string from filters
      const queryParams = new URLSearchParams();

      // Add pagination
      queryParams.set('page', currentPage.toString());

      // Add filters
      if (filters.type && filters.type !== 'All Types') {
        queryParams.set('type', filters.type);
      }

      if (filters.location) {
        queryParams.set('location', filters.location);
      }

      if (filters.degree && filters.degree !== 'All Degrees') {
        queryParams.set('degree', filters.degree);
      }

      if (filters.remote) {
        queryParams.set('remote', 'true');
      }

      if (filters.paid) {
        queryParams.set('paid', 'true');
      }

      if (filters.shortTerm) {
        queryParams.set('shortTerm', 'true');
      }

      const response = await fetch(`/api/public/jobs?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.jobs);
      setPagination(data.pagination);

      // Fetch bookmarked jobs
      await fetchBookmarkedJobs();
    } catch (error) {
      setError('Failed to load jobs. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookmarked jobs
  const fetchBookmarkedJobs = async () => {
    try {
      const response = await fetch('/api/students/bookmarks');

      if (!response.ok) {
        // If unauthorized or other error, just continue without bookmarks
        return;
      }

      const data = await response.json();
      const bookmarkedIds = new Set(data.bookmarkedJobs.map((bookmark: any) => bookmark.jobId));
      setBookmarkedJobs(bookmarkedIds);
    } catch (error) {
      console.error('Error fetching bookmarked jobs:', error);
      // Continue without bookmarks
    }
  };

  // Bookmark a job
  const bookmarkJob = async (jobId: string) => {
    try {
      setBookmarking(jobId);

      const response = await fetch('/api/students/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error('Failed to bookmark job');
      }

      // Add job to bookmarked jobs
      setBookmarkedJobs(prev => new Set([...prev, jobId]));
    } catch (error) {
      setError('Failed to bookmark job. Please try again.');
      console.error(error);
    } finally {
      setBookmarking(null);
    }
  };

  // Remove bookmark
  const removeBookmark = async (jobId: string) => {
    try {
      setBookmarking(jobId);

      const response = await fetch(`/api/students/bookmarks/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove bookmark');
      }

      // Remove job from bookmarked jobs
      const newBookmarkedJobs = new Set(bookmarkedJobs);
      newBookmarkedJobs.delete(jobId);
      setBookmarkedJobs(newBookmarkedJobs);
    } catch (error) {
      setError('Failed to remove bookmark. Please try again.');
      console.error(error);
    } finally {
      setBookmarking(null);
    }
  };

  // Handle filter changes
  const handleFilterChange = (name: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));

    // Reset to page 1 when filters change
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Apply filters
  const applyFilters = () => {
    fetchJobs();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: '',
      location: '',
      degree: '',
      remote: false,
      paid: false,
      shortTerm: false,
    });
    setCurrentPage(1);
  };

  // Fetch jobs on initial load and when filters or page changes
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Browse Jobs</h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Job Type
                </label>
                <select
                  id="type"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type === 'All Types' ? '' : type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="City, Country, etc."
                />
              </div>

              <div>
                <label htmlFor="degree" className="block text-sm font-medium mb-1">
                  Required Degree
                </label>
                <select
                  id="degree"
                  value={filters.degree}
                  onChange={(e) => handleFilterChange('degree', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {degreeTypes.map((degree) => (
                    <option key={degree} value={degree === 'All Degrees' ? '' : degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="remote"
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="remote" className="ml-2 block text-sm">
                    Remote Only
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="paid"
                    type="checkbox"
                    checked={filters.paid}
                    onChange={(e) => handleFilterChange('paid', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="paid" className="ml-2 block text-sm">
                    Paid Only
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="shortTerm"
                    type="checkbox"
                    checked={filters.shortTerm}
                    onChange={(e) => handleFilterChange('shortTerm', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="shortTerm" className="ml-2 block text-sm">
                    Short-term Only
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                >
                  Apply
                </button>
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Job listings */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center p-6">
              <p>Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center p-6">
              <p className="text-gray-500">No jobs found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <span className="text-sm text-gray-500">{job.employer.company}</span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {job.type}
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {job.location}
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {job.stipend}
                    </span>
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {job.duration}
                    </span>
                    {job.isRemote && (
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                        Remote
                      </span>
                    )}
                    {job.isShortTerm && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Short-term
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {job.description}
                  </p>

                  {job.requiredDegree && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Required Degree:</span> {job.requiredDegree}
                    </p>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-4">
                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Apply Now
                      </a>
                      {bookmarkedJobs.has(job.id) ? (
                        <button
                          onClick={() => removeBookmark(job.id)}
                          disabled={bookmarking === job.id}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" clipRule="evenodd" />
                          </svg>
                          {bookmarking === job.id ? 'Removing...' : 'Saved'}
                        </button>
                      ) : (
                        <button
                          onClick={() => bookmarkJob(job.id)}
                          disabled={bookmarking === job.id}
                          className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          {bookmarking === job.id ? 'Saving...' : 'Save Job'}
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                      className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                      Previous
                    </button>

                    <span className="px-3 py-1">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
