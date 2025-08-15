import Plunk from "@plunk/node";

if (!process.env.PLUNK_API_URL || !process.env.PLUNK_API_KEY) {
	console.warn(
		"Plunk API information is not defined... Did you add the relevant environment variables to the project?",
	);
}

export const plunk = new Plunk(process.env.PLUNK_API_KEY as string, {
	baseUrl: process.env.PLUNK_API_URL as string,
});

export { render } from "@react-email/render";

export * from "./utils";
