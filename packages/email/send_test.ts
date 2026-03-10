import { smtpSender } from "./senders/smtp";
import { createTestAccount, getTestMessageUrl } from "nodemailer";
import TestEmail from "./templates/test";

(async function () {
	const testAccount = await createTestAccount();

	const mailer = smtpSender({
		host: testAccount.smtp.host,
		port: testAccount.smtp.port,
		secure: testAccount.smtp.secure,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
	});

	const info = await mailer.send({
		from: '"Test Sender" <test@example.com>',
		to: "recipient@example.com",
		subject: "Test Email",
		text: "This is a test email sent via Ethereal!",
		body: TestEmail(),
	});

	console.log("Message sent: %s", info.messageId);

	// Get the Ethereal URL to preview this email
	const previewUrl = getTestMessageUrl(info);
	console.log("Preview URL: %s", previewUrl);
	// Output: https://ethereal.email/message/...
})();
