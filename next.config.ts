/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Forces a static HTML/CSS/JS export
  images: {
    unoptimized: true, // Required because cPanel won't have Next.js's image optimization engine
  },
};

export default nextConfig;