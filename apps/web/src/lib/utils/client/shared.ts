import { ONE_HOUR_IN_MILLISECONDS } from "@/lib/constants";

export function getClientTimeZone(vercelIPTimeZone: string | null) {
	return vercelIPTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}