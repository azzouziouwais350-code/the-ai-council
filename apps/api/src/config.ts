import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_HOST: z.string().default("0.0.0.0"),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  WEB_ORIGIN: z.string().url().default("http://localhost:5173"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  OPENAI_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  ANTHROPIC_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  XAI_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  DEEPSEEK_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
});

export type Config = z.infer<typeof envSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Configuration invalide — variables : ${fields}`);
  }
  return parsed.data;
}
