/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // static HTML export → hostable on GitHub Pages
  reactStrictMode: true,
  trailingSlash: true, // emit /blog/slug/index.html so static hosts resolve routes
  images: {
    unoptimized: true, // required for static export (no Next image optimizer at runtime)
  },
  // Lint is run separately; don't block production builds on stylistic lint rules.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
