import { Queue } from "bullmq";
import { redis } from "../../config/redis";

export const EMAIL_QUEUE = "email-queue";

export const emailQueue = new Queue(EMAIL_QUEUE, {
  connection: redis,

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
