import nodemailer from "nodemailer";
import { MailProvider } from "./provider.interface";
import { checkDailyQuota } from "../utils/quota";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.OUTLOOK_USER,
    pass: process.env.OUTLOOK_PASS,
  },
});

export const OutlookProvider: MailProvider = {
  name: "outlook",
  limit: 400,

  async send(to, subject, html) {
    await checkDailyQuota("outlook", this.limit);

    await transporter.sendMail({
      from: process.env.OUTLOOK_FROM,
      to,
      subject,
      html,
    });
  },
};
