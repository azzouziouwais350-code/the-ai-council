import pg from "pg";
import { Redis } from "ioredis";
import type { Config } from "./config.js";

export interface Services {
  checkPostgres(): Promise<boolean>;
  checkRedis(): Promise<boolean>;
  close(): Promise<void>;
}

export function createServices(config: Config): Services {
  const pool = new pg.Pool({ connectionString: config.DATABASE_URL, max: 10 });
  const redis = new Redis(config.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });
  redis.on("error", () => {
    /* l'état est exposé via /health */
  });

  return {
    async checkPostgres() {
      try {
        await pool.query("SELECT 1");
        return true;
      } catch {
        return false;
      }
    },
    async checkRedis() {
      try {
        if (redis.status === "wait" || redis.status === "end") await redis.connect();
        return (await redis.ping()) === "PONG";
      } catch {
        return false;
      }
    },
    async close() {
      await pool.end().catch(() => undefined);
      redis.disconnect();
    },
  };
}
