import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'cloudinary.com',
      'res.cloudinary.com',
      'upload.wikimedia.org',
      'via.placeholder.com',
      'picsum.photos',
      'randomuser.me',
      'ui-avatars.com'
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
