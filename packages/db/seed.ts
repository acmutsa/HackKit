import { db } from ".";
import { roles } from "./schema";

async function main() {
	const result = await db.insert(roles).values([
		{ name: "admin", position: 0, permissions: -1, color: "#FFFFFF" },
		{
			name: "hacker",
			position: 1,
			permissions: 0,
			color: "#00FF00",
		},
	]);

	if (result) {
		console.log("Successfully seeded roles.");
	}
}
