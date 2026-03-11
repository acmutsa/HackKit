import { createTransport } from "nodemailer";
import type { HKEmailer, SendEmailParams } from "../types";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { pretty, render } from "@react-email/render";

export const smtpSender = (
	transporterConfig: SMTPTransport.Options,
): HKEmailer<SMTPTransport.SentMessageInfo> => {
	const transporter = createTransport(transporterConfig);
	return {
		async send({ text, from, to, subject, body }: SendEmailParams) {
			return await transporter.sendMail({
				from,
				to,
				subject,
				text,
				html: await pretty(await render(body)),
			});
		},
	};
};
