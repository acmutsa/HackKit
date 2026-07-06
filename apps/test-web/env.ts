type BlobAdapter = "local" | "s3";
type EmailProvider = "none" | "resend" | "smtp";

type TestWebEnv = {
	nodeEnv: "development" | "test" | "production";
	appUrl: string;
	betterAuthUrl: string;
	betterAuthSecret: string;
	betterAuthTrustedOrigins: string[];
	databaseUrl: string;
	tursoAuthToken?: string;
	blobAdapter: BlobAdapter;
	localBlobBaseDir: string;
	s3Bucket?: string;
	s3Region?: string;
	s3Endpoint?: string;
	s3AccessKeyId?: string;
	s3SecretAccessKey?: string;
	ownerEmailAllowlist: string[];
	ownerAuthIdAllowlist: string[];
	githubClientId?: string;
	githubClientSecret?: string;
	googleClientId?: string;
	googleClientSecret?: string;
	emailProvider: EmailProvider;
	emailFrom?: string;
	emailReplyTo?: string;
	resendApiKey?: string;
	smtpHost?: string;
	smtpPort?: number;
	smtpSecure: boolean;
	smtpUsername?: string;
	smtpPassword?: string;
	discordGuildId: string;
	discordVerificationBaseUrl: string;
	discordBotApiUrl?: string;
	discordInternalAuthKey?: string;
	discordParticipantRoleId?: string;
	discordParticipantRoleName?: string;
};

function read(name: string): string | undefined {
	const value = process.env[name];
	return value && value.trim() ? value.trim() : undefined;
}

function readList(name: string): string[] {
	return (
		read(name)
			?.split(",")
			.map((value) => value.trim())
			.filter(Boolean) ?? []
	);
}

function requireEnv(name: string): string {
	const value = read(name);
	if (!value)
		throw new Error(`Missing required environment variable: ${name}`);
	return value;
}

function resolveNodeEnv(): TestWebEnv["nodeEnv"] {
	if (process.env.NODE_ENV === "production") return "production";
	if (process.env.NODE_ENV === "test") return "test";
	return "development";
}

function resolveBlobAdapter(nodeEnv: TestWebEnv["nodeEnv"]): BlobAdapter {
	const adapter = read("HACKKIT_BLOB_ADAPTER");
	if (adapter === "local" || adapter === "s3") return adapter;
	return nodeEnv === "production" ? "s3" : "local";
}

function resolveEmailProvider(): EmailProvider {
	const provider = read("HACKKIT_EMAIL_PROVIDER");
	if (provider === "resend" || provider === "smtp") return provider;
	return "none";
}

function readNumber(name: string): number | undefined {
	const value = read(name);
	if (!value) return undefined;
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) {
		throw new Error(`${name} must be a number.`);
	}
	return parsed;
}

function readBoolean(name: string, defaultValue: boolean): boolean {
	const value = read(name);
	if (!value) return defaultValue;
	if (["1", "true", "yes"].includes(value.toLowerCase())) return true;
	if (["0", "false", "no"].includes(value.toLowerCase())) return false;
	throw new Error(`${name} must be a boolean.`);
}

function assertProductionEnv(env: TestWebEnv): void {
	if (env.nodeEnv !== "production") return;

	if (
		env.betterAuthSecret === "test-web-development-secret-change-me-please"
	) {
		throw new Error("BETTER_AUTH_SECRET must be set in production.");
	}
	if (env.betterAuthSecret.length < 32) {
		throw new Error(
			"BETTER_AUTH_SECRET must be at least 32 characters in production.",
		);
	}

	if (env.appUrl.startsWith("http://localhost")) {
		throw new Error(
			"NEXT_PUBLIC_APP_URL or BETTER_AUTH_URL must be set in production.",
		);
	}

	if (env.databaseUrl.startsWith("file:")) {
		throw new Error(
			"DATABASE_URL must point to remote libSQL/Turso in production.",
		);
	}

	if (!env.tursoAuthToken) {
		throw new Error("TURSO_AUTH_TOKEN must be set in production.");
	}

	if (env.blobAdapter !== "s3") {
		throw new Error("HACKKIT_BLOB_ADAPTER must be s3 in production.");
	}

	if (!env.discordGuildId) {
		throw new Error("DISCORD_GUILD_ID must be set in production.");
	}
	if (!env.discordBotApiUrl) {
		throw new Error("DISCORD_BOT_API_URL must be set in production.");
	}
	if (!env.discordInternalAuthKey) {
		throw new Error("DISCORD_INTERNAL_AUTH_KEY must be set in production.");
	}
	if (!env.discordParticipantRoleId && !env.discordParticipantRoleName) {
		throw new Error(
			"DISCORD_PARTICIPANT_ROLE_ID or DISCORD_PARTICIPANT_ROLE_NAME must be set in production.",
		);
	}

	for (const name of [
		"HACKKIT_S3_BUCKET",
		"HACKKIT_S3_REGION",
		"HACKKIT_S3_ACCESS_KEY_ID",
		"HACKKIT_S3_SECRET_ACCESS_KEY",
	] as const) {
		requireEnv(name);
	}
}

export function resolveTestWebEnv(): TestWebEnv {
	const nodeEnv = resolveNodeEnv();
	const appUrl =
		read("NEXT_PUBLIC_APP_URL") ??
		read("BETTER_AUTH_URL") ??
		"http://localhost:3000";
	const betterAuthUrl = read("BETTER_AUTH_URL") ?? appUrl;
	const blobAdapter = resolveBlobAdapter(nodeEnv);
	const emailProvider = resolveEmailProvider();

	const env: TestWebEnv = {
		nodeEnv,
		appUrl,
		betterAuthUrl,
		betterAuthSecret:
			read("BETTER_AUTH_SECRET") ??
			"test-web-development-secret-change-me-please",
		betterAuthTrustedOrigins: readList("BETTER_AUTH_TRUSTED_ORIGINS"),
		databaseUrl: read("DATABASE_URL") ?? "file:.data/test-web.db",
		tursoAuthToken: read("TURSO_AUTH_TOKEN"),
		blobAdapter,
		localBlobBaseDir:
			read("HACKKIT_LOCAL_BLOB_BASE_DIR") ?? ".data/uploads",
		s3Bucket: read("HACKKIT_S3_BUCKET") ?? read("S3_BUCKET"),
		s3Region: read("HACKKIT_S3_REGION") ?? read("S3_REGION"),
		s3Endpoint: read("HACKKIT_S3_ENDPOINT") ?? read("S3_ENDPOINT"),
		s3AccessKeyId:
			read("HACKKIT_S3_ACCESS_KEY_ID") ?? read("S3_ACCESS_KEY_ID"),
		s3SecretAccessKey:
			read("HACKKIT_S3_SECRET_ACCESS_KEY") ??
			read("S3_SECRET_ACCESS_KEY"),
		ownerEmailAllowlist: readList("HACKKIT_OWNER_EMAIL_ALLOWLIST").map(
			(email) => email.toLowerCase(),
		),
		ownerAuthIdAllowlist: readList("HACKKIT_OWNER_AUTH_ID_ALLOWLIST"),
		githubClientId: read("GITHUB_CLIENT_ID"),
		githubClientSecret: read("GITHUB_CLIENT_SECRET"),
		googleClientId: read("GOOGLE_CLIENT_ID"),
		googleClientSecret: read("GOOGLE_CLIENT_SECRET"),
		emailProvider,
		emailFrom: read("HACKKIT_EMAIL_FROM"),
		emailReplyTo: read("HACKKIT_EMAIL_REPLY_TO"),
		resendApiKey: read("RESEND_API_KEY"),
		smtpHost: read("SMTP_HOST"),
		smtpPort: readNumber("SMTP_PORT"),
		smtpSecure: readBoolean("SMTP_SECURE", false),
		smtpUsername: read("SMTP_USERNAME"),
		smtpPassword: read("SMTP_PASSWORD"),
		discordGuildId: read("DISCORD_GUILD_ID") ?? "development-guild",
		discordVerificationBaseUrl:
			read("DISCORD_VERIFICATION_BASE_URL") ?? appUrl,
		discordBotApiUrl: read("DISCORD_BOT_API_URL") ?? read("BOT_API_URL"),
		discordInternalAuthKey:
			read("DISCORD_INTERNAL_AUTH_KEY") ?? read("INTERNAL_AUTH_KEY"),
		discordParticipantRoleId: read("DISCORD_PARTICIPANT_ROLE_ID"),
		discordParticipantRoleName: read("DISCORD_PARTICIPANT_ROLE_NAME"),
	};

	assertProductionEnv(env);
	return env;
}

export const env = resolveTestWebEnv();
