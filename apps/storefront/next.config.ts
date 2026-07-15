import type { NextConfig } from "next";
import checkEnvVariables from "./check-env-variables";

// Run check for required environment variables during boot
checkEnvVariables();

const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME;
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
