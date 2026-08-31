import { Client, Collection, GatewayIntentBits } from "discord.js";
import {
	loadCommands,
	loadEvents,
	loadInteractions,
	loadReceivers,
} from "./utils/loaders";
import express from "express";
import sharedSecretMiddleware from "./middleware";

/* DISCORD BOT */

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.commands = new Collection();
(client as any).interactions = new Collection();

// Load commands and events and interactions from according folders.
loadCommands(client);
loadEvents(client);
loadInteractions(client);

// Start an Express server for webhooks so other applications can communicate with the bot.
const expressApp = express();
expressApp.use(express.json());
expressApp.use(sharedSecretMiddleware);

expressApp.get("/", (req, res) => {
	res.send("Bot Receivers");
});

//Load receivers for bot's webhooks
loadReceivers(expressApp, client);

const RECEIVERS_PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
expressApp.listen(RECEIVERS_PORT, () => {
	console.log(`Bot receivers listening on port ${RECEIVERS_PORT}`);
});

client.login(process.env.DISCORD_SECRET_TOKEN);
