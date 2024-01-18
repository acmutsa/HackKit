import { SlashCommandBuilder, type CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("verify")
	.setDescription("Verify your registration and gain access to the server!");

export const execute = async (interaction: CommandInteraction) => {
	await interaction.reply("howdy!");
};
