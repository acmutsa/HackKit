import { smtpSender, etherealSender } from "email";
import RSVPConfirmationEmail from "email/templates/rsvp-confirmation";

const mailer = smtpSender({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: process.env.SMTP_SECURE === "true",
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

// Testing mailer
// const mailer = etherealSender();

export const sendRSVPConfirmationEmail = async (email: string, props?: any) => {
	await mailer.send({
		from: "<[EMAIL_ADDRESS]>",
		to: email,
		subject: "RSVP Confirmation",
		text: "You have been successfully RSVPed to the event!",
		body: RSVPConfirmationEmail(props),
	});
};
