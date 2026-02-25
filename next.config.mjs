/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "51mb",
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.daisyui.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "d1234567890.cloudfront.net",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      "pdfjs-dist/build/pdf.worker": false,
    };

    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("pdfjs-dist", "@react-pdf-viewer/core", "react-doc-viewer");
    }

    return config;
  },
};

export default nextConfig;
