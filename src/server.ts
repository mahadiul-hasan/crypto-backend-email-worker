import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { emailQueue } from "./email/queues/email.queue";
import { getQuota } from "./email/utils/quota";
import { redis } from "./config/redis";

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json()); // IMPORTANT

app.post("/internal/email/send", async (req: Request, res: Response) => {
  const { to, subject, html, key } = req.body;

  const secure_key = req.headers["x-internal-key"];

  if (secure_key !== process.env.EMAIL_INTERNAL_KEY) {
    return res.sendStatus(401);
  }

  if (!to || !subject || !html) {
    return res.status(400).json({
      error: "Invalid email payload",
    });
  }

  await emailQueue.add("send", {
    to,
    subject,
    html,
    key,
  });

  res.json({ status: "queued" });
});

app.get("/admin/email/providers", async (req, res) => {
  const providers = ["gmail", "outlook"];

  const result: any = {};

  for (const p of providers) {
    const down = await redis.get(`email:provider:down:${p}`);

    result[p] = {
      healthy: !down,
      disabledUntil: down ? "temporary" : null,
    };
  }

  res.json(result);
});

app.get("/admin/email/health", async (req, res) => {
  const stats = {
    queue: {
      waiting: await emailQueue.getWaitingCount(),
      active: await emailQueue.getActiveCount(),
      failed: await emailQueue.getFailedCount(),
    },

    quota: {
      gmail: await getQuota("gmail"),
      outlook: await getQuota("outlook"),
    },

    status: "ok",
  };

  res.json(stats);
});

app.listen(port, () => {
  console.log(`📧 Email service listening on ${port}`);
});
