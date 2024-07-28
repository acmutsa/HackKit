"use client";

import {
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/ui/accordion";
import FilterItem from "./FilterItem";

export default function FilterCategory({
  name,
  items,
}: {
  name: string;
  items: string[];
}) {
  console.log("data:", items);



  return (
    <>
      <AccordionItem value={name}>
        <AccordionTrigger>{name}</AccordionTrigger>
        {items.map((item: string) => (
          <FilterItem parentName={name} item={item} key={item}/>
        ))}
      </AccordionItem>
    </>
  );
}
