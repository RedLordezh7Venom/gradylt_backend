'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink, FileText, Video, Mic, Users, BookOpen } from 'lucide-react';

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

type CategoryInfo = {
  name: string;
  description: string;
  icon: React.ReactNode;
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryMap: Record<string, CategoryInfo> = {
    'group-discussions': {
      name: 'Group Discussions',
      description: 'Learn effective techniques for participating in and leading group discussions.',
      icon: <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
    },
    'resume-writing': {
      name: 'Resume Writing',
      description: 'Create professional resumes that stand out to employers.',
      icon: <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />,
    },
    'emailing': {
      name: 'Emailing',
      description: 'Master professional email communication for the workplace.',
      icon: <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    },
    'spoken-english': {
      name: 'Spoken English',
      description: 'Improve your English speaking skills for interviews and professional settings.',
      icon: <Mic className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
    },
    'interview-preparation': {
      name: 'Interview Preparation',
      description: 'Prepare for job interviews with tips, mock questions, and practice sessions.',
      icon: <Video className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
    },
  };

  const categoryInfo = categoryMap[params.category] || {
    name: 'Resources',
    description: 'Explore our learning resources.',
    icon: <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        
        // Convert slug to category name for API query
        const categoryName = categoryInfo.name;
        
        const response = await fetch(`/api/resources?category=${encodeURIComponent(categoryName)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        
        const data = await response.json();
        setResources(data.resources);
      } catch (error) {
        setError('Failed to load resources. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [params.category, categoryInfo.name]);

  // Get icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'audio':
        return <Mic className="w-6 h-6" />;
      case 'presentation':
        return <Users className="w-6 h-6" />;
      case 'document':
        return <BookOpen className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  // Track resource download/view
  const trackResourceAction = async (resourceId: string) => {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'action',
          actionType: 'RESOURCE_DOWNLOAD',
          path: window.location.pathname,
          actionData: { resourceId },
        }),
      });
    } catch (error) {
      console.error('Error tracking resource action:', error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Link href="/upskilling" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to All Categories
      </Link>
      
      <div className="flex items-center mb-8">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mr-4">
          {categoryInfo.icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{categoryInfo.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {categoryInfo.description}
          </p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-8">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center p-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">No resources found for this category.</p>
          <Link
            href="/upskilling"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Explore Other Categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl"
            >
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full mr-3">
                    {getResourceIcon(resource.type)}
                  </div>
                  <h3 className="text-lg font-semibold">{resource.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {resource.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                    {resource.type}
                  </span>
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackResourceAction(resource.id)}
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {resource.type.toLowerCase() === 'pdf' || resource.type.toLowerCase() === 'document' ? (
                      <>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </>
                    )}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Additional Resources Section */}
      <div className="mt-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Need More Help?</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Check out these additional resources to further enhance your skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">One-on-One Coaching</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get personalized guidance from our career experts to improve your skills.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Contact Us <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Upcoming Workshops</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Join our interactive workshops to practice and improve your skills with peers.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Events <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
