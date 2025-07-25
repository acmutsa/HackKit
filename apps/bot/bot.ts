import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} from "discord.js";
import { readdirSync } from "node:fs";
import path from "node:path";
import { Hono } from "hono";
import { serve } from "bun";
import c from "config";
import { db } from "db";
import { eq } from "db/drizzle";
import { discordVerification } from "db/schema";
import { getHacker } from "db/functions";
import { nanoid } from "nanoid";

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
const commandFiles = readdirSync(commandsPath).filter((file) =>
	file.endsWith(".ts"),
);
for (const file of commandFiles) {
	console.log(`[Loading Command] ${file}`);
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
		);
	}
}
console.log(`Loaded ${client.commands.size} Commands`);

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.get(
			interaction.commandName,
		);

		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`,
			);
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
	} else if (interaction.isButton()) {
		if (interaction.customId === "verify") {
			console.log("Button Pressed");
			const user = interaction.member?.user;
			if (!user) {
				interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
				return;
			}
			const vCode = nanoid(20);
			console.log(interaction.guildId);
			const verification = await db
				.insert(discordVerification)
				.values({
					code: vCode,
					discordName: user.username,
					discordProfilePhoto: user.avatar || "",
					discordUserID: user.id as string,
					discordUserTag: user.discriminator as string,
					status: "pending",
					guild: interaction.guildId as string,
				})
				.returning();

			interaction.reply({
				content: `Please click [this link](${c.siteUrl}/discord-verify?code=${vCode}) to verify your registration!`,
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

	const verifyBtn = new ButtonBuilder()
		.setCustomId("verify")
		.setLabel("Verify")
		.setStyle(ButtonStyle.Primary);

	const verifyEmbed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle("Verification")
		.setURL(c.siteUrl)
		.setAuthor({
			name: c.botName,
			iconURL: c.siteUrl + c.icon.md,
			url: c.siteUrl,
		})
		.setDescription(
			`**Verify your registration for ${c.hackathonName} ${c.itteration} to gain access to the rest of the server!**\n\nClick the "verify" button below to begin the verification process.\n\u200B`,
		)
		.setThumbnail(`${c.siteUrl}${c.icon.md}`)
		.setFooter({
			text: "Questions or issues? Contact an organizer :)",
			iconURL: "https://static.acmutsa.org/Info_Simple.svg.png",
		});

	const channel = client.channels.cache.get(
		serverType === "dev"
			? (process.env.DISCORD_DEV_VERIFY_CHANNEL_ID as string)
			: (process.env.DISCORD_PROD_VERIFY_CHANNEL_ID as string),
	);

	if (!channel || !channel.isTextBased()) {
		return h.text("Invalid channel");
	}

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(verifyBtn);

	channel.send({
		embeds: [verifyEmbed],
		components: [row],
	});
	return h.text(`Posted to channel!`);
});

app.get("/health", (h) => {
	return h.text("ok");
});

app.post("/api/checkDiscordVerification", async (h) => {
	const body = await h.req.json();
	const internalAuthKey = h.req.query("access");
	if (!internalAuthKey || internalAuthKey != process.env.INTERNAL_AUTH_KEY) {
		console.log("denied access");
		return h.text("access denied");
	}

	if (body.code === undefined || typeof body.code !== "string") {
		console.log("failed cause of malformed body");
		return h.json({ success: false });
	}

	console.log("got here 1");
	const verification = await db.query.discordVerification.findFirst({
		where: eq(discordVerification.code, body.code),
	});
	console.log("got here 1 with verification ", verification);

	if (!verification || !verification.clerkID) {
		console.log("failed cause of no verification or missing clerkID");
		return h.json({ success: false });
	}
	console.log("got here 2");

	const user = await getHacker(verification.clerkID);
	console.log("got here 2 with user", user);
	if (!user) {
		console.log("failed cause of no user in db");
		return h.json({ success: false });
	}

	const { discordRole: userGroupRoleName } = (
		c.groups as Record<string, { discordRole: string }>
	)[Object.keys(c.groups)[user.hackerData.group]];

	const guild = client.guilds.cache.get(verification.guild);
	if (!guild) {
		console.log("failed cause of no guild on intereaction");
		return h.json({ success: false });
	}

	const role = guild.roles.cache.find(
		(role) => role.name === c.botParticipantRole,
	);
	const userGroupRole = guild.roles.cache.find(
		(role) => role.name === userGroupRoleName,
	);

	if (!role || !userGroupRole) {
		console.log(
			"failed cause could not find a role, was looking for group " +
				user.hackerData.group +
				" called " +
				userGroupRoleName,
		);
		return h.json({ success: false });
	}

	const member = guild.members.cache.get(verification.discordUserID);

	if (!member) {
		console.log("failed cause could not find member");
		return h.json({ success: false });
	}

	await member.roles.add(role);
	await member.roles.add(userGroupRole);
	await member.setNickname(user.firstName + " " + user.lastName);

	return h.json({ success: true });
});

serve({
	fetch: app.fetch,
	port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
});
