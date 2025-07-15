"use client";
import { redirect, usePathname } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/ui/select";
import c from "config";

export default function MobileAdminTabSelect() {
	let curPath = usePathname().slice(7);
	curPath = curPath.charAt(0).toUpperCase() + curPath.slice(1);
	if (curPath == "") curPath = "Overview";
	if (curPath == "check-in") curPath = "Hackathon Check-in";

	return (
		<Select
			onValueChange={(e) => {
				redirect(e.valueOf());
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={curPath} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Tabs</SelectLabel>
					{Object.entries(c.dashPaths.admin).map(([name, path]) => (
						<SelectItem key={name} value={path}>
							{name}
						</SelectItem>
					))}
				</SelectGroup>
				<SelectGroup>
					<SelectLabel>Main</SelectLabel>
					<SelectItem key={"home"} value={"/"}>
						Home
					</SelectItem>
					<SelectItem key={"guide"} value={c.links.guide}>
						Survival Guide
					</SelectItem>
					<SelectItem key={"discord"} value={c.links.discord}>
						Discord
					</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
