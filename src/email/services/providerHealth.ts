import { redis } from "../../config/redis";

/**
 * Mark provider unhealthy for N seconds
 */
export async function markUnhealthy(
  provider: string,
  ttl = 300, // 5 min
) {
  await redis.set(`email:provider:down:${provider}`, "1", "EX", ttl);
}

/**
 * Check if provider is healthy
 */
export async function isHealthy(provider: string) {
  const v = await redis.get(`email:provider:down:${provider}`);

  return !v;
}

/**
 * Reset health (manual / auto)
 */
export async function markHealthy(provider: string) {
  await redis.del(`email:provider:down:${provider}`);
}
