"use client";

import {
	AccordionItem,
	AccordionContent,
	AccordionTrigger,
} from "../shadcn/ui/accordion";
import type { PropsWithChildren } from "react";

interface Props {
	title: string | Readonly<string>;
}

export default function FAQItem({ title, children }: PropsWithChildren<Props>) {
	return (
		<AccordionItem
			className="border-orange-500 flex flex-col justify-center items-center border-4 rounded-lg justify-self-center text-orange-500 bg-white px-2 self-start w-[100%]"
			value={`item-${title}`}
		>
			<AccordionTrigger className="sm:text-3xl text-2xl font-bold text-center w-full font-oswald">
				{title}
			</AccordionTrigger>
			<AccordionContent className="px-6">
				<p className="text-xl font-mono">{children}</p>
			</AccordionContent>
		</AccordionItem>
	);
}
