import { z } from "zod";

import { createTRPCRouter, authedProcedure } from "@/server/api/trpc";
import { chats, tickets, ticketsToUsers } from "db/schema";
import { nanoid } from "nanoid";

export const ticketsRouter = createTRPCRouter({
	// hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
	// 	return {
	// 		greeting: `Hello ${input.text}`,
	// 	};
	// }),
	// create: publicProcedure
	// 	.input(z.object({ name: z.string().min(1) }))
	// 	.mutation(async ({ ctx, input }) => {
	// 		// simulate a slow db call
	// 		await new Promise((resolve) => setTimeout(resolve, 1000));
	// 		// await ctx.db.insert(posts).values({
	// 		// 	name: input.name,
	// 		// });
	// 	}),
	// getLatest: publicProcedure.query(({ ctx }) => {
	// 	// return ctx.db.query.posts.findFirst({
	// 	// 	orderBy: (posts, { desc }) => [desc(posts.createdAt)],
	// 	// });
	// 	return null;
	// }),

	// TODO: needs error handling
	create: authedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				description: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const ticketID = nanoid();

			await ctx.db.insert(tickets).values({
				id: ticketID,
				title: input.title,
				description: input.description,
				status: "awaiting",
			});

			await ctx.db.insert(ticketsToUsers).values({
				ticketID: ticketID,
				userID: ctx.userId,
			});

			const chatID = nanoid();

			await ctx.db.insert(chats).values({
				id: chatID,
				type: "ticket",
				ticketID: ticketID,
				author: ctx.userId,
				createdAt: new Date(),
			});

			return {
				success: true,
				ticketID: ticketID,
				chatID: chatID,
			};
		}),
});
