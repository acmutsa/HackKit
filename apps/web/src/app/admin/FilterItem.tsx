"use client"

import {
  AccordionContent,
} from "@/components/shadcn/ui/accordion";

import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { createPath } from "@/lib/utils/shared/pageParams";

export default function FilterItem({parentName,item}:{parentName:string,item:string}){
    const isClicked = useRef(false);
    const path = usePathname();
    const params = useSearchParams();
    const router = useRouter();

    const user = params.get("user") ?? "";
    const page = params.get("page") ?? "1";
    const checkedBoxes = params.get("checkedBoxes") ?? "";

    console.log("Boxes checked",checkedBoxes);

    function handleClick(){
        if (isClicked.current) {
          isClicked.current = false;
          router.push(createPath(path, '1', user, checkedBoxes));
        } else {
          isClicked.current = true;
          router.push(createPath(path,'1',user,`${item}&`+checkedBoxes));
        }
    }

      
    return(
        <AccordionContent>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={item}
          onClick={handleClick}
        />
        <h3>{item}</h3>
      </div>
    </AccordionContent>
    )
}