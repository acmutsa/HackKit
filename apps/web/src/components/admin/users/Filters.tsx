"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/shadcn/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/shadcn/ui/accordion";
import FilterCategory from "./FilterCategory";

type categoryMap = {
	[key: string]: string[];
};

const categoriesMap: categoryMap = {
	Role: ["Hacker", "Volunteer", "Mentor"],
	Alphabetically: ["A-Z", "Z-A"],
	Timestamp: ["Most Recent", "Less Recent"],
};

export default function Filters() {
	return (
		<Card className="h-full max-w-4xl">
			<CardHeader className="">
				<CardTitle>Filters</CardTitle>
			</CardHeader>
			<CardContent className="">
				<Accordion type="single" collapsible className="max-w-full">
					{Object.keys(categoriesMap).map((name, index, category) => (
						<FilterCategory
							name={name}
							items={categoriesMap[name]}
							key={name}
						/>
					))}
				</Accordion>
			</CardContent>
		</Card>
	);
}
