import { describe, expect, it } from "vitest";
import { registerHackerSchema } from "../schemas";

const base = {
	authId: "hacker-auth",
	university: "Test U",
	major: "CS",
	levelOfStudy: "undergraduate",
	hackathonsAttended: 0,
	softwareExperience: "intermediate",
};

describe("registerHackerSchema resumeUrl", () => {
	it("accepts app-relative stored file references", () => {
		const result = registerHackerSchema.safeParse({
			...base,
			resumeUrl: "/api/files/view?key=resumes%2Fabc.pdf",
		});
		expect(result.success).toBe(true);
	});
});
