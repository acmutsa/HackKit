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
			className="w-[100%] items-center self-start justify-self-center rounded-lg border-4 border-orange-500 bg-white px-6 text-orange-500 transition-transform data-[state=closed]:hover:scale-105"
			value={`item-${title}`}
		>
			<AccordionTrigger className="text-left font-oswald text-2xl font-bold sm:text-3xl">
				{title}
			</AccordionTrigger>
			<AccordionContent>
				<p className="font-mono text-xl">{children}</p>
			</AccordionContent>
		</AccordionItem>
	);
}
