'use client';

import { useState, useEffect } from 'react';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  registrationLink: string | null;
  capacity: number | null;
  isVirtual: boolean;
  createdAt: string;
  updatedAt: string;
};

type PaginationData = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type StudentProfile = {
  id: string;
  eventRegistrations: {
    id: string;
    eventId: string;
  }[];
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [registering, setRegistering] = useState<string | null>(null);
  
  // Current page state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch events with pagination
  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Build query string for pagination
      const queryParams = new URLSearchParams();
      queryParams.set('page', currentPage.toString());
      
      const response = await fetch(`/api/events?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data.events);
      setPagination(data.pagination);
      
      // Fetch student profile to get registered events
      const profileResponse = await fetch('/api/students/profile');
      
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const profileData = await profileResponse.json();
      const student: StudentProfile = profileData.student;
      
      // Create a set of registered event IDs
      const registeredEventIds = new Set(
        student.eventRegistrations.map((registration) => registration.eventId)
      );
      
      setRegisteredEvents(registeredEventIds);
    } catch (error) {
      setError('Failed to load events. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle event registration
  const handleRegister = async (eventId: string) => {
    try {
      setRegistering(eventId);
      
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to register for event');
      }
      
      // Update registered events
      setRegisteredEvents(prev => new Set([...prev, eventId]));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to register for event');
    } finally {
      setRegistering(null);
    }
  };
  
  // Fetch events on initial load and when page changes
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upcoming Events</h1>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center p-6">
          <p>Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-gray-500">No upcoming events found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const isRegistered = registeredEvents.has(event.id);
            const eventDate = new Date(event.date);
            const isPastEvent = eventDate < new Date();
            
            return (
              <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <div className="flex items-center">
                    {event.isVirtual && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                        Virtual
                      </span>
                    )}
                    {isPastEvent ? (
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        Past Event
                      </span>
                    ) : isRegistered ? (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Registered
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(event.id)}
                        disabled={registering === event.id || isPastEvent}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
                      >
                        {registering === event.id ? 'Registering...' : 'Register'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm">
                    <span className="font-medium">Date:</span>{' '}
                    {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                  {event.capacity && (
                    <p className="text-sm">
                      <span className="font-medium">Capacity:</span> {event.capacity} attendees
                    </p>
                  )}
                </div>
                
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {event.description}
                </p>
                
                {event.registrationLink && (
                  <div className="mt-4">
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      External Registration Link
                    </a>
                  </div>
                )}
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
