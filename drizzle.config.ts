import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // In CI/Vercel this comes from the project Environment Variables panel.
    // Locally, copy .env.example -> .env and set DATABASE_URL.
    // Falls back to localhost so `npx drizzle-kit push` gives a clear connection error instead of a missing-env crash.
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
  verbose: true,
  strict: true,
});
