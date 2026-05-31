import { createLogger, type HackKitLogger } from "@hackkit/core";
import { appConfig } from "./app-config";

let logger: HackKitLogger | null = null;

export function getAppLogger(): HackKitLogger {
	if (!logger) {
		logger = createLogger(appConfig.logger);
	}
	return logger;
}
