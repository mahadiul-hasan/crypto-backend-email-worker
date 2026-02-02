import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { redis } from "../../config/redis";
import { EMAIL_QUEUE } from "../queues/email.queue";
import { emailDLQ } from "../queues/email.dlq";
import { sendWithFallback } from "../services/router";
import { wasSent, markSent } from "../utils/deliveryState";

const worker = new Worker(
  EMAIL_QUEUE,

  async (job) => {
    const jobId = String(job.id);

    if (await wasSent(jobId)) {
      console.log(`♻️ Skipping duplicate send ${jobId}`);
      return;
    }

    const { to, subject, html } = job.data;

    if (!to || !subject || !html) {
      throw new Error("Invalid email payload");
    }

    await sendWithFallback(to, subject, html);
    await markSent(jobId);
  },

  {
    connection: redis,
    concurrency: 5,

    limiter: {
      max: 20,
      duration: 1000,
    },
    lockDuration: 30000,
    stalledInterval: 30000,
    maxStalledCount: 2,
  },
);

worker.on("failed", async (job, err) => {
  if (!job) return;

  console.error("Email job failed:", {
    id: job.id,
    to: job.data?.to,
    error: err.message,
  });

  await emailDLQ.add("failed-email", {
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
