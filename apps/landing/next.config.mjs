/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure no server-side features are used
  experimental: {
    // Disable features that require server components
    serverActions: false,
  },
}

export default nextConfig
