import { S3 } from "./s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { staticUploads } from "config";

export async function del(key: string): Promise<boolean> {
	const cmd = new DeleteObjectCommand({
		Bucket: staticUploads.bucketName,
		Key: key,
	});

	try {
		await S3.send(cmd);
		return true;
	} catch (e) {
		console.log("Error occurred deleting a file with the S3 client");
		return false;
	}
}
