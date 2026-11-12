import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import type { HealthStatus } from "@council/shared";
import type { Config } from "./config.js";
import type { Services } from "./services.js";

export const API_VERSION = "2.0.0";

export async function buildApp(config: Config, services: Services): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.NODE_ENV === "test" ? false : { level: config.LOG_LEVEL, redact: ["req.headers.authorization"] },
  });

  await app.register(helmet);
  await app.register(cors, { origin: config.WEB_ORIGIN });

  app.get("/health", async (_req, reply) => {
    const [postgres, redis] = await Promise.all([services.checkPostgres(), services.checkRedis()]);
    const body: HealthStatus = {
      status: postgres && redis ? "ok" : "degraded",
      services: { postgres, redis },
      version: API_VERSION,
    };
    return reply.code(body.status === "ok" ? 200 : 503).send(body);
  });

  app.addHook("onClose", async () => {
    await services.close();
  });

  return app;
}
