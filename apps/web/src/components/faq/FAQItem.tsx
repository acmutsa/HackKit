"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/client/cn";
import type { PropsWithChildren } from "react";

interface Props {
	title: string | Readonly<string>;
}

export default function FAQItem({ title, children }: PropsWithChildren<Props>) {
	const [shown, setShown] = useState(false);

	return (
		<div
			className="border-orange-500 flex flex-col justify-center items-center border-2 rounded-sm text-orange-500 bg-white cursor-pointer overflow-hidden justify-self-center py-3 px-5 container"
			onClick={() => setShown(!shown)}
		>
			<h1 className="text-4xl text-center">{title}</h1>
			<p
				className={cn(
					!shown ? "max-h-0" : "max-h-[1000px]",
					"duration-300 transition-[max-height] relative top-2 ease-linear"
				)}
			>
				{children}
			</p>
		</div>
	);
}
