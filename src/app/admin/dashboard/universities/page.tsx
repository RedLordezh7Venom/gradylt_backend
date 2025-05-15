'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type University = {
  id: string;
  name: string;
  location: string;
  website: string | null;
  logoUrl: string | null;
  description: string | null;
  partnershipBenefits: string | null;
  isPartner: boolean;
  isVisible: boolean;
  displayOrder: number;
  createdAt: string;
  _count: {
    students: number;
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

export default function UniversitiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state for adding/editing university
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    website: '',
    description: '',
    partnershipBenefits: '',
    logoUrl: '',
    isPartner: true,
    isVisible: true,
    displayOrder: 0,
  });

  // Search and filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [isPartner, setIsPartner] = useState<string>(
    searchParams.has('isPartner') ? searchParams.get('isPartner') || '' : ''
  );

  // Current page state
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );

  // Fetch universities with filters and pagination
  const fetchUniversities = async () => {
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

      if (isPartner) {
        queryParams.set('isPartner', isPartner);
      }

      const response = await fetch(`/api/admin/universities?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch universities');
      }

      const data = await response.json();
      setUniversities(data.universities);
      setPagination(data.pagination);
    } catch (error) {
      setError('Failed to load universities. Please try again.');
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
    updateUrlParams({ search, isPartner, page: '1' });
    fetchUniversities();
  };

  // Handle filter change
  const handleFilterChange = (name: string, value: string) => {
    if (name === 'isPartner') {
      setIsPartner(value);
      updateUrlParams({ isPartner: value, page: '1' });
      setCurrentPage(1);
    }
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

    router.push(`/admin/dashboard/universities?${newParams.toString()}`);
  };

  // Open university details modal
  const openUniversityModal = (university: University) => {
    setSelectedUniversity(university);
    setFormData({
      name: university.name,
      location: university.location,
      website: university.website || '',
      description: university.description || '',
      partnershipBenefits: university.partnershipBenefits || '',
      logoUrl: university.logoUrl || '',
      isPartner: university.isPartner,
      isVisible: university.isVisible,
      displayOrder: university.displayOrder,
    });
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (university: University) => {
    setSelectedUniversity(university);
    setIsDeleteModalOpen(true);
  };

  // Open add university modal
  const openAddModal = () => {
    setFormData({
      name: '',
      location: '',
      website: '',
      description: '',
      partnershipBenefits: '',
      logoUrl: '',
      isPartner: true,
      isVisible: true,
      displayOrder: universities.length, // Set to the end of the list
    });
    setIsAddModalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Add university
  const addUniversity = async () => {
    try {
      setActionLoading(true);

      const response = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add university');
      }

      const data = await response.json();

      // Add university to the list
      setUniversities([data.university, ...universities]);
      setIsAddModalOpen(false);
      fetchUniversities(); // Refresh the list
    } catch (error) {
      setError('Failed to add university. Please try again.');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Update university
  const updateUniversity = async () => {
    if (!selectedUniversity) return;

    try {
      setActionLoading(true);

      const response = await fetch(`/api/admin/universities/${selectedUniversity.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update university');
      }

      const data = await response.json();

      // Update university in the list
      setUniversities(universities.map(university =>
        university.id === selectedUniversity.id ? { ...university, ...data.university } : university
      ));
      setIsModalOpen(false);
    } catch (error) {
      setError('Failed to update university. Please try again.');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete university
  const deleteUniversity = async () => {
    if (!selectedUniversity) return;

    try {
      setActionLoading(true);

      const response = await fetch(`/api/admin/universities/${selectedUniversity.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete university');
      }

      // Remove university from the list
      setUniversities(universities.filter(university => university.id !== selectedUniversity.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete university. Please try again.');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  // Fetch universities on initial load and when filters or page changes
  useEffect(() => {
    fetchUniversities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchParams]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Universities</h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          Add University
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search
            </label>
            <div className="flex">
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or location"
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
            <label htmlFor="isPartner" className="block text-sm font-medium mb-1">
              Partner Status
            </label>
            <select
              id="isPartner"
              value={isPartner}
              onChange={(e) => handleFilterChange('isPartner', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All Universities</option>
              <option value="true">Partner Universities</option>
              <option value="false">Non-Partner Universities</option>
            </select>
          </div>
        </div>
      </div>

      {/* Universities Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center p-6">
            <p>Loading universities...</p>
          </div>
        ) : universities.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-gray-500">No universities found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Visibility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {universities.map((university) => (
                  <tr key={university.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{university.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500 dark:text-gray-400">{university.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500 dark:text-gray-400">{university._count.students}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {university.isPartner ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Partner
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          Non-Partner
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {university.isVisible ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Visible
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-500 dark:text-gray-400">{university.displayOrder}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openUniversityModal(university)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(university)}
                        disabled={actionLoading || university._count.students > 0}
                        className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ${
                          university._count.students > 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalCount}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit University Modal */}
      {isModalOpen && selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Edit University</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
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
                  <label htmlFor="location" className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium mb-1">
                    Website (Optional)
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label htmlFor="logoUrl" className="block text-sm font-medium mb-1">
                    Logo URL (Optional)
                  </label>
                  <input
                    id="logoUrl"
                    name="logoUrl"
                    type="url"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="partnershipBenefits" className="block text-sm font-medium mb-1">
                    Partnership Benefits (Optional)
                  </label>
                  <textarea
                    id="partnershipBenefits"
                    name="partnershipBenefits"
                    value={formData.partnershipBenefits}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Describe the benefits of this partnership..."
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="isPartner"
                      name="isPartner"
                      type="checkbox"
                      checked={formData.isPartner}
                      onChange={(e) => setFormData({ ...formData, isPartner: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isPartner" className="ml-2 block text-sm">
                      Partner University
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="isVisible"
                      name="isVisible"
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isVisible" className="ml-2 block text-sm">
                      Visible on Website
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="displayOrder" className="block text-sm font-medium mb-1">
                    Display Order
                  </label>
                  <input
                    id="displayOrder"
                    name="displayOrder"
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={updateUniversity}
                disabled={actionLoading || !formData.name || !formData.location}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add University Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Add University</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="add-name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    id="add-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="add-location" className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <input
                    id="add-location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="add-website" className="block text-sm font-medium mb-1">
                    Website (Optional)
                  </label>
                  <input
                    id="add-website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label htmlFor="add-logoUrl" className="block text-sm font-medium mb-1">
                    Logo URL (Optional)
                  </label>
                  <input
                    id="add-logoUrl"
                    name="logoUrl"
                    type="url"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <label htmlFor="add-description" className="block text-sm font-medium mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="add-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="add-partnershipBenefits" className="block text-sm font-medium mb-1">
                    Partnership Benefits (Optional)
                  </label>
                  <textarea
                    id="add-partnershipBenefits"
                    name="partnershipBenefits"
                    value={formData.partnershipBenefits}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Describe the benefits of this partnership..."
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="add-isPartner"
                      name="isPartner"
                      type="checkbox"
                      checked={formData.isPartner}
                      onChange={(e) => setFormData({ ...formData, isPartner: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label htmlFor="add-isPartner" className="ml-2 block text-sm">
                      Partner University
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="add-isVisible"
                      name="isVisible"
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label htmlFor="add-isVisible" className="ml-2 block text-sm">
                      Visible on Website
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="add-displayOrder" className="block text-sm font-medium mb-1">
                    Display Order
                  </label>
                  <input
                    id="add-displayOrder"
                    name="displayOrder"
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={addUniversity}
                disabled={actionLoading || !formData.name || !formData.location}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {actionLoading ? 'Adding...' : 'Add University'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <div className="px-6 py-4">
              <p>Are you sure you want to delete <strong>{selectedUniversity.name}</strong>?</p>
              <p className="mt-2 text-sm text-red-600">This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={deleteUniversity}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
