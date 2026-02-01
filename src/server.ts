import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { emailQueue } from "./email/queues/email.queue";

const app = express();
const port = process.env.PORT || 5001;

app.get("/admin/email/health", async (req: Request, res: Response) => {
  const stats = {
    waiting: await emailQueue.getWaitingCount(),
    active: await emailQueue.getActiveCount(),
    failed: await emailQueue.getFailedCount(),
  };

  res.json(stats);
});

app.listen(port, () => {
  console.log(`email-worker listening on port ${port}`);
});
