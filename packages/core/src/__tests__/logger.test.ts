import { describe, expect, it, vi } from "vitest";
import { createLogger } from "../adapters/logger";

describe("HackKit Logger", () => {
	it("respects minimum log level", () => {
		const log = vi.fn();
		const logger = createLogger({ level: "warn", log });

		logger.log("debug", "debug message");
		logger.log("info", "info message");
		logger.log("warn", "warn message");
		logger.log("error", "error message");

		expect(log).toHaveBeenCalledTimes(2);
		expect(log.mock.calls[0]?.[0]).toBe("warn");
		expect(log.mock.calls[1]?.[0]).toBe("error");
	});

	it("does not log when disabled", () => {
		const log = vi.fn();
		const logger = createLogger({ disabled: true, level: "debug", log });

		logger.log("error", "silent");
		expect(log).not.toHaveBeenCalled();
	});
});
