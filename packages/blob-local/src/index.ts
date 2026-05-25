import { mkdir, readFile } from "node:fs/promises";
import { dirname, join, normalize, relative, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import type {
	BlobStorageAdapterWithView,
	BlobUploadTarget,
	BlobViewResult,
} from "@hackkit/core";

export type LocalBlobStorageOptions = {
	baseDir: string;
	filesRoutePrefix?: string;
	appBaseUrl?: string;
};

function sanitizeKey(key: string): string {
	const normalized = normalize(key).replace(/^(\.\.(\/|\\|$))+/, "");
	if (normalized.startsWith("..")) {
		throw new Error("Invalid storage key.");
	}
	return normalized;
}

function buildStoredFileReference(
	filesRoutePrefix: string,
	key: string,
): string {
	return `${filesRoutePrefix}/view?key=${encodeURIComponent(key)}`;
}

export type LocalBlobStorage = BlobStorageAdapterWithView & {
	resolveAbsolutePath(key: string): string;
	ensureDirectoryForKey(key: string): Promise<string>;
};

export function createLocalBlobStorage(
	options: LocalBlobStorageOptions,
): LocalBlobStorage {
	const baseDir = resolve(options.baseDir);
	const filesRoutePrefix = options.filesRoutePrefix ?? "/api/files";
	const appBaseUrl = options.appBaseUrl ?? "";

	const storage: LocalBlobStorage = {
		async getUploadTarget(input): Promise<BlobUploadTarget> {
			const extension = input.fileName.includes(".")
				? input.fileName.split(".").pop()
				: undefined;
			const key = sanitizeKey(
				`${input.location}/${randomUUID()}${extension ? `.${extension}` : ""}`,
			);
			const storedFileReference = buildStoredFileReference(
				filesRoutePrefix,
				key,
			);
			const uploadUrl = `${appBaseUrl}${filesRoutePrefix}/upload?key=${encodeURIComponent(key)}`;
			return { uploadUrl, storedFileReference };
		},

		async readObject(input): Promise<BlobViewResult | null> {
			const key = sanitizeKey(input.key);
			const filePath = join(baseDir, key);
			const relativePath = relative(baseDir, filePath);
			if (relativePath.startsWith("..")) return null;
			try {
				const body = await readFile(filePath);
				return { body };
			} catch {
				return null;
			}
		},

		resolveAbsolutePath(key: string): string {
			const sanitized = sanitizeKey(key);
			return join(baseDir, sanitized);
		},

		async ensureDirectoryForKey(key: string): Promise<string> {
			const filePath = storage.resolveAbsolutePath(key);
			await mkdir(dirname(filePath), { recursive: true });
			return filePath;
		},
	};

	return storage;
}
