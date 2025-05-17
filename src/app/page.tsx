import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap, Building, Users, Calendar, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 px-6 py-24 mx-auto max-w-7xl sm:px-8 md:px-12 lg:px-16 lg:py-32">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6">
              Find Your First Job
            </h1>
            <p className="max-w-2xl text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10">
              Connect with top employers and kickstart your career journey with our cutting-edge job portal designed for students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/jobs"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Browse All Jobs <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/signup"
                className="px-8 py-4 rounded-full bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-medium text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Sign Up Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="px-6 mx-auto max-w-7xl sm:px-8 md:px-12 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Everything you need to launch your career and connect with opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl transition-transform duration-300 hover:transform hover:scale-105">
              <div className="w-14 h-14 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Jobs</h3>
              <p className="text-gray-600 dark:text-gray-400">Access hundreds of job listings tailored for students and recent graduates.</p>
            </div>

            <div className="p-6 bg-purple-50 dark:bg-purple-900/30 rounded-2xl transition-transform duration-300 hover:transform hover:scale-105">
              <div className="w-14 h-14 mb-4 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Internships</h3>
              <p className="text-gray-600 dark:text-gray-400">Find valuable internship opportunities to gain real-world experience.</p>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/30 rounded-2xl transition-transform duration-300 hover:transform hover:scale-105">
              <div className="w-14 h-14 mb-4 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Events</h3>
              <p className="text-gray-600 dark:text-gray-400">Participate in career fairs, workshops, and networking events.</p>
            </div>

            <div className="p-6 bg-pink-50 dark:bg-pink-900/30 rounded-2xl transition-transform duration-300 hover:transform hover:scale-105">
              <div className="w-14 h-14 mb-4 rounded-full bg-pink-100 dark:bg-pink-800 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upskilling</h3>
              <p className="text-gray-600 dark:text-gray-400">Access resources to develop soft skills and enhance your employability.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="px-6 mx-auto max-w-7xl sm:px-8 md:px-12 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trusted By</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Leading universities and employers partner with us
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
            <div className="h-12 w-full flex items-center justify-center">
              <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            <div className="h-12 w-full flex items-center justify-center">
              <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            <div className="h-12 w-full flex items-center justify-center">
              <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
            <div className="h-12 w-full flex items-center justify-center">
              <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* User Roles Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="px-6 mx-auto max-w-7xl sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Student Card */}
            <div className="relative overflow-hidden rounded-3xl shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-600/80 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 p-10 flex flex-col h-full">
                <div className="flex-grow">
                  <div className="w-16 h-16 mb-6 rounded-full bg-white/20 flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">For Students</h3>
                  <p className="text-white/90 mb-8">
                    Create your profile, apply for jobs, register for events, and access resources to boost your career.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/signup"
                    className="px-6 py-3 rounded-full bg-white text-indigo-600 font-medium text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign Up <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-3 rounded-full bg-indigo-700/50 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all duration-300"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>

            {/* Employer Card */}
            <div className="relative overflow-hidden rounded-3xl shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-pink-600/80 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 p-10 flex flex-col h-full">
                <div className="flex-grow">
                  <div className="w-16 h-16 mb-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">For Employers</h3>
                  <p className="text-white/90 mb-8">
                    Post job opportunities, find talented students, and build your employer brand on our platform.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/employers/signup"
                    className="px-6 py-3 rounded-full bg-white text-purple-600 font-medium text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign Up <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/employers/login"
                    className="px-6 py-3 rounded-full bg-purple-700/50 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-purple-700 transition-all duration-300"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="px-6 mx-auto max-w-7xl sm:px-8 md:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Job & Student Portal</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Connecting talent with opportunity</p>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                Terms
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Job & Student Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
