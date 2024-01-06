import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { env } from "@/env.mjs";

async function sendEmail(to: string, subject: string, html: string) {
	// Create an SES client
	const sesClient = new SESClient({
		region: env.AWS_REGION, // Replace with your AWS region
		credentials: {
			accessKeyId: env.AWS_SES_ACCESS_KEY,
			secretAccessKey: env.AWS_SES_SECRET_ACCESS_KEY,
		},
	});

	// Create the email parameters
	const params = {
		Destination: {
			ToAddresses: [to],
		},
		Message: {
			Body: {
				Html: {
					Charset: "UTF-8",
					Data: html,
				},
			},
			Subject: {
				Charset: "UTF-8",
				Data: subject,
			},
		},
		Source: env.AWS_SES_EMAIL_FROM,
	};

	// Send the email
	try {
		const data = await sesClient.send(new SendEmailCommand(params));
		console.log("Email sent successfully", data);
	} catch (error) {
		console.error("An error occurred", error);
	}
}
