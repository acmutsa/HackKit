export async function encodeFileAsBase64(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
			} else {
				reject(new Error("FileReader did not return a string."));
			}
		};

		reader.onerror = () => {
			reader.abort();
			reject(new DOMException("Problem parsing input file."));
		};

		reader.readAsDataURL(file);
	});
}

export async function decodeBase64AsFile(
	base64String: string,
	fileName: string,
) {
	// Extract the content type from the base64 string
	const contentType = base64String.match(/data:([^;]+);base64,/)?.[1];
	if (!contentType) {
		throw new Error("Invalid base64 string");
	}

	// Convert base64 string to a blob using fetch
	const response = await fetch(base64String);
	const blob = await response.blob();

	// Return the blob as a file
	return new File([blob], fileName, { type: contentType });
}
