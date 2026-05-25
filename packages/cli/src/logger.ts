import { createLogger, type HackKitLogger } from "@hackkit/core";
import type { HackkitConfig } from "./config";

export function createConfigLogger(config: HackkitConfig): HackKitLogger {
	return createLogger(config.logger);
}
