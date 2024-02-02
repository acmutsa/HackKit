import { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { readdirSync } from "node:fs";
import path from "node:path";
import { Hono } from "hono";
import { serve } from "bun";
import c from "config";

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

const commandsPath = path.join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));
for (const file of commandFiles) {
	console.log(`[Loading Command] ${file}`);
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
		);
	}
}
console.log(`Loaded ${client.commands.size} Commands`);

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	}
});

client.login(process.env.DISCORD_SECRET_TOKEN);

/* WEB SERVER */

const app = new Hono();
app.get("/postMsgToServer", (h) => {
	const internalAuthKey = h.req.query("access");
	const serverType: string | undefined | "dev" | "prod" = h.req.query("env");
	if (!internalAuthKey || internalAuthKey != process.env.INTERNAL_AUTH_KEY) {
		return h.text("access denied");
	}
	if (!serverType || (serverType !== "dev" && serverType !== "prod")) {
		return h.text("invalid env");
	}

	const verifyEmbed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle("Verification")
		.setURL(c.siteUrl)
		.setAuthor({ name: c.botName, iconURL: c.siteUrl + c.icon.md, url: c.siteUrl })
		.setDescription(
			`**Verify your registration for ${c.hackathonName} ${c.itteration} to gain access to the rest of the server!**\n\nClick the "verify" button below to begin the verification process.\n\u200B`
		)
		.setThumbnail(`${c.siteUrl}${c.icon.md}`)
		.setFooter({
			text: "Questions or issues? Contact an organizer :)",
			iconURL: "https://static.acmutsa.org/Info_Simple.svg.png",
		});

	const channel = client.channels.cache.get(
		serverType === "dev"
			? (process.env.DISCORD_DEV_VERIFY_CHANNEL_ID as string)
			: (process.env.DISCORD_PROD_VERIFY_CHANNEL_ID as string)
	);

	if (!channel || !channel.isTextBased()) {
		return h.text("Invalid channel");
	}

	channel.send({
		embeds: [verifyEmbed],
	});
	return h.text(`Posted to channel!`);
});

serve({
	fetch: app.fetch,
	port: 4000,
});
