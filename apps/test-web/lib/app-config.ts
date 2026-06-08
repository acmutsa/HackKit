import "server-only";

import { resolveHackkitConfig } from "@hackkit/config";
import hackkitConfig from "../hackkit.config";
import { env } from "../env";

export const appConfig = resolveHackkitConfig(hackkitConfig);

export function resolveAppBaseUrl(): string {
	return env.appUrl;
}
