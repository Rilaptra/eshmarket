/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["framer-motion"],
  images: {
    remotePatterns: [
      {
        hostname: "i.ibb.co",
      },
      {
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

export default nextConfig;
