interface FileUploadOptions {
	presignHandlerUrl: string;
	contentType?: string;
}

interface PresignedUrlResponseMessage {
	url: string;
	key: string;
}

export async function put(
	location: string,
	file: File,
	options: FileUploadOptions,
): Promise<string> {
	const body = JSON.stringify({
		location,
		fileName: file.name,
	});

	const headers = new Headers();
	headers.append("Content-Type", options.contentType || file.type);

	// Obtain a presigned url from the server
	const presignedResponse = await fetch(options.presignHandlerUrl, {
		method: "POST",
		headers,
		body,
	}).catch((e) => {
		throw new Error(e.message + " Occurred when fetching presigned url");
	});

	if (!presignedResponse.ok) {
		throw new Error("An error occurred when fetching the presigned url");
	}

	const presignedMessage: PresignedUrlResponseMessage =
		await presignedResponse.json();

	if (!presignedMessage.url) {
		throw new Error("Malformed object returned from presign route");
	}

	// Upload the file to the presigned url
	const uploadResponse = await fetch(presignedMessage.url, {
		method: "PUT",
		body: file,
		headers,
	});

	if (!uploadResponse.ok) {
		throw new Error(
			`Unable to successfully upload file to bucket : ${uploadResponse.status} ${uploadResponse.statusText}`,
		);
	}

	return `/api/upload/resume/view?key=${presignedMessage.key}`;
}
