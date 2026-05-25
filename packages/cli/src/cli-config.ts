import { createJiti } from "jiti";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { HackkitConfig } from "./config";

const jiti = createJiti(fileURLToPath(import.meta.url));

export async function loadConfig(configFile: string): Promise<HackkitConfig> {
	const configPath = resolve(process.cwd(), configFile);
	const module = await jiti.import(configPath);
	const config = ((module as { default?: HackkitConfig }).default ??
		module) as HackkitConfig;
	if (!config?.databaseUrl) {
		throw new Error(
			`No HackKit config with databaseUrl found at ${configPath}`,
		);
	}
	return config;
}
