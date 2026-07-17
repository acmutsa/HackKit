export const name = "interactionCreate";
export const once = false;

export async function execute(interaction: any) {
	try {
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
						content:
							"There was an error while executing this command!",
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content:
							"There was an error while executing this command!",
						ephemeral: true,
					});
				}
			}
		} else if (interaction.isButton()) {
			// Dispatch button interactions to loaded interaction handlers keyed by customId
			const handler = interaction.client.interactions?.get(
				interaction.customId,
			);
			if (!handler) {
				console.warn(
					`No interaction handler for id ${interaction.customId}`,
				);
				return;
			}
			try {
				await handler.execute(interaction);
			} catch (err) {
				console.error(
					`Error executing interaction handler ${interaction.customId}:`,
					err,
				);
			}
		}
	} catch (err) {
		console.error("Error in interaction handler:", err);
	}
}
