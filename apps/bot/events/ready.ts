import { db } from "db";
import { discordVerification } from "db/schema";
import { REST, Routes } from "discord.js";

export const name = "ready";
export const once = true;
export async function execute(client: any) {
	try {
		console.log(`Ready! Logged in as ${client.user?.tag}`);

		await db.delete(discordVerification).all();
		console.log("Cleared discord verification entries from database.");

		const token: string | undefined = process.env.DISCORD_SECRET_TOKEN;
		const clientId: string | undefined = process.env.DISCORD_CLIENT_ID;
		if (!token || !clientId) {
			console.warn(
				"Missing DISCORD_SECRET_TOKEN or DISCORD_CLIENT_ID; skipping command registration.",
			);
			return;
		}

		// Only deploy when the process is started with --deploy
		const shouldDeploy = process.argv.includes("--deploy");
		if (!shouldDeploy) {
			console.warn(
				"Command deployment skipped; run the bot with --deploy to deploy application commands.",
			);
			return;
		}

		const commands: any[] = [];
		client.commands?.forEach((cmd: any) => {
			if (cmd?.data && typeof cmd.data.toJSON === "function") {
				commands.push(cmd.data.toJSON());
			}
		});

		const rest = new REST({ version: "10" }).setToken(token);

		await rest.put(Routes.applicationCommands(clientId), { body: [] });
		console.log("Deleted existing application commands.");

		if (commands.length === 0) {
			console.warn("No commands to register after deletion.");
			return;
		}

		// Register globally; propagate changes may take up to 1 hour.
		await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		});
		console.log(`Registered ${commands.length} application commands.`);
	} catch (err) {
		console.error("Error in ready handler:", err);
	}
}
