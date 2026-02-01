"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailDLQ = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
exports.emailDLQ = new bullmq_1.Queue("email-dlq", {
    connection: redis_1.redis,
});
//# sourceMappingURL=email.dlq.js.map