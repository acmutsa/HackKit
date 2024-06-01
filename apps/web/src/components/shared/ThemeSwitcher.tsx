"use client";
import { DropdownMenuItem } from "@/components/shadcn/ui/dropdown-menu";

function toggleTheme() {
	document.body.classList.toggle("dark");
	setCookie("hk_theme", [...document.body.classList].includes("dark") ? "dark" : "light", 365);
}

function setCookie(cname: string, cvalue: string, exdays: number) {
	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function DropdownSwitcher() {
	return (
		<DropdownMenuItem className="cursor-pointer" onClick={() => toggleTheme()}>
			Toggle Theme
		</DropdownMenuItem>
	);
}
