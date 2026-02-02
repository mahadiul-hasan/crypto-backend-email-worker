import { redis } from "../../config/redis";

export async function markSent(jobId: string) {
  await redis.set(
    `email:sent:${jobId}`,
    "1",
    "EX",
    86400 * 7, // 7 days
  );
}

export async function wasSent(jobId: string) {
  return !!(await redis.get(`email:sent:${jobId}`));
}
