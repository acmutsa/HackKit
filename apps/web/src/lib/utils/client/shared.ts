export function getClientTimeZone(vercelIPTimeZone: string | null) {
	return vercelIPTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}
