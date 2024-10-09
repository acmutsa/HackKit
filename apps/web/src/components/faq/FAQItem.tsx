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
			className="lg:data-[state=closed]:hover:scale-105 w-[100%] items-center self-start justify-self-center rounded-lg border-4 border-orange-500 bg-white px-6 text-orange-500 transition-transform"
			value={`item-${title}`}
		>
			<AccordionTrigger className="sm:text-3xl text-left font-oswald text-2xl font-bold">
				{title}
			</AccordionTrigger>
			<AccordionContent>
				<p className="font-mono text-xl">{children}</p>
			</AccordionContent>
		</AccordionItem>
	);
}
