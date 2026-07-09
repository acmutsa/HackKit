export type WebHandler = (request: Request) => Promise<Response>;

/**
 * Converts a Web-standard handler into the method exports expected by a Next
 * Route Handler. It intentionally does not read `next/headers()`: the Request
 * is forwarded unchanged to Better Call.
 */
export function toNextJsHandler(handler: WebHandler) {
	return {
		GET: handler,
		POST: handler,
		PUT: handler,
		PATCH: handler,
		DELETE: handler,
		HEAD: handler,
		OPTIONS: handler,
	};
}
