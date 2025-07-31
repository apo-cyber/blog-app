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
    domains: ["blog.apo-cyber.com", "localhost"],
  },
};

module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "8000",
//         pathname: "/media/**",
//       },
//     ],
//   },
// };

// module.exports = nextConfig;
