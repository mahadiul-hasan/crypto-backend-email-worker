"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const email_queue_1 = require("../queues/email.queue");
const email_dlq_1 = require("../queues/email.dlq");
const mailer_1 = require("../utils/mailer");
const worker = new bullmq_1.Worker(email_queue_1.EMAIL_QUEUE, async (job) => {
    const { to, subject, html } = job.data;
    if (!to || !subject || !html) {
        throw new Error("Invalid email payload");
    }
    await (0, mailer_1.sendMail)({ to, subject, html });
}, {
    connection: redis_1.redis,
    concurrency: 5,
    limiter: {
        max: 20,
        duration: 1000,
    },
    lockDuration: 30000,
    stalledInterval: 30000,
    maxStalledCount: 2,
});
worker.on("failed", async (job, err) => {
    if (!job)
        return;
    console.error("Email job failed:", {
        id: job.id,
        to: job.data?.to,
        error: err.message,
    });
    await email_dlq_1.emailDLQ.add("failed-email", {
        data: job.data,
        error: err.message,
        stack: err.stack,
    });
});
const shutdown = async () => {
    console.log("📧 Shutting down email worker...");
    await worker.close();
    process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
console.log("📧 Email Worker Started");
//# sourceMappingURL=email.worker.js.map