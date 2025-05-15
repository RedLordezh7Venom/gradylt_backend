'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Student = {
  id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  year: number;
  interests: string[];
  cvPath: string | null;
  eventRegistrations: {
    id: string;
    event: {
      id: string;
      title: string;
      date: string;
      location: string;
    };
  }[];
};

type Job = {
  id: string;
  title: string;
  type: string;
  company: string;
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
};

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch student profile
        const profileResponse = await fetch('/api/students/profile');
        
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const profileData = await profileResponse.json();
        setStudent(profileData.student);
        
        // Fetch recent jobs
        const jobsResponse = await fetch('/api/public/jobs?page=1&pageSize=3');
        
        if (!jobsResponse.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const jobsData = await jobsResponse.json();
        setRecentJobs(jobsData.jobs.map((job: any) => ({
          id: job.id,
          title: job.title,
          type: job.type,
          company: job.employer.company,
        })));
        
        // Fetch upcoming events
        const eventsResponse = await fetch('/api/events?page=1&pageSize=3');
        
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const eventsData = await eventsResponse.json();
        setUpcomingEvents(eventsData.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
        })));
      } catch (error) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {student?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Profile Summary */}
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Your Profile</h2>
          <div className="space-y-2">
            <p><span className="font-medium">College:</span> {student?.college}</p>
            <p><span className="font-medium">Degree:</span> {student?.degree}</p>
            <p><span className="font-medium">Year:</span> {student?.year}</p>
            <p><span className="font-medium">Interests:</span> {student?.interests.join(', ')}</p>
            {student?.cvPath && (
              <p>
                <span className="font-medium">CV:</span>{' '}
                <a href={student.cvPath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View CV
                </a>
              </p>
            )}
          </div>
        </div>
        
        {/* Upcoming Events */}
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Your Upcoming Events</h2>
          {student?.eventRegistrations && student.eventRegistrations.length > 0 ? (
            <ul className="space-y-2">
              {student.eventRegistrations.map((registration) => (
                <li key={registration.id} className="border-b pb-2">
                  <p className="font-medium">{registration.event.title}</p>
                  <p className="text-sm">
                    {new Date(registration.event.date).toLocaleDateString()} at {registration.event.location}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't registered for any events yet.</p>
          )}
          <div className="mt-4">
            <Link href="/students/dashboard/events" className="text-green-700 dark:text-green-300 hover:underline text-sm">
              Browse all events →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Recent Jobs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Job Postings</h2>
          {recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="border-b pb-3">
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm">{job.company} • {job.type}</p>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/students/dashboard/jobs" className="text-blue-600 hover:underline text-sm">
                  View all job postings →
                </Link>
              </div>
            </div>
          ) : (
            <p>No recent job postings.</p>
          )}
        </div>
        
        {/* Upcoming Events */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border-b pb-3">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm">
                    {new Date(event.date).toLocaleDateString()} at {event.location}
                  </p>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/students/dashboard/events" className="text-blue-600 hover:underline text-sm">
                  View all events →
                </Link>
              </div>
            </div>
          ) : (
            <p>No upcoming events.</p>
          )}
        </div>
      </div>
    </div>
  );
}
