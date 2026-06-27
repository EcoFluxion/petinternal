/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Lint is run separately; don't block production builds on stylistic lint rules.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
