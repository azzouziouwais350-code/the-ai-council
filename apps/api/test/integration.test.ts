import { afterAll, describe, expect, it } from "vitest";
import pg from "pg";
import { Redis } from "ioredis";
import { buildApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";
import { createServices } from "../src/services.js";

// Exécutés uniquement avec RUN_INTEGRATION=1 et DATABASE_URL / REDIS_URL pointant
// vers de vrais services (voir `pnpm test:integration` et scripts/verify-docker.sh).
const enabled = process.env.RUN_INTEGRATION === "1";

describe.skipIf(!enabled)("intégration PostgreSQL + Redis réels", () => {
  const config = enabled ? loadConfig() : undefined!;
  const pool = enabled ? new pg.Pool({ connectionString: config.DATABASE_URL }) : undefined!;
  const redis = enabled ? new Redis(config.REDIS_URL) : undefined!;

  afterAll(async () => {
    await pool?.end();
    redis?.disconnect();
  });

  it("PostgreSQL : connexion et aller-retour d'écriture/lecture", async () => {
    const version = await pool.query<{ v: string }>("SELECT version() AS v");
    expect(version.rows[0]?.v).toMatch(/^PostgreSQL/);

    const client = await pool.connect();
    try {
      await client.query("CREATE TEMP TABLE council_probe (id int PRIMARY KEY, label text NOT NULL)");
      await client.query("INSERT INTO council_probe VALUES ($1, $2)", [1, "ok"]);
      const res = await client.query("SELECT label FROM council_probe WHERE id = 1");
      expect(res.rows[0]?.label).toBe("ok");
    } finally {
      client.release();
    }
  });

  it("Redis : PING et aller-retour SET/GET avec expiration", async () => {
    expect(await redis.ping()).toBe("PONG");
    await redis.set("council:probe", "ok", "EX", 30);
    expect(await redis.get("council:probe")).toBe("ok");
    await redis.del("council:probe");
  });

  it("GET /health renvoie 200 avec les vrais services", async () => {
    const app = await buildApp(config, createServices(config));
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: "ok", services: { postgres: true, redis: true } });
    await app.close();
  });
});
