import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";
import type { Services } from "../src/services.js";

const config = loadConfig({
  NODE_ENV: "test",
  DATABASE_URL: "postgres://u:p@localhost:5432/db",
  REDIS_URL: "redis://localhost:6379",
});

const services = (pg: boolean, redis: boolean): Services => ({
  checkPostgres: async () => pg,
  checkRedis: async () => redis,
  close: async () => undefined,
});

describe("GET /health", () => {
  it("renvoie 200 quand Postgres et Redis répondent", async () => {
    const app = await buildApp(config, services(true, true));
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: "ok", services: { postgres: true, redis: true } });
    await app.close();
  });

  it("renvoie 503 quand un service est indisponible", async () => {
    const app = await buildApp(config, services(true, false));
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(503);
    expect(res.json()).toMatchObject({ status: "degraded", services: { postgres: true, redis: false } });
    await app.close();
  });
});

describe("loadConfig", () => {
  it("échoue sans DATABASE_URL", () => {
    expect(() => loadConfig({ REDIS_URL: "redis://x" })).toThrow(/DATABASE_URL/);
  });

  it("traite une clé API vide comme absente", () => {
    const c = loadConfig({ DATABASE_URL: "x", REDIS_URL: "y", OPENAI_API_KEY: "" });
    expect(c.OPENAI_API_KEY).toBeUndefined();
  });
});
