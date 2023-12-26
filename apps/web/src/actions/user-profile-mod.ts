"use server";

import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "@/db";
import { users, profileData } from "@/db/schema";
import { eq } from "drizzle-orm";
import { profile } from "console";

// TODO: Add skill updating
export const modifyUserBioAndSkills = authenticatedAction(
	z.object({ bio: z.string().max(500), skills: z.string().max(100) }),
	async ({ bio, skills }, { userId }) => {
		const user = await db.query.users.findFirst({ where: eq(users.clerkID, userId) });
		if (!user) throw new Error("User not found");
		await db.update(profileData).set({ bio }).where(eq(profileData.hackerTag, user.hackerTag));
		return { success: true, newbio: bio };
	}
);
