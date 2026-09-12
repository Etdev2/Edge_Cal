import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // In CI/Vercel this comes from the project Environment Variables panel.
    // Locally, copy .env.example -> .env and set DATABASE_URL.
    // Never commit a credential or localhost default. Set DATABASE_URL in the
    // shell, .env, or Vercel project settings before running Drizzle commands.
    url: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
