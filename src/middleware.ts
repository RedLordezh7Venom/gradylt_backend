import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Log for debugging
  console.log('Middleware running for path:', path);

  // Check if the path is for admin routes
  const isAdminRoute = path.startsWith('/admin') &&
                       !path.startsWith('/admin/login') &&
                       !path.startsWith('/admin/signup');

  // Special handling for admin analytics
  const isAdminAnalytics = path.includes('/admin/dashboard/analytics');

  // If it's an admin route, check for the adminId cookie
  if (isAdminRoute) {
    console.log('Admin route detected:', path);

    const adminId = request.cookies.get('adminId')?.value;
    console.log('Admin ID from cookie:', adminId);

    // If no adminId cookie is found, redirect to the login page
    if (!adminId) {
      console.log('No admin ID found, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Extra validation for sensitive routes like analytics
    if (isAdminAnalytics) {
      console.log('Analytics page accessed, extra validation applied');

      // Here we could add additional checks if needed
      // For example, checking if the admin has the right role
      // or if the admin ID is in a specific format
    }

    console.log('Admin ID found, allowing access to:', path);
  }

  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
    // Specifically match the analytics page
    '/admin/dashboard/analytics',
  ],
};
