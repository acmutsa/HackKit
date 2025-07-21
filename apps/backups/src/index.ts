import { Hono } from "hono";
import {
	type ScheduledController,
	type ExecutionContext,
} from "@cloudflare/workers-types";
import { timingSafeEqual } from "node:crypto";
import { cors } from "hono/cors";
import { env } from "./env";
import { doBackup } from "./functions";

interface Env {}

// api stuff
const api = new Hono();

// middleware
api.use("/backup/*", cors()).use("/backup/*", async (c, next) => {
	// grab the bearer token from the request headers
	const authToken = c.req.header("Authorization") || "";
	const encoder = new TextEncoder();
	const expected = `Bearer ${env.BACKUPS_SECRET_KEY}`;
	if (
		authToken.length !== expected.length ||
		!timingSafeEqual(encoder.encode(authToken), encoder.encode(expected))
	) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	await next();
});

api.get("/health", (c) => {
	console.log("Health check endpoint hit");
	return c.json({ status: "ok" }, 200);
});

api.post("/backup", async (c) => {
	await doBackup();
	return c.json({ status: "Backup completed successfully" }, 200);
});

// cron stuff
const cron = async (
	controller: ScheduledController,
	env: Env,
	ctx: ExecutionContext,
) => {
	ctx.waitUntil(doBackup());
};

export default {
	fetch: api.fetch,
	scheduled: cron,
};
