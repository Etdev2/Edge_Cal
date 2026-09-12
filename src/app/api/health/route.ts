import { isDatabaseConfigured, getDb } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return Response.json(
      {
        ok: true,
        db: "unconfigured",
        message:
          "App is running in demo memory mode. Set DATABASE_URL in Vercel → Project Settings → Environment Variables to enable PostgreSQL persistence.",
      },
      { status: 200 }
    );
  }
  try {
    await getDb().execute(sql`select 1`);
    return Response.json({ ok: true, db: "connected" });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        db: "error",
        message: error instanceof Error ? error.message : "Database query failed",
      },
      { status: 200 }
    );
  }
}
