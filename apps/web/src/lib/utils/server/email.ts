import c from "config";
import { smtpSender, etherealSender } from "email";
import RSVPConfirmationEmail from "email/templates/rsvp-confirmation";
import RegistrationSuccessEmail from "email/templates/registration-confirmation";

// const mailer = smtpSender({
// 	host: process.env.SMTP_HOST,
// 	port: Number(process.env.SMTP_PORT),
// 	secure: process.env.SMTP_SECURE === "true",
// 	auth: {
// 		user: process.env.SMTP_USER,
// 		pass: process.env.SMTP_PASS,
// 	},
// });

// Testing mailer
const mailer = etherealSender();

export const sendRSVPConfirmationEmail = async (email: string, props?: any) => {
	if (c.featureFlags.extra.emailService) {
		await mailer.send({
			from: "<[EMAIL_ADDRESS]>",
			to: email,
			subject: "RSVP Confirmation",
			text: "You have been successfully RSVPed to the event!",
			body: RSVPConfirmationEmail(props),
		});
	}
};

export const sendRegistrationSuccessEmail = async (
	email: string,
	props?: any,
) => {
	if (c.featureFlags.extra.emailService) {
		await mailer.send({
			from: "<[EMAIL_ADDRESS]>",
			to: email,
			subject: "Registration Confirmation",
			text: "You have been successfully registered!",
			body: RegistrationSuccessEmail(props),
		});
	}
};

export const sendExampleEmail = async (email: string) => {
	if (c.featureFlags.extra.emailService) {
		await mailer.send({
			from: "<[EMAIL_ADDRESS]>",
			to: email,
			subject: "Example Email",
			text: "This is an example email.",
			body: "This is an example email.",
		});
	}
};
