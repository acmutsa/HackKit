import superjson from "superjson";

export interface QRDataInterface {
	userID: string;
	createdAt: Date;
}

export function createQRpayload({ userID, createdAt }: QRDataInterface) {
	return superjson.stringify({ userID, createdAt });
}
