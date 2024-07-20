type SearchParams = {
	[key: string]: string | undefined | string[];
};

export function createPath(path: string, params: SearchParams) {
	const pathCreated = `${path}?${params}`;
}

export function parseCheckBoxParams(params: string) {
	if (!params || params.length < 1) return "";

	return params.split("&");
}
