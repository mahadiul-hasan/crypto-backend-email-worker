"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmailLimit = checkEmailLimit;
const redis_1 = require("../../config/redis");
async function checkEmailLimit(userId) {
    const key = `email:limit:${userId}`;
    const result = await redis_1.redis.eval(`
    local count = redis.call("GET", KEYS[1])

    if count and tonumber(count) >= 3 then
      return -1
    end

    redis.call("INCR", KEYS[1])
    redis.call("EXPIRE", KEYS[1], 3600)

    return 1
    `, 1, key);
    if (result === -1) {
        throw new Error("Email limit exceeded");
    }
}
//# sourceMappingURL=emailLimiter.js.map