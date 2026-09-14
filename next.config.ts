import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production hardening: security headers applied to every response
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      // NOTE: API Cache-Control is set explicitly per route (sensitive routes
      // no-store, read-only data endpoints short CDN caches). A global /api/*
      // no-store would override the route-level headers.
    ];
  },
};

export default nextConfig;
