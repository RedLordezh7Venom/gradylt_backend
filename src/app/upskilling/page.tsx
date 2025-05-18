'use client';

import Link from 'next/link';
import { BookOpen, FileText, Video, Mic, Users } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  slug: string;
};

export default function UpskillingPage() {
  const categories: Category[] = [
    {
      id: '1',
      name: 'Group Discussions',
      description: 'Learn effective techniques for participating in and leading group discussions.',
      icon: <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
      slug: 'group-discussions',
    },
    {
      id: '2',
      name: 'Resume Writing',
      description: 'Create professional resumes that stand out to employers.',
      icon: <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />,
      slug: 'resume-writing',
    },
    {
      id: '3',
      name: 'Emailing',
      description: 'Master professional email communication for the workplace.',
      icon: <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      slug: 'emailing',
    },
    {
      id: '4',
      name: 'Spoken English',
      description: 'Improve your English speaking skills for interviews and professional settings.',
      icon: <Mic className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      slug: 'spoken-english',
    },
    {
      id: '5',
      name: 'Interview Preparation',
      description: 'Prepare for job interviews with tips, mock questions, and practice sessions.',
      icon: <Video className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
      slug: 'interview-preparation',
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upskilling Resources</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Enhance your employability with our curated resources for soft skills development and English proficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/upskilling/${category.slug}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-2"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                {category.icon}
                <h2 className="text-xl font-semibold ml-3">{category.name}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {category.description}
              </p>
              <div className="flex justify-end">
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  Explore Resources →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Why Upskilling Matters</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Developing soft skills and improving your English proficiency can significantly enhance your employability and career prospects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Stand Out to Employers</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Employers value candidates with strong communication and interpersonal skills just as much as technical abilities.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Boost Your Confidence</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Mastering soft skills helps you feel more confident in professional settings, interviews, and workplace interactions.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Career Advancement</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Strong communication and interpersonal skills are essential for leadership roles and career progression.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
