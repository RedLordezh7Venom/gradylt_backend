'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string | null;
  location: string;
  eventType: 'WEBINAR' | 'WORKSHOP' | 'CONTEST' | 'OTHER';
  registrationLink: string | null;
  virtualLink: string | null;
  capacity: number | null;
  isVirtual: boolean;
  createdAt: string;
  _count: {
    registrations: number;
  };
};

type PaginationData = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registering, setRegistering] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Search and filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [eventType, setEventType] = useState(searchParams.get('eventType') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'upcoming');
  
  // Current page state
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );
  
  // Registration form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  // Fetch events with filters and pagination
  const fetchEvents = async () => {
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
      
      if (eventType) {
        queryParams.set('eventType', eventType);
      }
      
      if (status) {
        queryParams.set('status', status);
      }
      
      const response = await fetch(`/api/events?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data.events);
      setEventTypes(data.eventTypes || ['WEBINAR', 'WORKSHOP', 'CONTEST', 'OTHER']);
      setPagination(data.pagination);
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
    updateUrlParams({ page: page.toString() });
  };
  
  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    updateUrlParams({ search, eventType, status, page: '1' });
  };
  
  // Handle filter change
  const handleFilterChange = (name: string, value: string) => {
    if (name === 'eventType') {
      setEventType(value);
    } else if (name === 'status') {
      setStatus(value);
    }
    
    setCurrentPage(1);
    updateUrlParams({ 
      [name]: value, 
      page: '1',
      search: name === 'search' ? value : search,
    });
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
    
    router.push(`/events?${newParams.toString()}`);
  };
  
  // Open registration modal
  const openRegistrationModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setRegistrationSuccess(null);
    setRegistrationError(null);
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle registration form submission
  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent) return;
    
    try {
      setRegistering(selectedEvent.id);
      
      // For now, we'll just simulate a successful registration
      // In a real app, you would send this data to your API
      setTimeout(() => {
        setRegistrationSuccess('Registration successful! You will receive a confirmation email shortly.');
        setRegistering(null);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
        });
      }, 1000);
      
    } catch (error) {
      setRegistrationError('Failed to register. Please try again.');
      console.error(error);
      setRegistering(null);
    }
  };
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch events on initial load and when filters or page changes
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchParams]);
  
  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d, yyyy h:mm a');
  };
  
  // Get event type badge color
  const getEventTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'WEBINAR':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'WORKSHOP':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CONTEST':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Get event type display name
  const getEventTypeDisplayName = (type: string) => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h1>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search
            </label>
            <div className="flex">
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
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
            <label htmlFor="eventType" className="block text-sm font-medium mb-1">
              Event Type
            </label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All Types</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {getEventTypeDisplayName(type)}
                </option>
              ))}
            </select>
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
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
              <option value="">All Events</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Events Grid */}
      {loading ? (
        <div className="text-center p-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-500 dark:text-gray-400">No events found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeBadgeColor(event.eventType)}`}>
                    {getEventTypeDisplayName(event.eventType)}
                  </span>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${event.isVirtual ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}`}>
                    {event.isVirtual ? 'Online' : 'In-person'}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                
                <div className="mb-3 space-y-1">
                  <p className="text-sm flex items-start">
                    <span className="mr-2">📅</span>
                    <span>{formatDateTime(event.date)}</span>
                  </p>
                  <p className="text-sm flex items-start">
                    <span className="mr-2">📍</span>
                    <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
                  </p>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                {event.capacity && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Registration</span>
                      <span>{event._count.registrations} / {event.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (event._count.registrations / event.capacity) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <button
                  onClick={() => openRegistrationModal(event)}
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md"
                >
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
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
      
      {/* Registration Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Register for Event</h3>
            </div>
            
            <div className="px-6 py-4">
              <h4 className="text-xl font-semibold mb-2">{selectedEvent.title}</h4>
              <p className="text-sm mb-4">{formatDateTime(selectedEvent.date)}</p>
              
              {registrationSuccess ? (
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded mb-4">
                  <p className="text-green-800 dark:text-green-200">{registrationSuccess}</p>
                </div>
              ) : registrationError ? (
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-4">
                  <p className="text-red-800 dark:text-red-200">{registrationError}</p>
                </div>
              ) : (
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={registering === selectedEvent.id}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md disabled:opacity-50"
                  >
                    {registering === selectedEvent.id ? 'Registering...' : 'Complete Registration'}
                  </button>
                </form>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
