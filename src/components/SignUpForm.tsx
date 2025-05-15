'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSignUpSchema, type StudentSignUpFormValues } from '@/lib/validations';
import Link from 'next/link';

const interestOptions = [
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Cybersecurity',
  'Cloud Computing',
  'Blockchain',
  'IoT',
];

export default function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentSignUpFormValues>({
    resolver: zodResolver(studentSignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      college: '',
      degree: '',
      year: undefined,
      interests: [],
    },
  });

  const onSubmit = async (data: StudentSignUpFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();

      // Add all text fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'interests') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'cv' && value instanceof File) {
          formData.append('cv', value);
        } else if (key !== 'confirmPassword' && key !== 'cv') {
          formData.append(key, String(value));
        }
      });

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Student Sign Up</h2>

      {submitSuccess ? (
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded mb-6">
          <p className="text-green-800 dark:text-green-200">
            Registration successful! You can now{' '}
            <Link href="/login" className="underline font-medium">
              log in
            </Link>
            .
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
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="college" className="block text-sm font-medium mb-1">
            College
          </label>
          <input
            id="college"
            type="text"
            {...register('college')}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="University of Example"
          />
          {errors.college && (
            <p className="mt-1 text-sm text-red-600">{errors.college.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="degree" className="block text-sm font-medium mb-1">
            Degree
          </label>
          <input
            id="degree"
            type="text"
            {...register('degree')}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Computer Science"
          />
          {errors.degree && (
            <p className="mt-1 text-sm text-red-600">{errors.degree.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Year of Study
          </label>
          <input
            id="year"
            type="number"
            {...register('year')}
            className="w-full px-3 py-2 border rounded-md"
            min="1"
            max="6"
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Interests</label>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map((interest) => (
              <div key={interest} className="flex items-center">
                <input
                  id={`interest-${interest}`}
                  type="checkbox"
                  value={interest}
                  {...register('interests')}
                  className="mr-2"
                />
                <label htmlFor={`interest-${interest}`} className="text-sm">
                  {interest}
                </label>
              </div>
            ))}
          </div>
          {errors.interests && (
            <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="cv" className="block text-sm font-medium mb-1">
            CV (Optional)
          </label>
          <input
            id="cv"
            type="file"
            {...register('cv')}
            className="w-full px-3 py-2 border rounded-md"
            accept=".pdf,.doc,.docx"
          />
          {errors.cv && (
            <p className="mt-1 text-sm text-red-600">{errors.cv.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
        >
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
