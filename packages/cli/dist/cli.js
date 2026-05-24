#!/usr/bin/env node
import { createJiti } from "jiti";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runDbSync } from "./db-sync.js";
const jiti = createJiti(fileURLToPath(import.meta.url));
async function loadConfig() {
    const configPath = resolve(process.cwd(), "hackkit.config.ts");
    const module = await jiti.import(configPath);
    const config = (module.default ??
        module);
    if (!config?.databaseUrl) {
        throw new Error(`No hackkit.config.ts with databaseUrl found at ${configPath}`);
    }
    return config;
}
async function main() {
    const [command, subcommand] = process.argv.slice(2);
    if (command === "db" && subcommand === "sync") {
        const config = await loadConfig();
        await runDbSync(config);
        return;
    }
    console.log("Usage: hackkit db sync");
    process.exitCode = 1;
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
//# sourceMappingURL=cli.js.map