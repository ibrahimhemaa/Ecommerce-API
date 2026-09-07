import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
export const sendEmail = asyncHandler(async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const options = {
    from: process.env.SMTP_EMAIL,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(options);
});
