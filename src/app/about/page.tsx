import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { BlobBackground, Card, GradientText, LinkButton } from '@/components/ui/DesignSystem';

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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      <BlobBackground className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              About <GradientText>Job & Student Portal</GradientText>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Connecting talented students with the best job opportunities since 2020.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <Card className="p-8 hover-lift">
              <h2 className="text-2xl font-bold mb-4">
                <GradientText>Our Mission</GradientText>
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Our mission is to bridge the gap between education and employment by providing students with access to quality job opportunities and helping employers find the right talent for their organizations.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                We believe that every student deserves the chance to showcase their skills and find meaningful work that aligns with their career goals.
              </p>
            </Card>

            <Card className="p-8 hover-lift">
              <h2 className="text-2xl font-bold mb-4">
                <GradientText>Our Vision</GradientText>
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We envision a world where the transition from education to employment is seamless, where students can easily find opportunities that match their skills and aspirations, and where employers can discover and nurture the next generation of talent.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                By 2025, we aim to be the leading platform connecting students and employers across the country.
              </p>
            </Card>
          </div>

          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">
              <GradientText>Our Story</GradientText>
            </h2>
            <Card className="p-8 glassmorphism">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Job & Student Portal was founded in 2020 with a simple idea: to make it easier for students to find jobs and for employers to find talented students. Our founder, Jane Doe, experienced firsthand the challenges of finding relevant job opportunities as a student and later, as an employer, the difficulty of connecting with qualified candidates from universities.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                What started as a small project has grown into a comprehensive platform serving thousands of students and hundreds of employers. We&apos;ve expanded our services to include events, resources, and partnerships with universities to provide a holistic approach to career development.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Today, we&apos;re proud to have facilitated countless successful job placements and to have played a part in launching the careers of many talented individuals. Our journey continues as we strive to innovate and improve our platform to better serve our community.
              </p>
            </Card>
          </div>
        </div>
      </BlobBackground>

      {/* Team Section */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-10 text-center">
          <GradientText>Meet Our Team</GradientText>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden hover-lift">
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
                <p className="text-gray-700 dark:text-gray-300">{member.bio}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 mb-16">
        <Card className="relative overflow-hidden rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90 animate-gradient"></div>
          <div className="relative z-10 p-10 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Join Our Community</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Whether you&apos;re a student looking for opportunities or an employer seeking talent, we&apos;re here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LinkButton
                href="/signup"
                variant="secondary"
                size="lg"
                icon={<ArrowRight />}
              >
                Sign Up as a Student
              </LinkButton>
              <LinkButton
                href="/employers/signup"
                variant="outline"
                size="lg"
                icon={<ArrowRight />}
                className="bg-indigo-700/50 text-white border-white/20 hover:bg-indigo-700"
              >
                Sign Up as an Employer
              </LinkButton>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
