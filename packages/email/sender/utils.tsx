import { RegistrationSuccessEmail } from "../templates/registration";
import { type ComponentProps } from "react";
import { plunk, render } from ".";

type RegistrationEmailBody = ComponentProps<typeof RegistrationSuccessEmail>;

interface SendEmailParams<T> {
	body: T;
	to: string;
	subject: string;
}

export async function sendRegistrationEmail({
	body,
	to,
	subject,
}: SendEmailParams<RegistrationEmailBody>) {
	const renderedBody = await render(<RegistrationSuccessEmail {...body} />);
	let success = true;

	await plunk.emails
		.send({
			to,
			subject,
			body: renderedBody,
		})
		.catch(() => (success = false));

	return success;
}
