'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

type BookmarkedJob = {
  id: string;
  jobId: string;
  studentId: string;
  createdAt: string;
  job: Job;
};

type PaginationData = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export default function SavedJobsPage() {
  const router = useRouter();
  const [bookmarkedJobs, setBookmarkedJobs] = useState<BookmarkedJob[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingBookmark, setRemovingBookmark] = useState<string | null>(null);
  
  // Current page state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch bookmarked jobs with pagination
  const fetchBookmarkedJobs = async () => {
    try {
      setLoading(true);
      
      // Build query string for pagination
      const queryParams = new URLSearchParams();
      queryParams.set('page', currentPage.toString());
      
      const response = await fetch(`/api/students/bookmarks?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarked jobs');
      }
      
      const data = await response.json();
      setBookmarkedJobs(data.bookmarkedJobs);
      setPagination(data.pagination);
    } catch (error) {
      setError('Failed to load bookmarked jobs. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Remove bookmark
  const removeBookmark = async (jobId: string) => {
    try {
      setRemovingBookmark(jobId);
      
      const response = await fetch(`/api/students/bookmarks/${jobId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove bookmark');
      }
      
      // Remove job from the list
      setBookmarkedJobs(bookmarkedJobs.filter(bookmark => bookmark.job.id !== jobId));
      
      // If we removed the last item on the page and there are more pages, go back one page
      if (bookmarkedJobs.length === 1 && pagination && pagination.page > 1) {
        setCurrentPage(pagination.page - 1);
      }
    } catch (error) {
      setError('Failed to remove bookmark. Please try again.');
      console.error(error);
    } finally {
      setRemovingBookmark(null);
    }
  };
  
  // Apply to job
  const applyToJob = (applyLink: string) => {
    window.open(applyLink, '_blank');
  };
  
  // Fetch bookmarked jobs on initial load and when page changes
  useEffect(() => {
    fetchBookmarkedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center p-6">
          <p>Loading saved jobs...</p>
        </div>
      ) : bookmarkedJobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't saved any jobs yet.</p>
          <Link
            href="/students/dashboard/jobs"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarkedJobs.map((bookmark) => {
            const job = bookmark.job;
            
            return (
              <div key={bookmark.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <span className="text-sm text-gray-500">{job.employer.company}</span>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded">
                    {job.type}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
                    {job.location}
                  </span>
                  {job.isRemote && (
                    <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded">
                      Remote
                    </span>
                  )}
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stipend</p>
                    <p className="font-medium">{job.stipend}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium">{job.duration}</p>
                  </div>
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => applyToJob(job.applyLink)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => removeBookmark(job.id)}
                      disabled={removingBookmark === job.id}
                      className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm disabled:opacity-50"
                    >
                      {removingBookmark === job.id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    Saved on {new Date(bookmark.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
          
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
  );
}
