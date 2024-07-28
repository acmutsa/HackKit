import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";

const args = process.execArgv;

if (!args.includes("--prod") && !args.includes("--dev")) {
	console.error(
		"You must specify either --prod or --dev when deploying commands.",
	);
	process.exit(1);
}

const runType: "dev" | "prod" = args.includes("--prod") ? "prod" : "dev";

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".ts"));
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ("data" in command && "execute" in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
		);
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_SECRET_TOKEN as string);

// and deploy your commands!
(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`,
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		if (runType === "dev") {
			const data = await rest.put(
				Routes.applicationGuildCommands(
					process.env.DISCORD_CLIENT_ID as string,
					process.env.DISCORD_DEV_SERVER_ID as string,
				),
				{
					body: commands,
				},
			);
			console.log(
				`Successfully reloaded ${(data as any).length} application (/) commands.`,
			);
		} else {
			const data = await rest.put(
				Routes.applicationGuildCommands(
					process.env.DISCORD_CLIENT_ID as string,
					process.env.DISCORD_PROD_SERVER_ID as string,
				),
				{
					body: commands,
				},
			);
			await rest.put(
				Routes.applicationCommands(
					process.env.DISCORD_CLIENT_ID as string,
				),
				{
					body: commands,
				},
			);
			console.log(
				`Successfully reloaded ${(data as any).length} application (/) commands.`,
			);
		}
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
