'use client';

import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  type: string;
  fileUrl: string;
  category: string;
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

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters
  const [filters, setFilters] = useState({
    type: '',
    category: '',
  });
  
  // Current page state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch resources with filters and pagination
  const fetchResources = async () => {
    try {
      setLoading(true);
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.set('page', currentPage.toString());
      
      // Add filters
      if (filters.type) {
        queryParams.set('type', filters.type);
      }
      
      if (filters.category) {
        queryParams.set('category', filters.category);
      }
      
      const response = await fetch(`/api/resources?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      
      const data = await response.json();
      setResources(data.resources);
      setCategories(data.categories);
      setTypes(data.types);
      setPagination(data.pagination);
    } catch (error) {
      setError('Failed to load resources. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Apply filters
  const applyFilters = () => {
    fetchResources();
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: '',
      category: '',
    });
    setCurrentPage(1);
  };
  
  // Fetch resources on initial load and when filters or page changes
  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);
  
  // Get icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'video':
        return '🎬';
      case 'audio':
        return '🎧';
      case 'presentation':
        return '📊';
      case 'document':
        return '📝';
      default:
        return '📁';
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Learning Resources</h1>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Filter Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Resource Type
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end gap-2">
              <button
                onClick={applyFilters}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
              >
                Apply
              </button>
              <button
                onClick={resetFilters}
                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center p-6">
          <p>Loading resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-gray-500">No resources found matching your criteria.</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-2">{getResourceIcon(resource.type)}</span>
                    <h3 className="text-lg font-semibold">{resource.title}</h3>
                  </div>
                  
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {resource.type}
                    </span>
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {resource.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {resource.description}
                  </p>
                  
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
                  >
                    {resource.type === 'video' ? 'Watch' : 'Download'}
                  </a>
                </div>
              </div>
            ))}
          </div>
          
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
