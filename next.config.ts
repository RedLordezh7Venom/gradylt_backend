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
};

export default nextConfig;
