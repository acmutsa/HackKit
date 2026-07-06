import net from "node:net";
import tls from "node:tls";
import type { EmailMessage, EmailProvider } from "./api";

export type ResendEmailProviderOptions = {
	apiKey: string;
	endpoint?: string;
};

type ResendResponse = {
	id?: string;
	error?: { message?: string };
};

function parseResendResponse(value: unknown): ResendResponse {
	if (!value || typeof value !== "object") return {};
	return value as ResendResponse;
}

export function createResendEmailProvider(
	options: ResendEmailProviderOptions,
): EmailProvider {
	return {
		id: "resend",
		async send(message) {
			const response = await fetch(
				options.endpoint ?? "https://api.resend.com/emails",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${options.apiKey}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						from: message.from,
						to: [message.to],
						reply_to: message.replyTo,
						subject: message.subject,
						text: message.text,
						html: message.html,
					}),
				},
			);
			const body = parseResendResponse(await response.json().catch(() => ({})));
			if (!response.ok) {
				throw new Error(
					body.error?.message ??
						`Resend email request failed with ${response.status}.`,
				);
			}
			return { id: body.id, metadata: { providerStatus: response.status } };
		},
	};
}

export type SmtpEmailProviderOptions = {
	host: string;
	port?: number;
	secure?: boolean;
	username?: string;
	password?: string;
	heloName?: string;
};

type Socket = net.Socket | tls.TLSSocket;

function encodeBase64(value: string): string {
	return Buffer.from(value, "utf8").toString("base64");
}

function encodeHeader(value: string): string {
	if (/^[\x20-\x7e]*$/.test(value)) return value;
	return `=?UTF-8?B?${encodeBase64(value)}?=`;
}

function normalizeAddress(value: string): string {
	const match = value.match(/<([^>]+)>/);
	return (match?.[1] ?? value).trim();
}

function buildSmtpMessage(message: EmailMessage): string {
	const headers = [
		`From: ${message.from}`,
		`To: ${message.to}`,
		message.replyTo ? `Reply-To: ${message.replyTo}` : null,
		`Subject: ${encodeHeader(message.subject)}`,
		"MIME-Version: 1.0",
		message.html
			? 'Content-Type: multipart/alternative; boundary="hackkit-notification"'
			: 'Content-Type: text/plain; charset="UTF-8"',
	].filter(Boolean);

	if (!message.html) {
		return `${headers.join("\r\n")}\r\n\r\n${message.text}`;
	}

	return `${headers.join("\r\n")}\r\n\r\n--hackkit-notification\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${message.text}\r\n--hackkit-notification\r\nContent-Type: text/html; charset="UTF-8"\r\n\r\n${message.html}\r\n--hackkit-notification--`;
}

class SmtpClient {
	private socket: Socket;
	private buffer = "";

	constructor(socket: Socket) {
		this.socket = socket;
		this.socket.setEncoding("utf8");
		this.socket.on("data", (chunk) => {
			this.buffer += chunk;
		});
	}

	static connect(options: SmtpEmailProviderOptions): Promise<SmtpClient> {
		const port = options.port ?? (options.secure ? 465 : 587);
		const socket = options.secure
			? tls.connect({ host: options.host, port, servername: options.host })
			: net.connect({ host: options.host, port });
		return new Promise((resolve, reject) => {
			socket.once("error", reject);
			socket.once("connect", () => resolve(new SmtpClient(socket)));
		});
	}

	async close(): Promise<void> {
		this.socket.end();
	}

	async readResponse(): Promise<string> {
		return new Promise((resolve, reject) => {
			const onError = (error: Error) => {
				cleanup();
				reject(error);
			};
			const onData = () => {
				const lines = this.buffer.split(/\r?\n/).filter(Boolean);
				const last = lines.at(-1);
				if (!last || !/^\d{3} /.test(last)) return;
				const response = this.buffer;
				this.buffer = "";
				cleanup();
				resolve(response);
			};
			const cleanup = () => {
				this.socket.off("error", onError);
				this.socket.off("data", onData);
			};
			this.socket.on("error", onError);
			this.socket.on("data", onData);
			onData();
		});
	}

	async command(command: string, expected: readonly number[]): Promise<string> {
		this.socket.write(`${command}\r\n`);
		const response = await this.readResponse();
		const code = Number(response.slice(0, 3));
		if (!expected.includes(code)) {
			throw new Error(`SMTP command failed: ${response.trim()}`);
		}
		return response;
	}

	async upgradeToTls(host: string): Promise<SmtpClient> {
		const secureSocket = tls.connect({
			socket: this.socket,
			servername: host,
		});
		return new Promise((resolve, reject) => {
			secureSocket.once("error", reject);
			secureSocket.once("secureConnect", () => resolve(new SmtpClient(secureSocket)));
		});
	}
}

export function createSmtpEmailProvider(
	options: SmtpEmailProviderOptions,
): EmailProvider {
	return {
		id: "smtp",
		async send(message) {
			let client = await SmtpClient.connect(options);
			await client.readResponse();
			const heloName = options.heloName ?? "hackkit.local";
			const ehlo = await client.command(`EHLO ${heloName}`, [250]);
			if (!options.secure && ehlo.includes("STARTTLS")) {
				await client.command("STARTTLS", [220]);
				client = await client.upgradeToTls(options.host);
				await client.command(`EHLO ${heloName}`, [250]);
			}
			if (options.username && options.password) {
				await client.command("AUTH LOGIN", [334]);
				await client.command(encodeBase64(options.username), [334]);
				await client.command(encodeBase64(options.password), [235]);
			}
			await client.command(`MAIL FROM:<${normalizeAddress(message.from)}>`, [250]);
			await client.command(`RCPT TO:<${normalizeAddress(message.to)}>`, [250, 251]);
			await client.command("DATA", [354]);
			await client.command(`${buildSmtpMessage(message)}\r\n.`, [250]);
			await client.command("QUIT", [221]);
			await client.close();
			return { metadata: { host: options.host, port: options.port } };
		},
	};
}
