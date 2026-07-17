import { ne } from "db";
import { NextFunction, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

export function loadCommands(client: any) {
	const commandsPath = path.join(__dirname, "../commands");
	if (!fs.existsSync(commandsPath)) {
		console.log("No commands folder found, aborting..");
		process.exit(1);
		return;
	}
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
	for (const file of commandFiles) {
		try {
			console.log(`[Loading Command] ${file}`);
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if (command && "data" in command && "execute" in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.warn(
					`The command at ${filePath} is missing a required "data" or "execute" property.`,
				);
			}
		} catch (err) {
			console.error(`Failed loading command ${file}:`, err);
		}
	}
	console.log(`Loaded ${client.commands?.size ?? 0} Commands`);
}

export function loadEvents(client: any) {
	const eventsPath = path.join(__dirname, "../events");
	if (!fs.existsSync(eventsPath)) {
		console.log("No events folder found, aborting..");
		process.exit(1);
		return;
	}
	const eventFiles = fs
		.readdirSync(eventsPath)
		.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
	for (const file of eventFiles) {
		try {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath);
			if (!event || !event.name || !event.execute) {
				console.warn(
					`Event at ${filePath} is missing name or execute.`,
				);
				continue;
			}
			if (event.once) {
				client.once(event.name, (...args: any[]) =>
					event.execute(...args),
				);
			} else {
				client.on(event.name, (...args: any[]) =>
					event.execute(...args),
				);
			}
			console.log(`[Loaded Event] ${event.name}`);
		} catch (err) {
			console.error(`Failed loading event ${file}:`, err);
		}
	}
}

export function loadInteractions(client: any) {
	const interactionsPath = path.join(__dirname, "../interactions");
	if (!fs.existsSync(interactionsPath)) {
		console.log("No interactions folder found, aborting..");
		process.exit(1);
		return;
	}
	const interactionFiles = fs
		.readdirSync(interactionsPath)
		.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
	for (const file of interactionFiles) {
		try {
			console.log(`[Loading Interaction] ${file}`);
			const filePath = path.join(interactionsPath, file);
			const interaction = require(filePath);
			// interaction should export `id` and `execute` or `customId` and `execute`
			const key =
				interaction.id || interaction.customId || interaction.name;
			if (!key || !interaction.execute) {
				console.warn(
					`Interaction at ${filePath} is missing id/customId/name or execute.`,
				);
				continue;
			}
			client.interactions.set(key, interaction);
		} catch (err) {
			console.error(`Failed loading interaction ${file}:`, err);
		}
	}
	console.log(`Loaded ${client.interactions?.size ?? 0} Interactions`);
}

export default { loadCommands, loadEvents, loadInteractions };

export type RequestWithClient = Request & { client?: any };

export function loadReceivers(app: any, client: any) {
	const receiversPath = path.join(__dirname, "../receivers");
	if (!fs.existsSync(receiversPath)) {
		console.log("No receivers folder found, aborting..");
		process.exit(1);
		return;
	}
	const receiverFiles = fs
		.readdirSync(receiversPath)
		.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
	for (const file of receiverFiles) {
		try {
			const filePath = path.join(receiversPath, file);
			const receiver = require(filePath);

			const base = path.basename(file, path.extname(file));
			const kebab = base
				.replace(/([a-z])([A-Z])/g, "$1-$2")
				.replace(/_/g, "-")
				.toLowerCase();
			const route = `/${kebab}`;

			console.log(`[Loading Receiver] ${route}`);

			if (receiver && "handler" in receiver) {
				app.post(
					route,
					(
						req: RequestWithClient,
						res: Response,
						next: NextFunction,
					) => {
						req.client = client;
						next();
					},
					receiver.handler,
				);
			} else {
				console.warn(
					`The receiver at ${filePath} is missing a required "handler" property.`,
				);
			}
		} catch (err) {
			console.error(`Failed loading receiver ${file}:`, err);
		}
	}
	console.log(`Loaded receivers: ${receiverFiles.length}`);
}
