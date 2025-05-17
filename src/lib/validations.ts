import { z } from 'zod';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a FileList validator that works in both environments
const fileListValidator = isBrowser
  ? z.instanceof(FileList).optional().transform(file => file?.[0])
  : z.any().optional(); // Use any() for server-side rendering

// Student sign-up form validation schema
export const studentSignUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  college: z.string().min(2, { message: 'College name must be at least 2 characters' }),
  degree: z.string().min(2, { message: 'Degree must be at least 2 characters' }),
  year: z.coerce
    .number()
    .int()
    .min(1, { message: 'Year must be at least 1' })
    .max(6, { message: 'Year must be at most 6' }),
  interests: z.array(z.string()).min(1, { message: 'Please select at least one interest' }),
  cv: fileListValidator,
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Employer sign-up form validation schema
export const employerSignUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  company: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  designation: z.string().min(2, { message: 'Designation must be at least 2 characters' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Job posting form validation schema
export const jobPostSchema = z.object({
  title: z.string().min(5, { message: 'Job title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Job description must be at least 20 characters' }),
  type: z.string().min(1, { message: 'Please select a job type' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters' }),
  stipend: z.string().min(1, { message: 'Please enter a stipend amount' }),
  duration: z.string().min(1, { message: 'Please enter a job duration' }),
  applyLink: z.string().url({ message: 'Please enter a valid URL' }),
  isRemote: z.boolean().default(false),
  isPaid: z.boolean().default(true),
  isShortTerm: z.boolean().default(false),
  requiredDegree: z.string().optional(),
});

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
});

// Types
export type StudentSignUpFormValues = z.infer<typeof studentSignUpSchema>;
export type EmployerSignUpFormValues = z.infer<typeof employerSignUpSchema>;
export type JobPostFormValues = z.infer<typeof jobPostSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
