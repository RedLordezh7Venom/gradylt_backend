'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Resource = {
  id: string;
  title: string;
  description: string;
  type: string;
  fileUrl: string;
  category: string;
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

export default function ResourcesAdminPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Form data for adding/editing resources
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    fileUrl: '',
    category: '',
  });
  
  // Selected resource for editing/deleting
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Filter states
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
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
      if (search) {
        queryParams.set('search', search);
      }

      if (selectedType) {
        queryParams.set('type', selectedType);
      }

      if (selectedCategory) {
        queryParams.set('category', selectedCategory);
      }

      const response = await fetch(`/api/admin/resources?${queryParams.toString()}`);

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
  
  // Open edit resource modal
  const openEditModal = (resource: Resource) => {
    setSelectedResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      fileUrl: resource.fileUrl,
      category: resource.category,
    });
    setIsEditModalOpen(true);
  };
  
  // Open delete resource modal
  const openDeleteModal = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDeleteModalOpen(true);
  };
  
  // Open add resource modal
  const openAddModal = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      fileUrl: '',
      category: '',
    });
    setIsAddModalOpen(true);
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Add resource
  const addResource = async () => {
    try {
      setActionLoading(true);

      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add resource');
      }

      const data = await response.json();

      // Add resource to the list
      setResources([data.resource, ...resources]);
      setIsAddModalOpen(false);
      fetchResources(); // Refresh the list
    } catch (error) {
      setError('Failed to add resource. Please try again.');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Edit resource
  const editResource = async () => {
    if (!selectedResource) return;
    
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/admin/resources/${selectedResource.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update resource');
      }
      
      const data = await response.json();
      
      // Update resource in the list
      setResources(resources.map(resource => 
        resource.id === selectedResource.id ? data.resource : resource
      ));
      setIsEditModalOpen(false);
    } catch (error) {
      setError('Failed to update resource. Please try again.');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Delete resource
  const deleteResource = async () => {
    if (!selectedResource) return;
    
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/admin/resources/${selectedResource.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }
      
      // Remove resource from the list
      setResources(resources.filter(resource => resource.id !== selectedResource.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      setError('Failed to delete resource. Please try again.');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Fetch resources on initial load and when filters or page changes
  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search, selectedType, selectedCategory]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchResources();
  };
  
  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      setSelectedType(value);
    } else if (name === 'category') {
      setSelectedCategory(value);
    }
    
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Resources</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add Resource
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow px-3 py-2 border rounded-l-md"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
              >
                Search
              </button>
            </form>
          </div>
          <div>
            <select
              name="type"
              value={selectedType}
              onChange={handleFilterChange}
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
          <div>
            <select
              name="category"
              value={selectedCategory}
              onChange={handleFilterChange}
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
        </div>
      </div>
      
      {/* Resources Table */}
      {loading ? (
        <div className="text-center p-6">
          <p>Loading resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No resources found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {resources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{resource.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {resource.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {resource.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {resource.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(resource)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(resource)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-1 rounded-md mr-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="mx-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 rounded-md ml-2 bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
      
      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Resource</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Document">Document</option>
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Group Discussions">Group Discussions</option>
                  <option value="Resume Writing">Resume Writing</option>
                  <option value="Emailing">Emailing</option>
                  <option value="Spoken English">Spoken English</option>
                  <option value="Interview Preparation">Interview Preparation</option>
                </select>
              </div>
              <div>
                <label htmlFor="fileUrl" className="block text-sm font-medium mb-1">
                  File URL
                </label>
                <input
                  type="url"
                  id="fileUrl"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://example.com/file.pdf"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={addResource}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                {actionLoading ? 'Adding...' : 'Add Resource'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Resource Modal */}
      {isEditModalOpen && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Resource</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Document">Document</option>
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Group Discussions">Group Discussions</option>
                  <option value="Resume Writing">Resume Writing</option>
                  <option value="Emailing">Emailing</option>
                  <option value="Spoken English">Spoken English</option>
                  <option value="Interview Preparation">Interview Preparation</option>
                </select>
              </div>
              <div>
                <label htmlFor="fileUrl" className="block text-sm font-medium mb-1">
                  File URL
                </label>
                <input
                  type="url"
                  id="fileUrl"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://example.com/file.pdf"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={editResource}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Resource Modal */}
      {isDeleteModalOpen && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Delete Resource</h2>
            <p className="mb-6">
              Are you sure you want to delete the resource "{selectedResource.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={deleteResource}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete Resource'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
