import { createTransport, getTestMessageUrl } from "nodemailer";
import type { HKEmailer, SendEmailParams } from "../types";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { pretty, render } from "@react-email/render";
import { createTestAccount } from "nodemailer";

export const etherealSender = (): HKEmailer<SMTPTransport.SentMessageInfo> => {
	return {
		async send({ text, from, to, subject, body }: SendEmailParams) {
			const testAccount = await createTestAccount();
			const transporter = createTransport({
				host: testAccount.smtp.host,
				port: testAccount.smtp.port,
				secure: testAccount.smtp.secure,
				auth: {
					user: testAccount.user,
					pass: testAccount.pass,
				},
			});
			const info = await transporter.sendMail({
				from,
				to,
				subject,
				text,
				html: await pretty(await render(body)),
			});
			console.log("Message sent: %s", info.messageId);

			// Get the Ethereal URL to preview this email
			const previewUrl = getTestMessageUrl(info);
			console.log("Preview URL: %s", previewUrl);
			// Output: https://ethereal.email/message/...
			return info;
		},
	};
};
