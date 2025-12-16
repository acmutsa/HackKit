import c from "config";
import { db } from "db";
import { discordVerification } from "db/schema";
import { nanoid } from "nanoid";

export const id = "verify";

export async function execute(interaction: any) {
	try {
		console.log("Verify interaction triggered");
		const user = interaction.member?.user;
		if (!user) {
			await interaction.reply({
				content: "There was an error while executing this interaction!",
				ephemeral: true,
			});
			return;
		}

		const vCode = nanoid(20);
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

		await interaction.reply({
			content: `Please click [this link](${c.siteUrl}/discord-verify?code=${vCode}) to verify your registration!`,
			ephemeral: true,
		});
	} catch (err) {
		console.error("Error in verify interaction:", err);
		try {
			if (!interaction.replied && !interaction.deferred) {
				await interaction.reply({
					content: "Internal error",
					ephemeral: true,
				});
			}
		} catch (e) {
			console.error("Failed to reply after verify error:", e);
		}
	}
}

export default { id, execute };
