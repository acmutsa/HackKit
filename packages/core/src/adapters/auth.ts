import type { AuthId } from "../types.js";

export type AuthSession = {
	user: {
		id: string;
		email: string;
		name: string;
		image?: string | null;
	};
};

export type AuthIdentity = {
	email: string;
	firstName: string;
	lastName: string;
	profilePhotoUrl?: string;
};

export type AuthAdapter = {
	getSession(): Promise<AuthSession | null>;
	toAuthId(session: AuthSession): AuthId;
	getIdentity(session: AuthSession): AuthIdentity;
	syncStorage?(database: unknown): Promise<void>;
};
