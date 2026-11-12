export const PROVIDERS = ["openai", "anthropic", "xai", "deepseek"] as const;

export type ProviderId = (typeof PROVIDERS)[number];

export interface HealthStatus {
  status: "ok" | "degraded";
  services: {
    postgres: boolean;
    redis: boolean;
  };
  version: string;
}
