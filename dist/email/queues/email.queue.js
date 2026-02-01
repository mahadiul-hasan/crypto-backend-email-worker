"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = exports.EMAIL_QUEUE = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
exports.EMAIL_QUEUE = "email-queue";
exports.emailQueue = new bullmq_1.Queue(exports.EMAIL_QUEUE, {
    connection: redis_1.redis,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
//# sourceMappingURL=email.queue.js.map