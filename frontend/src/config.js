/**
 * API Configuration Helper
 * Resolves API base URL seamlessly across local development, Vercel deployments, and custom cloud backends.
 */
export const getApiBase = () => {
  // 1. Explicitly configured via environment variable (e.g., Render/Railway backend)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
  }

  // 2. Local development: use local Express backend on port 3000
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:3000";
  }

  // 3. Vercel deployment: use relative path to Vercel Serverless Functions
  return "";
};
