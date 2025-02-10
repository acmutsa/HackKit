import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";
import { redirect } from "next/navigation";
export function getClientTimeZone(vercelIPTimeZone: string | null) {
	return vercelIPTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatRegistrationField(
	fieldName: string,
	isOptional: boolean,
) {
	return `${fieldName}${!isOptional ? " *" : ""}`;
}

export function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export const dataTableFuzzyFilter: FilterFn<any> = (
	row,
	columnId,
	value,
	addMeta,
) => {
	// Rank the item
	const itemRank = rankItem(row.getValue(columnId), value);

	// Store the itemRank info
	addMeta({ itemRank });
	// Return if the item should be filtered in/out
	if (columnId === "name") {
		console.log(
			`row:, ${row.getValue(columnId)} value: ${value} itemRank: ${itemRank.passed}`,
		);
	}
	return itemRank.passed;
};
