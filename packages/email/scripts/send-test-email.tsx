import { createInterface } from "readline";
import { sendRegistrationEmail } from "../sender";

const reader = createInterface({
	input: process.stdin,
	output: process.stdout,
});

reader.question(
	"Enter the email address you would like to recieve the email: ",
	async (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			reader.write("Invalid email address entered.\n");
			reader.close();
			return;
		}

		await sendRegistrationEmail({
			to: email,
			subject: "Test Email",
			body: {
				email,
				firstName: "Someone",
				lastName: "Important",
				hackerTag: "jdoe",
			},
		});

		reader.write(`Email sent check the email address: ${email}.\n`);
		reader.close();
	},
);
