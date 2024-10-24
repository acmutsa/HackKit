"use client";

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
} from "../shadcn/ui/dropdown-menu";
import Link from "next/link";

export default function FooterLinks({
	title,
	data,
}: {
	title: string;
	data: Readonly<{ name: string; link: string }[]>;
}) {
	return (
		<>
			<div className="col-span-2 flex w-full lg:col-span-1 lg:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger className="text-md mx-auto font-bold">
						<h1 className="text-xl text-orange-500">{title}</h1>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="bg-white">
						{data.map(({ name, link }, idx) => (
							<DropdownMenuItem key={idx}>
								<Link
									className="block text-sm font-semibold text-orange-500"
									href={link}
								>
									{name}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="hidden flex-col lg:flex">
				<h1 className="mb-2 text-2xl font-bold text-orange-500">
					{title}
				</h1>
				{data.map(({ link, name }, idx) => (
					<Link
						href={link}
						className="text-sm text-zinc-950 hover:underline"
						key={idx}
					>
						<h1 className="font-semibold">{name}</h1>
					</Link>
				))}
			</div>
		</>
	);
}
