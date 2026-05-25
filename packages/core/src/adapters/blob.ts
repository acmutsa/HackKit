export type BlobUploadTargetInput = {
	location: string;
	fileName: string;
};

export type BlobUploadTarget = {
	uploadUrl: string;
	storedFileReference: string;
};

export type BlobStorageAdapter = {
	getUploadTarget(input: BlobUploadTargetInput): Promise<BlobUploadTarget>;
};

export type BlobViewInput = {
	key: string;
};

export type BlobViewResult = {
	body: ReadableStream | Buffer | Uint8Array;
	contentType?: string;
};

export type BlobStorageAdapterWithView = BlobStorageAdapter & {
	readObject(input: BlobViewInput): Promise<BlobViewResult | null>;
};
