import { createLogger, type HackKitLogger } from "@hackkit/core";
import hackkitConfig from "../hackkit.config";

let logger: HackKitLogger | null = null;

export function getAppLogger(): HackKitLogger {
	if (!logger) {
		logger = createLogger(hackkitConfig.logger);
	}
	return logger;
}
