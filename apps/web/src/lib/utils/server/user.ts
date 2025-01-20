import { redirect } from "next/navigation";
export async function clientLogOut() {
	"use server";
	redirect("/");
}
