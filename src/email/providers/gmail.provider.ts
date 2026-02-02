import nodemailer from "nodemailer";
import { MailProvider } from "./provider.interface";
import { checkDailyQuota } from "../utils/quota";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  pool: true,
  maxConnections: 5,
  maxMessages: 100,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const GmailProvider: MailProvider = {
  name: "gmail",
  limit: 400,

  async send(to, subject, html) {
    await checkDailyQuota("gmail", this.limit);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  },
};
