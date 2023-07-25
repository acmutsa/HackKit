"use client";
// import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { DropdownMenuItem } from "@/components/shadcn/ui/dropdown-menu";

function toggleTheme() {
	document.body.classList.toggle("dark");
	setCookie("hk_theme", [...document.body.classList].includes("dark") ? "dark" : "light", 365);
}

// function getCookie(cname: string) {
// 	let name = cname + "=";
// 	let decodedCookie = decodeURIComponent(document.cookie);
// 	let ca = decodedCookie.split(";");
// 	for (let i = 0; i < ca.length; i++) {
// 		let c = ca[i];
// 		while (c.charAt(0) == " ") {
// 			c = c.substring(1);
// 		}
// 		if (c.indexOf(name) == 0) {
// 			return c.substring(name.length, c.length);
// 		}
// 	}
// 	return "";
// }

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
