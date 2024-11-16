/** @type {import('next').NextConfig} */
import nextPWA from "next-pwa";
import { hostname } from "os";
import path from "path";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "prkmeuqkrooltclacpzl.supabase.co",
      },
    ],
  },
});

export default nextConfig;
