export async function uploadResumeFile(file: File): Promise<string> {
	const registerResponse = await fetch("/api/files/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			location: "resumes",
			fileName: file.name,
		}),
	});

	if (!registerResponse.ok) {
		throw new Error("Could not prepare resume upload.");
	}

	const { uploadUrl, storedFileReference } = (await registerResponse.json()) as {
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
		throw new Error("Could not upload resume.");
	}

	return storedFileReference;
}
