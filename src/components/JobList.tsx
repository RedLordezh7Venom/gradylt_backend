'use client';

import { useState } from 'react';

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

type JobListProps = {
  initialJobs: Job[];
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
};

export default function JobList({ initialJobs, onDelete, onRefresh }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    setError(null);

    try {
      await onDelete(id);
      setJobs(jobs.filter(job => job.id !== id));
      onRefresh();
    } catch (error) {
      setError('Failed to delete job. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">You haven't posted any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <h2 className="text-xl font-bold">Your Job Postings</h2>
      
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <button
                onClick={() => handleDelete(job.id)}
                disabled={isDeleting === job.id}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                {isDeleting === job.id ? 'Deleting...' : 'Delete'}
              </button>
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
            </div>
            
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {job.description}
            </p>
            
            <div className="mt-4 flex justify-between items-center">
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Application Link
              </a>
              <span className="text-xs text-gray-500">
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
