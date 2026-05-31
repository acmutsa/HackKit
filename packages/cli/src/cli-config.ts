import { loadHackkitConfig } from "@hackkit/config";

export async function loadConfig(configFile: string) {
	return loadHackkitConfig(configFile);
}
