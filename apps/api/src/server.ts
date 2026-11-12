import { buildApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createServices } from "./services.js";

async function main() {
  const config = loadConfig();
  const app = await buildApp(config, createServices(config));

  const shutdown = async () => {
    await app.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await app.listen({ host: config.API_HOST, port: config.API_PORT });
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
