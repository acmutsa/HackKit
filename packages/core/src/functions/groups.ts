import { HackKitError } from "../errors";
import type { HackkitRuntimeContext } from "../hackkit-context";
import { coreModels } from "../models";
import type { AuthId, Hacker } from "../types";
import type { HackkitGroup } from "../groups";
import { getEnabledGroups } from "../groups";

export type GroupsApiContext = Pick<HackkitRuntimeContext, "db" | "now" | "groups">;

function countAssignments(
	hackers: readonly Hacker[],
	groups: readonly HackkitGroup[],
): Map<string, number> {
	const counts = new Map(groups.map((group) => [group.id, 0]));
	for (const hacker of hackers) {
		if (!hacker.group || !counts.has(hacker.group)) continue;
		counts.set(hacker.group, (counts.get(hacker.group) ?? 0) + 1);
	}
	return counts;
}

export function createGroupsApi(context: GroupsApiContext) {
	const { db, now, groups } = context;

	async function assignGroupToHacker(
		authId: AuthId,
		groupId: string,
	): Promise<Hacker> {
		const group = groups.find((candidate) => candidate.id === groupId);
		if (!group) {
			throw new HackKitError("NOT_FOUND", "Group not found.");
		}
		const [updated] = await db.update(
			coreModels.hacker,
			{ authId },
			{ group: group.id, updatedAt: now() },
		);
		if (!updated) {
			throw new HackKitError("NOT_FOUND", "Hacker not found.");
		}
		return updated;
	}

	return {
		listGroups(): readonly HackkitGroup[] {
			return groups;
		},

		async getGroupForAuthId(authId: AuthId): Promise<HackkitGroup | null> {
			const hacker = await db.findOne(coreModels.hacker, { authId });
			if (!hacker?.group) return null;
			return groups.find((group) => group.id === hacker.group) ?? null;
		},

		async assignGroup(input: {
			authId: AuthId;
			groupId: string;
		}): Promise<Hacker> {
			return assignGroupToHacker(input.authId, input.groupId);
		},

		async assignNextGroup(authId: AuthId): Promise<Hacker | null> {
			const hacker = await db.findOne(coreModels.hacker, { authId });
			if (!hacker) return null;
			if (hacker.group) return hacker;

			const enabledGroups = getEnabledGroups(groups);
			if (enabledGroups.length === 0) return hacker;

			const hackers = await db.findMany(coreModels.hacker);
			const counts = countAssignments(hackers, enabledGroups);
			const [nextGroup] = [...enabledGroups].sort((left, right) => {
				const countDelta =
					(counts.get(left.id) ?? 0) - (counts.get(right.id) ?? 0);
				if (countDelta !== 0) return countDelta;
				return (
					enabledGroups.findIndex((group) => group.id === left.id) -
					enabledGroups.findIndex((group) => group.id === right.id)
				);
			});
			if (!nextGroup) return hacker;
			return assignGroupToHacker(authId, nextGroup.id);
		},
	};
}

export type GroupsApi = ReturnType<typeof createGroupsApi>;
