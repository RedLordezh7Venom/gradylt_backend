'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobPostSchema, type JobPostFormValues } from '@/lib/validations';

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
  'Remote',
];

type JobPostFormProps = {
  onSuccess: () => void;
  jobCount: number;
};

export default function JobPostForm({ onSuccess, jobCount }: JobPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobPostFormValues>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: '',
      description: '',
      type: '',
      location: '',
      stipend: '',
      duration: '',
      applyLink: '',
      isRemote: false,
      isPaid: true,
      isShortTerm: false,
      requiredDegree: '',
    },
  });

  const onSubmit = async (data: JobPostFormValues) => {
    if (jobCount >= 5) {
      setSubmitError('You have reached the maximum limit of 5 job postings.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      reset();
      onSuccess();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Post a New Job</h2>

      {jobCount >= 5 ? (
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded mb-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            You have reached the maximum limit of 5 job postings. Please delete an existing job to add a new one.
          </p>
        </div>
      ) : null}

      {submitError ? (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
          <p className="text-red-800 dark:text-red-200">{submitError}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Job Title
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Software Engineer"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Job Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Describe the job responsibilities and requirements..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Job Type
          </label>
          <select
            id="type"
            {...register('type')}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select job type</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="New York, NY"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="stipend" className="block text-sm font-medium mb-1">
            Stipend/Salary
          </label>
          <input
            id="stipend"
            type="text"
            {...register('stipend')}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="$50,000 - $70,000 per year"
          />
          {errors.stipend && (
            <p className="mt-1 text-sm text-red-600">{errors.stipend.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium mb-1">
            Duration
          </label>
          <input
            id="duration"
            type="text"
            {...register('duration')}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="6 months, 1 year, Permanent"
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="applyLink" className="block text-sm font-medium mb-1">
            Application Link
          </label>
          <input
            id="applyLink"
            type="url"
            {...register('applyLink')}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://example.com/apply"
          />
          {errors.applyLink && (
            <p className="mt-1 text-sm text-red-600">{errors.applyLink.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="requiredDegree" className="block text-sm font-medium mb-1">
            Required Degree (Optional)
          </label>
          <input
            id="requiredDegree"
            type="text"
            {...register('requiredDegree')}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Bachelor's in Computer Science, Any Engineering degree, etc."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="isRemote"
              type="checkbox"
              {...register('isRemote')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="isRemote" className="ml-2 block text-sm">
              Remote Job
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="isPaid"
              type="checkbox"
              {...register('isPaid')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="isPaid" className="ml-2 block text-sm">
              Paid Position
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="isShortTerm"
              type="checkbox"
              {...register('isShortTerm')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="isShortTerm" className="ml-2 block text-sm">
              Short-term Position
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || jobCount >= 5}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}
