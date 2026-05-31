import "server-only";

import { resolveHackkitConfig } from "@hackkit/config";
import hackkitConfig from "../hackkit.config";

export const appConfig = resolveHackkitConfig(hackkitConfig);

export function resolveAppBaseUrl(): string {
	return (
		process.env.BETTER_AUTH_URL ??
		process.env.NEXT_PUBLIC_APP_URL ??
		"http://localhost:3000"
	);
}
