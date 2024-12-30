import { redirect } from "next/navigation";
export function getClientTimeZone(vercelIPTimeZone: string | null) {
	return vercelIPTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}
export async function clientLogOut() {
	"use server";
	redirect("/");
}
