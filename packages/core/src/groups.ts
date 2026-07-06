import { HackKitError } from "./errors";

export type HackkitGroupInput = {
	id: string;
	label?: string;
	enabled?: boolean;
	discordRoleId?: string;
	discordRoleName?: string;
};

export type HackkitGroup = {
	id: string;
	label: string;
	enabled: boolean;
	discordRoleId?: string;
	discordRoleName?: string;
};

export type GroupsInput = readonly (string | HackkitGroupInput)[];

function normalizeGroupId(id: string): string {
	return id.trim();
}

export function resolveGroups(input: GroupsInput = []): readonly HackkitGroup[] {
	const seen = new Set<string>();
	return input.map((group) => {
		const value =
			typeof group === "string"
				? { id: group }
				: group;
		const id = normalizeGroupId(value.id);
		if (!id) {
			throw new HackKitError("INVALID_OPERATION", "Group id is required.");
		}
		if (seen.has(id)) {
			throw new HackKitError("CONFLICT", `Group '${id}' is already configured.`);
		}
		seen.add(id);
		return {
			id,
			label: value.label?.trim() || id,
			enabled: value.enabled ?? true,
			discordRoleId: value.discordRoleId,
			discordRoleName: value.discordRoleName,
		};
	});
}

export function getEnabledGroups(groups: readonly HackkitGroup[]) {
	return groups.filter((group) => group.enabled);
}
