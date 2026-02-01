import { redis } from "../../config/redis";

export async function checkEmailLimit(userId: string) {
  const key = `email:limit:${userId}`;

  const result = await redis.eval(
    `
    local count = redis.call("GET", KEYS[1])

    if count and tonumber(count) >= 3 then
      return -1
    end

    redis.call("INCR", KEYS[1])
    redis.call("EXPIRE", KEYS[1], 3600)

    return 1
    `,
    1,
    key,
  );

  if (result === -1) {
    throw new Error("Email limit exceeded");
  }
}
