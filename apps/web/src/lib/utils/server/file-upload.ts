import { S3 } from "./s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { staticUploads } from "config";

// TODO: refactor this function to not do scuffed of resume urls.  This will work for now.
export async function del(url: string): Promise<boolean> {
	const key = url.split("=")[1];

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
