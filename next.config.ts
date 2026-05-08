import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone for optimized Cloud Run Docker deployment
  output: "standalone",

  // Strict mode for better dev-time warnings
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",     value: "nosniff" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control",     value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com https://apis.google.com https://accounts.google.com https://www.gstatic.com https://*.firebaseapp.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://*.googleusercontent.com",
              "connect-src 'self' https://*.googleapis.com https://generativelanguage.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://accounts.google.com",
              "frame-src https://accounts.google.com https://*.firebaseapp.com https://*.firebaseio.com https://apis.google.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
