import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AnalyticsClient from './client';

// This is a server component that wraps the client component
export default async function AnalyticsPage() {
  // Get admin ID from cookie
  const adminId = cookies().get('adminId')?.value;

  // If no admin ID is found, redirect to login page
  if (!adminId) {
    console.log('Server component: No admin ID found, redirecting to login');
    redirect('/admin/login');
  }

  // Verify admin exists in database
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      console.log('Server component: Invalid admin ID, redirecting to login');
      redirect('/admin/login');
    }

    // Admin is authenticated, render the analytics page
    return <AnalyticsClient />;
  } catch (error) {
    console.error('Server component: Error verifying admin:', error);
    redirect('/admin/login');
  }
}
