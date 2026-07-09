async function responseError(
	response: Response,
	fallback: string,
): Promise<Error> {
	try {
		const body = (await response.json()) as { error?: string };
		if (body.error) return new Error(body.error);
	} catch {
		// Use the actionable fallback when the server did not return JSON.
	}
	return new Error(fallback);
}

export async function uploadResumeFile(file: File): Promise<string> {
	if (file.type && file.type !== "application/pdf") {
		throw new Error(
			"Choose a PDF resume before submitting your registration.",
		);
	}

	const registerResponse = await fetch("/api/files/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			location: "resumes",
			fileName: file.name,
		}),
	});

	if (!registerResponse.ok) {
		throw await responseError(
			registerResponse,
			"Could not prepare your resume upload. Please sign in again and retry.",
		);
	}

	const { uploadUrl, storedFileReference } =
		(await registerResponse.json()) as {
			uploadUrl: string;
			storedFileReference: string;
		};

	const uploadResponse = await fetch(uploadUrl, {
		method: "PUT",
		body: file,
		headers: {
			"Content-Type": file.type || "application/pdf",
		},
	});

	if (!uploadResponse.ok) {
		throw await responseError(
			uploadResponse,
			"Could not upload your resume. Check your connection and retry.",
		);
	}

	return storedFileReference;
}
