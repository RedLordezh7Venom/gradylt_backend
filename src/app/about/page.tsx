import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Job & Student Portal',
  description: 'Learn more about our mission, vision, and the team behind Job & Student Portal',
};

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      name: 'Jane Doe',
      role: 'CEO & Founder',
      bio: 'Jane has over 15 years of experience in the education and recruitment sectors.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&h=250&auto=format&fit=crop',
    },
    {
      name: 'John Smith',
      role: 'CTO',
      bio: 'John brings 10+ years of tech leadership and a passion for creating innovative solutions.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&h=250&auto=format&fit=crop',
    },
    {
      name: 'Emily Johnson',
      role: 'Head of Student Relations',
      bio: 'Emily specializes in creating meaningful connections between students and employers.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=250&h=250&auto=format&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Employer Partnerships',
      bio: 'Michael works closely with employers to understand their needs and find the right talent.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&h=250&auto=format&fit=crop',
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Job & Student Portal</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Connecting talented students with the best job opportunities since 2020.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Our mission is to bridge the gap between education and employment by providing students with access to quality job opportunities and helping employers find the right talent for their organizations.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            We believe that every student deserves the chance to showcase their skills and find meaningful work that aligns with their career goals.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-600 dark:text-gray-300">
            We envision a world where the transition from education to employment is seamless, where students can easily find opportunities that match their skills and aspirations, and where employers can discover and nurture the next generation of talent.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            By 2025, we aim to be the leading platform connecting students and employers across the country.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Job & Student Portal was founded in 2020 with a simple idea: to make it easier for students to find jobs and for employers to find talented students. Our founder, Jane Doe, experienced firsthand the challenges of finding relevant job opportunities as a student and later, as an employer, the difficulty of connecting with qualified candidates from universities.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            What started as a small project has grown into a comprehensive platform serving thousands of students and hundreds of employers. We've expanded our services to include events, resources, and partnerships with universities to provide a holistic approach to career development.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Today, we're proud to have facilitated countless successful job placements and to have played a part in launching the careers of many talented individuals. Our journey continues as we strive to innovate and improve our platform to better serve our community.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-600 text-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Whether you're a student looking for opportunities or an employer seeking talent, we're here to help you succeed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium"
          >
            Sign Up as a Student
          </Link>
          <Link
            href="/employers/signup"
            className="bg-indigo-800 text-white hover:bg-indigo-900 px-6 py-3 rounded-md font-medium"
          >
            Sign Up as an Employer
          </Link>
        </div>
      </div>
    </div>
  );
}
