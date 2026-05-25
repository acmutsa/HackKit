import { mkdir, readFile } from "node:fs/promises";
import { dirname, join, normalize, relative, resolve } from "node:path";
import { randomUUID } from "node:crypto";
function sanitizeKey(key) {
    const normalized = normalize(key).replace(/^(\.\.(\/|\\|$))+/, "");
    if (normalized.startsWith("..")) {
        throw new Error("Invalid storage key.");
    }
    return normalized;
}
function buildStoredFileReference(filesRoutePrefix, key) {
    return `${filesRoutePrefix}/view?key=${encodeURIComponent(key)}`;
}
export function createLocalBlobStorage(options) {
    const baseDir = resolve(options.baseDir);
    const filesRoutePrefix = options.filesRoutePrefix ?? "/api/files";
    const appBaseUrl = options.appBaseUrl ?? "";
    const storage = {
        async getUploadTarget(input) {
            const extension = input.fileName.includes(".")
                ? input.fileName.split(".").pop()
                : undefined;
            const key = sanitizeKey(`${input.location}/${randomUUID()}${extension ? `.${extension}` : ""}`);
            const storedFileReference = buildStoredFileReference(filesRoutePrefix, key);
            const uploadUrl = `${appBaseUrl}${filesRoutePrefix}/upload?key=${encodeURIComponent(key)}`;
            return { uploadUrl, storedFileReference };
        },
        async readObject(input) {
            const key = sanitizeKey(input.key);
            const filePath = join(baseDir, key);
            const relativePath = relative(baseDir, filePath);
            if (relativePath.startsWith(".."))
                return null;
            try {
                const body = await readFile(filePath);
                return { body };
            }
            catch {
                return null;
            }
        },
        resolveAbsolutePath(key) {
            const sanitized = sanitizeKey(key);
            return join(baseDir, sanitized);
        },
        async ensureDirectoryForKey(key) {
            const filePath = storage.resolveAbsolutePath(key);
            await mkdir(dirname(filePath), { recursive: true });
            return filePath;
        },
    };
    return storage;
}
//# sourceMappingURL=index.js.map