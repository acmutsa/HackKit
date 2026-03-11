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
