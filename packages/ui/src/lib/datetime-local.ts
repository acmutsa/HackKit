export function toDateTimeLocalValue(value: Date): string {
	const offset = value.getTimezoneOffset();
	const local = new Date(value.getTime() - offset * 60_000);
	return local.toISOString().slice(0, 16);
}
