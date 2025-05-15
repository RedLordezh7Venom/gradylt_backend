'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
};

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/universities');
        
        if (!response.ok) {
          throw new Error('Failed to fetch universities');
        }
        
        const data = await response.json();
        setUniversities(data.universities);
      } catch (error) {
        setError('Failed to load universities. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Generate placeholder logo with university initials
  const generatePlaceholderLogo = (name: string) => {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return initials;
  };

  // Generate random background color based on university name
  const generateBgColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-teal-500',
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Partner Universities</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We collaborate with leading universities to provide students with the best opportunities for their career growth.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-8">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : universities.length === 0 ? (
        <div className="text-center p-10">
          <p className="text-gray-500 dark:text-gray-400">No partner universities found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {universities.map((university) => (
            <div 
              key={university.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col"
            >
              <div className="h-40 relative flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700">
                {university.logoUrl ? (
                  <Image
                    src={university.logoUrl}
                    alt={`${university.name} logo`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-4"
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ${generateBgColor(university.name)}`}>
                    {generatePlaceholderLogo(university.name)}
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-bold mb-2">{university.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {university.location}
                </p>
                
                <div className="mb-4 flex-grow">
                  {university.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {university.description}
                    </p>
                  )}
                  
                  {university.partnershipBenefits && (
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold mb-1">Partnership Benefits:</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {university.partnershipBenefits}
                      </p>
                    </div>
                  )}
                </div>
                
                {university.website && (
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-medium rounded-md transition-colors duration-300"
                  >
                    Learn More
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
