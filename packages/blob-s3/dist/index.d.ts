import type { BlobStorageAdapterWithView } from "@hackkit/core";
export type S3BlobStorageOptions = {
    bucket: string;
    region: string;
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    filesRoutePrefix?: string;
    presignExpiresInSeconds?: number;
};
export type S3BlobStorage = BlobStorageAdapterWithView & {
    getPresignedViewUrl(key: string): Promise<string>;
};
export declare function createS3BlobStorage(options: S3BlobStorageOptions): S3BlobStorage;
//# sourceMappingURL=index.d.ts.map