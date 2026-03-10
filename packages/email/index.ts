import { smtpSender } from "./senders/smtp";

export const emailer = smtpSender({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: process.env.SMTP_SECURE === "true",
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});
