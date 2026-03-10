import { type TestEmailBody } from "./templates/test";
import { type Test2EmailBody } from "./templates/test2";

export type SendEmailParams = {
	from: string;
	to: string;
	text?: string;
	subject: string;
	body: JSX.Element | string;
};

export interface HKEmailer<T> {
	send(params: SendEmailParams): Promise<T>;
}
