import "server-only";

export const BALLDONTLIE_SOURCE = "BALLDONTLIE_API" as const;
const BALLDONTLIE_BASE_URL = "https://api.balldontlie.io/v1";
const REQUEST_TIMEOUT_MS = 10_000;

export interface BallDontLiePage<T> {
  data: T[];
  meta?: {
    next_cursor?: number;
    per_page?: number;
  };
}

export interface BallDontLieClient {
  request<T>(path: string, params?: Record<string, string | number>): Promise<BallDontLiePage<T>>;
}

/**
 * Server-only provider boundary. The demo analysis path intentionally keeps
 * using the deterministic memory/Drizzle fallback until a licensed key and
 * ingestion job are provisioned. Keeping this client typed and isolated means
 * provider fields do not leak into the domain evidence functions.
 */
export function createBallDontLieClient(
  apiKey: string | undefined = process.env.BALLDONTLIE_API_KEY
): BallDontLieClient | null {
  if (!apiKey?.trim()) return null;

  return {
    async request<T>(
      path: string,
      params: Record<string, string | number> = {}
    ) {
      const url = new URL(`${BALLDONTLIE_BASE_URL}${path}`);
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch(url, {
          headers: { Authorization: apiKey },
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`BALLDONTLIE request failed with HTTP ${response.status}`);
        }
        return (await response.json()) as BallDontLiePage<T>;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
