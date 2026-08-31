import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	PermissionsBitField,
} from "discord.js";
import c from "config";

export const data = new SlashCommandBuilder()
	.setName("post-verify")
	.setDescription("Post the verification embed to this channel (admin only)");

export const execute = async (interaction: ChatInputCommandInteraction) => {
	// Ensure command is used in a guild
	if (!interaction.inGuild() || !interaction.guild) {
		await interaction.reply({
			content: "This command can only be used in a server.",
			ephemeral: true,
		});
		return;
	}

	// Check for administrator permission
	const hasAdmin = interaction.memberPermissions?.has(
		PermissionsBitField.Flags.Administrator,
	);
	if (!hasAdmin) {
		await interaction.reply({
			content:
				"You must have Administrator permissions to run this command.",
			ephemeral: true,
		});
		return;
	}

	const channel = interaction.channel;
	if (!channel || !channel.isTextBased()) {
		await interaction.reply({
			content: "This channel cannot receive messages from the bot.",
			ephemeral: true,
		});
		return;
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

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(verifyBtn);

	try {
		await channel.send({ embeds: [verifyEmbed], components: [row] });
		await interaction.reply({
			content: "Posted verification message.",
			ephemeral: true,
		});
	} catch (err) {
		console.error("Failed to post verification message:", err);
		await interaction.reply({
			content: "Failed to post verification message.",
			ephemeral: true,
		});
	}
};
