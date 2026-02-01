import Bottleneck from "bottleneck";
import { emailQueue } from "../queues/email.queue";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  key?: string;
}

const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 50,
});

export class EmailService {
  static async enqueue(payload: EmailPayload) {
    if (!payload.to || !payload.subject || !payload.html) {
      throw new Error("Invalid email payload");
    }

    if (payload.html.length > 500_000) {
      throw new Error("Email body too large");
    }

    const jobId = payload.key || `${payload.to}:${payload.subject}`;

    try {
      return await limiter.schedule(() =>
        emailQueue.add("send", payload, {
          jobId,
        }),
      );
    } catch (err) {
      console.error("Email enqueue failed:", err);
    }
  }
}
