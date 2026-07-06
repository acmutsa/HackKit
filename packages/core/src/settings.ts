import { z } from "zod";
import { HackKitError } from "./errors";

export type SettingKey = `${string}.${string}`;
export type SettingValueType = "boolean" | "number";
export type SettingValue = boolean | number;

export type BooleanSettingDefinition<TKey extends SettingKey = SettingKey> = {
	key: TKey;
	type: "boolean";
	defaultValue: boolean;
	label: string;
	description: string;
	category?: string;
};

export type NumberSettingDefinition<TKey extends SettingKey = SettingKey> = {
	key: TKey;
	type: "number";
	defaultValue: number;
	label: string;
	description: string;
	category?: string;
	integer?: boolean;
	min?: number;
	max?: number;
	unit?: string;
};

export type HackathonSettingDefinition<TKey extends SettingKey = SettingKey> =
	| BooleanSettingDefinition<TKey>
	| NumberSettingDefinition<TKey>;

export type SettingValueForDefinition<TDefinition> =
	TDefinition extends BooleanSettingDefinition ? boolean
		: TDefinition extends NumberSettingDefinition ? number
		: SettingValue;

export type ResolvedHackathonSetting<
	TDefinition extends HackathonSettingDefinition = HackathonSettingDefinition,
> = TDefinition & {
	value: SettingValueForDefinition<TDefinition>;
	isDefault: boolean;
	createdAt?: Date;
	createdByAuthId?: string;
	updatedAt?: Date;
	updatedByAuthId?: string;
};

export const CoreSetting = {
	RegistrationOpen: "core.registrationOpen",
	RequireApproval: "core.requireApproval",
	EventPassQrTtlMs: "core.eventPassQrTtlMs",
	MaximumRegistrations: "core.maximumRegistrations",
	HackathonCapacity: "core.hackathonCapacity",
	RsvpOpen: "core.rsvpOpen",
	RsvpLimit: "core.rsvpLimit",
	RsvpWaitlistEnabled: "core.rsvpWaitlistEnabled",
} as const satisfies Record<string, SettingKey>;

export type CoreSetting = (typeof CoreSetting)[keyof typeof CoreSetting];

export const coreSettings = [
	defineSetting({
		key: CoreSetting.RegistrationOpen,
		type: "boolean",
		defaultValue: true,
		label: "Hacker registration open",
		description: "Allow new hackers to complete hacker registration.",
		category: "Registration",
	}),
	defineSetting({
		key: CoreSetting.RequireApproval,
		type: "boolean",
		defaultValue: false,
		label: "Require organiser approval",
		description: "Require organisers to approve hackers before they receive full participant access.",
		category: "Registration",
	}),
	defineSetting({
		key: CoreSetting.MaximumRegistrations,
		type: "number",
		defaultValue: 0,
		integer: true,
		min: 0,
		unit: "hackers",
		label: "Maximum registrations",
		description: "Maximum number of hackers who may register. 0 means unlimited.",
		category: "Registration",
	}),
	defineSetting({
		key: CoreSetting.HackathonCapacity,
		type: "number",
		defaultValue: 0,
		integer: true,
		min: 0,
		unit: "hackers",
		label: "Hackathon capacity",
		description: "Maximum number of hackers who may be approved. 0 means unlimited.",
		category: "Registration",
	}),
	defineSetting({
		key: CoreSetting.RsvpOpen,
		type: "boolean",
		defaultValue: false,
		label: "RSVP open",
		description: "Allow approved hackers to claim a spot before arrival.",
		category: "RSVP",
	}),
	defineSetting({
		key: CoreSetting.RsvpLimit,
		type: "number",
		defaultValue: 0,
		integer: true,
		min: 0,
		unit: "hackers",
		label: "RSVP limit",
		description: "Maximum confirmed RSVPs. 0 means unlimited.",
		category: "RSVP",
	}),
	defineSetting({
		key: CoreSetting.RsvpWaitlistEnabled,
		type: "boolean",
		defaultValue: false,
		label: "RSVP waitlist",
		description: "Place hackers on an ordered waitlist after the RSVP limit is reached.",
		category: "RSVP",
	}),
	defineSetting({
		key: CoreSetting.EventPassQrTtlMs,
		type: "number",
		defaultValue: 5 * 60 * 1000,
		integer: true,
		min: 1000,
		unit: "milliseconds",
		label: "Event Pass QR TTL",
		description: "How long an Event Pass QR code remains valid, in milliseconds.",
		category: "Events",
	}),
] as const;

export type CoreSettingDefinition = (typeof coreSettings)[number];
export type CoreSettingValueMap = {
	[Definition in CoreSettingDefinition as Definition["key"]]: SettingValueForDefinition<Definition>;
};

export function defineSetting<const TDefinition extends HackathonSettingDefinition>(
	definition: TDefinition,
): TDefinition {
	return definition;
}

export function validateSettingValue(
	definition: HackathonSettingDefinition,
	value: unknown,
): SettingValue {
	let schema: z.ZodType<SettingValue>;
	if (definition.type === "boolean") {
		schema = z.boolean();
	} else {
		let numberSchema = z.number();
		if (definition.integer) numberSchema = numberSchema.int();
		if (definition.min !== undefined) numberSchema = numberSchema.min(definition.min);
		if (definition.max !== undefined) numberSchema = numberSchema.max(definition.max);
		schema = numberSchema;
	}
	const result = schema.safeParse(value);
	if (!result.success) {
		throw HackKitError.fromZod(result.error);
	}
	return result.data;
}
