'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Employer = {
  id: string;
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  employer: Employer;
  createdAt: string;
};

type PaginationData = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Search and filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState<string>(
    searchParams.has('status') ? searchParams.get('status') || '' : ''
  );

  // Current page state
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );

  // Fetch jobs with filters and pagination
  const fetchJobs = async () => {
    try {
      setLoading(true);

      // Build query string from filters
      const queryParams = new URLSearchParams();

      // Add pagination
      queryParams.set('page', currentPage.toString());

      // Add filters
      if (search) {
        queryParams.set('search', search);
      }

      if (status) {
        queryParams.set('status', status);
      }

      const response = await fetch(`/api/admin/jobs?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (error) {
      setError('Failed to load jobs. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams({ page: page.toString() });
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    updateUrlParams({ search, status, page: '1' });
    fetchJobs();
  };

  // Handle filter change
  const handleFilterChange = (name: string, value: string) => {
    if (name === 'status') {
      setStatus(value);
      updateUrlParams({ status: value, page: '1' });
      setCurrentPage(1);
    }
  };

  // Update URL parameters
  const updateUrlParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    router.push(`/admin/dashboard/jobs?${newParams.toString()}`);
  };

  // Open job details modal
  const openJobModal = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (job: Job) => {
    setSelectedJob(job);
    setIsDeleteModalOpen(true);
  };

  // Approve job
  const approveJob = async (id: string) => {
    try {
      setActionLoading(true);

      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve job');
      }

      // Update job in the list
      setJobs(jobs.map(job =>
        job.id === id ? { ...job, status: 'APPROVED' } : job
      ));

      if (selectedJob && selectedJob.id === id) {
        setSelectedJob({ ...selectedJob, status: 'APPROVED' });
      }
    } catch (error) {
      setError('Failed to approve job. Please try again.');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Reject job
  const rejectJob = async (id: string) => {
    try {
      setActionLoading(true);

      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject job');
      }

      // Update job in the list
      setJobs(jobs.map(job =>
        job.id === id ? { ...job, status: 'REJECTED' } : job
      ));

      if (selectedJob && selectedJob.id === id) {
        setSelectedJob({ ...selectedJob, status: 'REJECTED' });
      }
    } catch (error) {
      setError('Failed to reject job. Please try again.');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete job
  const deleteJob = async () => {
    if (!selectedJob) return;

    try {
      setActionLoading(true);

      const response = await fetch(`/api/admin/jobs/${selectedJob.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Remove job from the list
      setJobs(jobs.filter(job => job.id !== selectedJob.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      setError('Failed to delete job. Please try again.');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Fetch jobs on initial load and when filters or page changes
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchParams]);

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Jobs</h1>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search
            </label>
            <div className="flex">
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description, or location"
                className="flex-1 px-3 py-2 border rounded-l-md"
              />
              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
              >
                Search
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All Jobs</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center p-6">
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500 dark:text-gray-400">{job.employer.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500 dark:text-gray-400">{job.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openJobModal(job)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                      >
                        View
                      </button>
                      {job.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => approveJob(job.id)}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectJob(job.id)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mr-3"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openDeleteModal(job)}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalCount}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Job Details</h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <h4 className="text-xl font-semibold">{selectedJob.title}</h4>
                <p className="text-gray-500 dark:text-gray-400">{selectedJob.employer.company}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                  <p className="mt-1">{selectedJob.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                  <p className="mt-1">{selectedJob.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stipend</p>
                  <p className="mt-1">{selectedJob.stipend}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="mt-1">{selectedJob.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                  <p className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(selectedJob.status)}`}>
                      {selectedJob.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Posted</p>
                  <p className="mt-1">{new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                <p className="mt-1 whitespace-pre-line">{selectedJob.description}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              {selectedJob.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      approveJob(selectedJob.id);
                      setIsModalOpen(false);
                    }}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      rejectJob(selectedJob.id);
                      setIsModalOpen(false);
                    }}
                    disabled={actionLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <div className="px-6 py-4">
              <p>Are you sure you want to delete the job <strong>{selectedJob.title}</strong>?</p>
              <p className="mt-2 text-sm text-red-600">This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={deleteJob}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
