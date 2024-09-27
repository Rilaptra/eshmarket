/** @type {import('next').NextConfig} */
const nextConfig = {
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
