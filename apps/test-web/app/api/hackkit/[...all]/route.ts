import { toNextJsHandler } from "@hackkit/next";
import { getRuntime } from "@/lib/runtime";

const handler = async (request: Request) => (await getRuntime()).api.handler(request);

export const { GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS } =
	toNextJsHandler(handler);
