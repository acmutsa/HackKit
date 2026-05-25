export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL_RANK: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

export type HackKitLoggerOptions = {
	disabled?: boolean;
	disableColors?: boolean;
	level?: LogLevel;
	log?: (level: LogLevel, message: string, ...args: unknown[]) => void;
};

export type HackKitLogger = {
	disabled: boolean;
	level: LogLevel;
	log: (level: LogLevel, message: string, ...args: unknown[]) => void;
};

export type DomainLogContext = {
	outcome: "success" | "error";
	actorAuthId?: string;
	targetAuthId?: string;
	eventId?: string;
	roleId?: string;
	errorCode?: string;
	errorMessage?: string;
};

export function resolveDefaultLogLevel(): LogLevel {
	return process.env.NODE_ENV === "production" ? "warn" : "info";
}

function shouldLog(logger: HackKitLogger, level: LogLevel): boolean {
	if (logger.disabled) return false;
	return LOG_LEVEL_RANK[level] >= LOG_LEVEL_RANK[logger.level];
}

export function createDefaultLogger(
	options: HackKitLoggerOptions = {},
): HackKitLogger {
	const level = options.level ?? resolveDefaultLogLevel();
	const disabled = options.disabled ?? false;

	const log =
		options.log ??
		((logLevel, message, ...args) => {
			const line = `[hackkit:${logLevel}] ${message}`;
			switch (logLevel) {
				case "debug":
					console.debug(line, ...args);
					break;
				case "info":
					console.info(line, ...args);
					break;
				case "warn":
					console.warn(line, ...args);
					break;
				case "error":
					console.error(line, ...args);
					break;
			}
		});

	return {
		disabled,
		level,
		log(logLevel, message, ...args) {
			if (!shouldLog(this, logLevel)) return;
			log(logLevel, message, ...args);
		},
	};
}

export function createLogger(options: HackKitLoggerOptions = {}): HackKitLogger {
	return createDefaultLogger(options);
}

export function logDomain(
	logger: HackKitLogger,
	level: LogLevel,
	action: string,
	context: DomainLogContext,
	message = action,
): void {
	logger.log(level, message, { action, ...context });
}
