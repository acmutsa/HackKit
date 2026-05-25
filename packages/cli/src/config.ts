import type { HackKitPlugin } from "@hackkit/core";
import type {
	EventTypesInput,
	HackKitLoggerOptions,
	UserDataOptionsInput,
} from "@hackkit/core";
import type { AuthAdapter } from "@hackkit/core";

export type HackkitBlobLocalConfig = {
	adapter: "local";
	baseDir: string;
	filesRoutePrefix?: string;
};

export type HackkitBlobS3Config = {
	adapter: "s3";
	bucket: string;
	region: string;
	endpoint?: string;
	accessKeyId?: string;
	secretAccessKey?: string;
	publicUrlBase?: string;
	filesRoutePrefix?: string;
};

export type HackkitBlobConfig = HackkitBlobLocalConfig | HackkitBlobS3Config;

export type HackkitSeedRole = {
	id: string;
	name: string;
	position: number;
	permissions: `${string}.${string}`[];
	color?: string;
};

export type HackkitConfig = {
	plugins?: readonly HackKitPlugin[];
	databaseUrl: string;
	userDataOptions?: UserDataOptionsInput;
	eventTypes?: EventTypesInput;
	auth?: Pick<AuthAdapter, "syncStorage">;
	logger?: HackKitLoggerOptions;
	requireApproval?: boolean;
	defaultCompetitorRoleId?: string;
	seedRoles?: readonly HackkitSeedRole[];
	blob?: HackkitBlobConfig;
};

export function defineHackkitConfig<const T extends HackkitConfig>(
	config: T,
): T {
	return config;
}
