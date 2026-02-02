import { redis } from "../../config/redis";

export async function checkDailyQuota(provider: string, limit: number) {
  const today = new Date().toISOString().slice(0, 10);

  const key = `email:quota:${provider}:${today}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 86400);
  }

  if (count > limit) {
    throw new Error(`${provider} daily quota exceeded`);
  }

  return count;
}

export async function getQuota(provider: string) {
  const today = new Date().toISOString().slice(0, 10);

  const key = `email:quota:${provider}:${today}`;

  const val = await redis.get(key);

  return Number(val || 0);
}
