import "server-only";

import { createLocalBlobStorage, type LocalBlobStorage } from "@hackkit/blob-local";
import { createS3BlobStorage, type S3BlobStorage } from "@hackkit/blob-s3";
import type { BlobStorageAdapterWithView } from "@hackkit/core";
import type { HackkitBlobConfig } from "@hackkit/cli";
import hackkitConfig from "../hackkit.config";

function resolveAppBaseUrl(): string {
	return (
		process.env.BETTER_AUTH_URL ??
		process.env.NEXT_PUBLIC_APP_URL ??
		"http://localhost:3000"
	);
}

export function createBlobStorageFromConfig(): BlobStorageAdapterWithView {
	const blob = hackkitConfig.blob as HackkitBlobConfig | undefined;
	if (blob?.adapter === "s3") {
		return createS3BlobStorage({
			bucket: blob.bucket,
			region: blob.region,
			endpoint: blob.endpoint,
			accessKeyId: blob.accessKeyId ?? process.env.S3_ACCESS_KEY_ID,
			secretAccessKey:
				blob.secretAccessKey ?? process.env.S3_SECRET_ACCESS_KEY,
			filesRoutePrefix: blob.filesRoutePrefix,
		});
	}

	return createLocalBlobStorage({
		baseDir: blob?.adapter === "local" ? blob.baseDir : ".data/uploads",
		filesRoutePrefix:
			blob?.adapter === "local" ? blob.filesRoutePrefix : "/api/files",
		appBaseUrl: resolveAppBaseUrl(),
	});
}

let blobStorage: BlobStorageAdapterWithView | null = null;

export function getBlobStorage(): BlobStorageAdapterWithView {
	if (!blobStorage) {
		blobStorage = createBlobStorageFromConfig();
	}
	return blobStorage;
}

export function isLocalBlobStorage(
	storage: BlobStorageAdapterWithView,
): storage is LocalBlobStorage {
	return (
		"resolveAbsolutePath" in storage && "ensureDirectoryForKey" in storage
	);
}

export function isS3BlobStorage(
	storage: BlobStorageAdapterWithView,
): storage is S3BlobStorage {
	return "getPresignedViewUrl" in storage;
}
