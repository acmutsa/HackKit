import "server-only";

import {
	createLocalBlobStorage,
	type LocalBlobStorage,
} from "@hackkit/blob-local";
import { createS3BlobStorage, type S3BlobStorage } from "@hackkit/blob-s3";
import type { BlobStorageAdapterWithView } from "@hackkit/core";
import { appConfig, resolveAppBaseUrl } from "./app-config";
import { env } from "../env";

export function createBlobStorageFromConfig(): BlobStorageAdapterWithView {
	const blob = appConfig.blob;
	if (blob?.adapter === "s3") {
		return createS3BlobStorage({
			bucket: blob.bucket,
			region: blob.region,
			endpoint: blob.endpoint,
			accessKeyId: blob.accessKeyId ?? env.s3AccessKeyId,
			secretAccessKey: blob.secretAccessKey ?? env.s3SecretAccessKey,
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
