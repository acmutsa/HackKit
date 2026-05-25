import type { BlobStorageAdapterWithView } from "@hackkit/core";
export type LocalBlobStorageOptions = {
    baseDir: string;
    filesRoutePrefix?: string;
    appBaseUrl?: string;
};
export type LocalBlobStorage = BlobStorageAdapterWithView & {
    resolveAbsolutePath(key: string): string;
    ensureDirectoryForKey(key: string): Promise<string>;
};
export declare function createLocalBlobStorage(options: LocalBlobStorageOptions): LocalBlobStorage;
//# sourceMappingURL=index.d.ts.map