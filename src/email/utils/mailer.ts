import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  pool: true,
  maxConnections: 5,
  maxMessages: 100,

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendMail(data: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.to,
    subject: data.subject,
    html: data.html,
  });
}
