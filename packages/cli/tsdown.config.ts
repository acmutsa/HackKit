import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/cli.ts", "src/index.ts"],
	format: "esm",
	dts: true,
	sourcemap: true,
	clean: true,
	target: "es2022",
	platform: "node",
	fixedExtension: false,
	deps: {
		alwaysBundle: ["@hackkit/core"],
		onlyBundle: false,
	},
});
