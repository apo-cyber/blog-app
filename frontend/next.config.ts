/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLintエラーを無視してビルド
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScriptエラーも無視（必要に応じて）
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "apo-blog.com",
        pathname: "/media/**",
      },
    ],
  },
};

module.exports = nextConfig;
