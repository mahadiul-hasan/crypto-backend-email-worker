import { Queue } from "bullmq";
import { redis } from "../../config/redis";

export const emailDLQ = new Queue("email-dlq", {
  connection: redis,
});
