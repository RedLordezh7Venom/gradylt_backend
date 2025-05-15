import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <h1 className="text-4xl font-bold mb-4">Job & Student Portal</h1>
        <p className="text-xl mb-8 text-center max-w-lg">
          Welcome to our portal. Choose your role to get started.
        </p>

        {/* Browse Jobs Button */}
        <Link
          href="/jobs"
          className="mb-8 rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-purple-600 text-white gap-2 hover:bg-purple-700 font-medium text-base h-12 px-8"
        >
          Browse All Jobs
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Student Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">For Students</h2>
            <p className="mb-6 text-center">
              Sign up to create your student profile and apply for jobs.
            </p>
            <div className="flex gap-4 items-center flex-col">
              <Link
                href="/signup"
                className="w-full rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4"
              >
                Student Sign Up
              </Link>
              <Link
                href="/login"
                className="w-full rounded-md border border-solid border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4"
              >
                Student Login
              </Link>
            </div>
          </div>

          {/* Employer Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">For Employers</h2>
            <p className="mb-6 text-center">
              Sign up to post jobs and find talented students.
            </p>
            <div className="flex gap-4 items-center flex-col">
              <Link
                href="/employers/signup"
                className="w-full rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-green-600 text-white gap-2 hover:bg-green-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4"
              >
                Employer Sign Up
              </Link>
              <Link
                href="/employers/login"
                className="w-full rounded-md border border-solid border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4"
              >
                Employer Login
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Job & Student Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
