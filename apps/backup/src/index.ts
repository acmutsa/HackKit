import { CronJob } from "cron";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { backup } from "./backup";
import { env } from "./env";

const app = new Hono();
app.get("/doBackup", async (c) => {
	const key = c.req.query("key");
	if (!key || key !== env.INTERNAL_AUTH_KEY) {
		c.status(401);
		return c.text("Unauthorized");
	}
	await backup();
	return c.text("Backup ran!");
});

const job = new CronJob(env.BACKUP_CRON_SCHEDULE, async () => {
	try {
		await backup();
	} catch (error) {
		console.error("Error while running backup: ", error);
	}
});

job.start();

console.log("Backup cron scheduled...");

serve(app);

console.log("Server started...");
